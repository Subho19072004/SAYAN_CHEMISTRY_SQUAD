import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// ======================================================
// Attach Student Token Automatically
// ======================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("studentToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ======================================================
// Student Registration
// ======================================================

export const registerStudent = (formData) => {
  return API.post("/student/register", formData);
};

// ======================================================
// Student Login
// ======================================================

export const loginStudent = (formData) => {
  return API.post("/student/login", formData);
};

// ======================================================
// Get Logged-in Student
// ======================================================

export const getMe = () => {
  return API.get("/student/me");
};

// ======================================================
// Student Forgot Password
// ======================================================

export const forgotPassword = (formData) => {
  return API.post("/student/forgot-password", formData);
};

// ======================================================
// Student Verify OTP
// ======================================================

export const verifyOtp = (formData) => {
  return API.post("/student/verify-otp", formData);
};

// ======================================================
// Student Reset Password
// ======================================================

export const resetPassword = (formData) => {
  return API.post("/student/reset-password", formData);
};

// ======================================================
// Student Resend OTP
// ======================================================

export const resendOtp = (email) => {
  return API.post("/student/resend-otp", {
    email,
  });
};

export default API;
