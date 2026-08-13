import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  registerStudent,
  loginStudent,
  getMe,
  getDashboardSummary,
  updateStudentProfile,
  changeStudentPassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
  getAllStudentsForAdmin,
} from "../controllers/studentController.js";

const router = express.Router();

// Public
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

// Protected (student only)
router.get("/me", protect, authorize("student"), getMe);
router.get("/dashboard", protect, authorize("student"), getDashboardSummary);
router.put(
  "/update-profile",
  protect,
  authorize("student"),
  updateStudentProfile,
);
router.put(
  "/change-password",
  protect,
  authorize("student"),
  changeStudentPassword,
);

// Protected (admin only)
router.get("/all", protect, authorize("admin"), getAllStudentsForAdmin);

export default router;
