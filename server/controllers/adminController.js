import sendEmail from "../utils/sendEmail.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate OTP expiry - 5 minutes
const getOTPExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

// Get JWT token from Authorization header
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

/* =========================================================
   REGISTER ADMIN
========================================================= */

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    // Validation
    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing admin
    const existingAdmin = await Admin.findOne({
      email: cleanEmail,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Register Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   LOGIN ADMIN
========================================================= */

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email?.trim().toLowerCase();

    // Validation
    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        success: false,
        message: "JWT configuration error",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   CHANGE PASSWORD
========================================================= */

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Get token
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token required",
      });
    }

    // Verify token
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Find admin
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword } = req.body;

    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required",
      });
    }

    // Get token
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token required",
      });
    }

    // Verify token
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Find admin
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check email uniqueness
    if (cleanEmail && cleanEmail !== admin.email) {
      const emailExists = await Admin.findOne({
        email: cleanEmail,
        _id: { $ne: admin._id },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      admin.email = cleanEmail;
    }

    // Update name
    if (cleanName) {
      admin.name = cleanName;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export const forgotPassword = async (req, res) => {
  try {
    const cleanEmail = req.body.email?.trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    admin.otp = otp;
    admin.otpExpiry = getOTPExpiry();

    await admin.save();

    // Send email
    await sendEmail(
      admin.email,
      "Password Reset OTP",
      `Your OTP is ${otp}. It is valid for 5 minutes.`,
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

/* =========================================================
   VERIFY OTP
========================================================= */

export const verifyOtp = async (req, res) => {
  try {
    const cleanEmail = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();

    if (!cleanEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check OTP
    if (!admin.otp || !admin.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    // Check expiry
    if (new Date() > admin.otpExpiry) {
      admin.otp = null;
      admin.otpExpiry = null;

      await admin.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Compare OTP
    if (admin.otp !== otp) {
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
      message: "Server error",
    });
  }
};

/* =========================================================
   RESET PASSWORD
========================================================= */

export const resetPassword = async (req, res) => {
  try {
    const cleanEmail = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();
    const { newPassword } = req.body;

    // Validation
    if (!cleanEmail || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find admin
    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check OTP
    if (!admin.otp || !admin.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated",
      });
    }

    // Check expiry
    if (new Date() > admin.otpExpiry) {
      admin.otp = null;
      admin.otpExpiry = null;

      await admin.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Verify OTP
    if (admin.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);

    // Clear OTP
    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   RESEND OTP
========================================================= */

export const resendOtp = async (req, res) => {
  try {
    const cleanEmail = req.body.email?.trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Save new OTP
    admin.otp = otp;
    admin.otpExpiry = getOTPExpiry();

    await admin.save();

    // Send email
    await sendEmail(
      admin.email,
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
