import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Reads JWT from cookie 'token', verifies it, and loads req.user
 */
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Auth token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default requireAuth;
