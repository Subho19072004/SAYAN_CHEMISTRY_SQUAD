import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  markAttendance,
  getAttendanceByDate,
  getMyAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Admin
router.post("/mark", protect, authorize("admin"), markAttendance);
router.get("/date/:date", protect, authorize("admin"), getAttendanceByDate);

// Student
router.get("/my", protect, authorize("student"), getMyAttendance);

export default router;
