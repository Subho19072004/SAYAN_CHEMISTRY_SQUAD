import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =====================================================
// ADMIN AUTH
// =====================================================

export const loginAdmin = (formData) => {
  return API.post("/admin/login", formData);
};

export const changePassword = (formData) => {
  return API.put("/admin/change-password", formData);
};

export const forgotPassword = (formData) => {
  return API.post("/admin/forgot-password", formData);
};

export const verifyOtp = (formData) => {
  return API.post("/admin/verify-otp", formData);
};

export const resetPassword = (formData) => {
  return API.post("/admin/reset-password", formData);
};

export const resendOtp = (email) => {
  return API.post("/admin/resend-otp", { email });
};

// =====================================================
// ADMIN PROFILE
// =====================================================

export const updateProfile = (formData) => {
  return API.put("/admin/update-profile", formData);
};

// =====================================================
// STUDENTS
// =====================================================

export const getAllStudents = () => {
  return API.get("/student/all");
};

// =====================================================
// ATTENDANCE
// =====================================================

export const markAttendance = (data) => {
  return API.post("/attendance/mark", data);
};

export const getAttendanceByDate = (date) => {
  return API.get(`/attendance/date/${date}`);
};

export default API;
