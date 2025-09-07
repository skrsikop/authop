import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../configs/nodemailer.js';

/* ========== Helpers ========== */
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const otpExpiry = (mins = 10) => Date.now() + mins * 60 * 1000;

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

/* ========== Register ========== */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }


    const otp = generateOtp();
    const user = new User({
      name,
      email,
      password,
      otp,
      otpExpires: otpExpiry(10)
    });

    await user.save();

    // send OTP to user email
    await sendEmail(email, "Verify your account", `Your OTP code is: ${otp}`);

    return res.status(201).json({
      success: true,
      message: "User registered. OTP sent to your email.",
      userId: user._id
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ========== Verify OTP ========== */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid user" });

    // Trim OTP to avoid extra spaces/newline issues
    const enteredOtp = otp.toString().trim();
    const savedOtp = (user.otp || "").toString().trim();

    const isValid = savedOtp === enteredOtp && user.otpExpires > Date.now();
    if (!isValid) {
      console.log("Invalid OTP Attempt:", { savedOtp, enteredOtp, expires: user.otpExpires, now: Date.now() });
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isAccountVerified = true;
    user.otp = "";
    user.otpExpires = 0;
    await user.save();

    return res.json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ========== Login ========== */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Login failed: user not found", email);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isAccountVerified) {
      console.log("❌ Login failed: user not verified", email);
      return res.status(403).json({ success: false, message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Login failed: wrong password", { email, input: password, hash: user.password });
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, token);

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAccountVerified: user.isAccountVerified,
    };

    console.log("✅ Login success:", email);
    return res.json({ success: true, message: 'Logged in successfully', user: safeUser });
  } catch (err) {
    console.error("❌ Login Server Error:", err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


/* ========== Logout ========== */
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


/* ========== Password Reset Request ========== */
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: 'If that email exists, an OTP has been sent' });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpireAt = otpExpiry(10);
    await user.save();

    await sendEmail(user.email, 'Password Reset OTP', `Your reset OTP is: ${otp}`);

    return res.json({ success: true, message: 'If that email exists, an OTP has been sent' });
  } catch (err) {
    console.error("Password Reset Error:", err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


/* ========== Reset Password ========== */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid reset attempt' });

    const enteredOtp = otp.toString().trim();
    const savedOtp = (user.resetOtp || "").toString().trim();

    const isValid = savedOtp === enteredOtp && user.resetOtpExpireAt > Date.now();
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // password hashing handled by pre-save hook
    user.password = newPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};




/* ========== Resend OTP ========== */
export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account is already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = otpExpiry(10);
    await user.save();

    await sendEmail(user.email, "Resend OTP", `Your new OTP code is: ${otp}`);

    return res.json({ success: true, message: "A new OTP has been sent to your email" });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
