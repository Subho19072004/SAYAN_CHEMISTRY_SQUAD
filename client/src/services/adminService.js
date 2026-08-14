import API from "../api/axios";

// =====================================================
// ADMIN AUTH
// =====================================================

// Login Admin
export const loginAdmin = (formData) => {
  return API.post("/admin/login", formData);
};

// Change Password
export const changePassword = (formData) => {
  return API.put("/admin/change-password", formData);
};

// Forgot Password
export const forgotPassword = (formData) => {
  return API.post("/admin/forgot-password", formData);
};

// Verify OTP
export const verifyOtp = (formData) => {
  return API.post("/admin/verify-otp", formData);
};

// Reset Password
export const resetPassword = (formData) => {
  return API.post("/admin/reset-password", formData);
};

// Resend OTP
export const resendOtp = (email) => {
  return API.post("/admin/resend-otp", { email });
};

// =====================================================
// ADMIN PROFILE
// =====================================================

// Update Admin Profile
export const updateProfile = (formData) => {
  return API.put("/admin/update-profile", formData);
};

// =====================================================
// STUDENTS
// =====================================================

// Get All Students
export const getAllStudents = () => {
  return API.get("/student/all");
};

// =====================================================
// ATTENDANCE
// =====================================================

// Mark Attendance
export const markAttendance = (data) => {
  return API.post("/attendance/mark", data);
};

// Get Attendance By Date
export const getAttendanceByDate = (date) => {
  return API.get(`/attendance/date/${date}`);
};
