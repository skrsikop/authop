import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/auth", // backend server URL
  withCredentials: true,
});

// Register user
export const register = (data) => API.post("/register", data);

// Verify OTP
export const verifyOtp = (data) => API.post("/verify-otp", data);


// Resend OTP
export const resendOtp = (email) => API.post("/resend-otp", { email });

// Login user
export const login = (data) => API.post("/login", data);

// Logout
export const logout = () => API.post("/logout");

// Password reset flow
export const requestPasswordReset = (email) => API.post("/password/request-otp", { email });
export const resetPassword = (data) => API.post("/password/reset", data);

// Get current user
export const me = () => API.get("/me");
