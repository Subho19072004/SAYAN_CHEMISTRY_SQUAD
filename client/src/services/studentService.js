import API from "./authService";

// Dashboard summary stats (courses, assignments, attendance %, notices)
export const getDashboardSummary = () => {
  return API.get("/student/dashboard");
};

// Update Student Profile
export const updateStudentProfile = (formData) => {
  return API.put("/student/update-profile", formData);
};

// Change Student Password
export const changeStudentPassword = (formData) => {
  return API.put("/student/change-password", formData);
};
// Get My Attendance
export const getMyAttendance = () => {
  return API.get("/attendance/my");
};
