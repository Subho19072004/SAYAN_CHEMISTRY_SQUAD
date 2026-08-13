import express from "express";

import {
  registerAdmin,
  loginAdmin,
  changePassword,
  updateProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
} from "../controllers/adminController.js";

const router = express.Router();

// Register Admin
router.post("/register", registerAdmin);

// Login Admin
router.post("/login", loginAdmin);

// Change Password
router.put("/change-password", changePassword);

// Update Admin Profile
router.put("/update-profile", updateProfile);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.post("/reset-password", resetPassword);

// Resend OTP
router.post("/resend-otp", resendOtp);

export default router;
