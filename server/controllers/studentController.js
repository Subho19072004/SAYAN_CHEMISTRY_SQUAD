import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import Attendance from "../models/Attendance.js";
import Notice from "../models/Notice.js";

// ======================================================
// Helper: Sign JWT
// ======================================================

const signToken = (student) => {
  return jwt.sign(
    {
      id: student._id,
      role: "student",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// ======================================================
// Register Student
// ======================================================

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();

    // Check existing student
    const existingStudent = await Student.findOne({
      email: cleanEmail,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await Student.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Student Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// ======================================================
// Login Student
// ======================================================

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const student = await Student.findOne({
      email: cleanEmail,
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = signToken(student);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        profileImage: student.profileImage,
        status: student.status,
      },
    });
  } catch (error) {
    console.error("Student Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ======================================================
// Get Logged-in Student
// ======================================================

export const getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select(
      "-password -otp -otpExpiry",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get Student Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Dashboard Summary
// ======================================================

export const getDashboardSummary = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select(
      "-password -otp -otpExpiry",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Attendance
    const attendanceRecords = await Attendance.find({
      student: req.user.id,
    });

    const totalClasses = attendanceRecords.length;

    const presentCount = attendanceRecords.filter(
      (record) => record.status === "Present",
    ).length;

    const attendancePercent =
      totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 100);

    // Notices
    const noticeCount = await Notice.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        courses: 0,
        pendingAssignments: 0,
        attendancePercent,
        notices: noticeCount,
      },
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Update Student Profile
// ======================================================

export const updateStudentProfile = async (req, res) => {
  try {
    const { name, currentPassword } = req.body;

    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Verify current password if supplied
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, student.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
    }

    if (name) {
      student.name = name.trim();
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",

      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        profileImage: student.profileImage,
        status: student.status,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Change Student Password
// ======================================================

export const changeStudentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new password are required",
      });
    }

    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    student.password = await bcrypt.hash(newPassword, 10);

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Forgot Password
// ======================================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const student = await Student.findOne({
      email: cleanEmail,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    student.otp = otp;

    student.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await student.save();

    await sendEmail(
      student.email,
      "Password Reset OTP",
      `Your OTP is ${otp}. It is valid for 5 minutes.`,
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Verify OTP
// ======================================================

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const student = await Student.findOne({
      email: cleanEmail,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.otp || !student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    if (new Date() > student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (student.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Reset Password
// ======================================================

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const student = await Student.findOne({
      email: cleanEmail,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.otp || !student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    if (new Date() > student.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (student.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash new password
    student.password = await bcrypt.hash(newPassword, 10);

    // Clear OTP
    student.otp = null;
    student.otpExpiry = null;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Resend OTP
// ======================================================

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const student = await Student.findOne({
      email: cleanEmail,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    student.otp = otp;

    student.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await student.save();

    await sendEmail(
      student.email,
      "Password Reset OTP",
      `Your OTP is ${otp}. It is valid for 5 minutes.`,
    );

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
};

// ======================================================
// Get All Students - Admin Only
// ======================================================

export const getAllStudentsForAdmin = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password -otp -otpExpiry")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Get All Students Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
