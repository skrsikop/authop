import express from 'express';
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  me,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

/* Public */
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/logout', logout); // Can be public; just clears cookie if present

/* Password reset */
router.post('/password/request-otp', requestPasswordReset);
router.post('/password/reset', resetPassword);


export default router;
