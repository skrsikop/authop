import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // OTP fields
  otp: { type: String, default: "" },
  otpExpires: { type: Number, default: 0 },

  // Reset password OTP
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },

  isAccountVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password automatically before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
