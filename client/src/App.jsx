import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==================== PUBLIC PAGES ====================
import Home from "./pages/Home";
import Admission from "./pages/Admission";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import About from "./pages/About";
import InstructorDashboard from "./pages/InstructorDashboard";
import NotFound from "./pages/NotFound";

// ==================== PROTECTED ROUTES ====================
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";

// ==================== ADMIN PAGES ====================
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Admissions from "./pages/admin/Admissions";
import Notices from "./pages/admin/Notices";
import Students from "./pages/admin/Students";
import Gallery from "./pages/admin/Gallery";
import Settings from "./pages/admin/Settings";
import AdminAttendance from "./pages/admin/Attendance";

// ==================== ADMIN LAYOUT ====================
import AdminLayout from "./layouts/AdminLayout";

// ==================== ADMIN AUTH ====================
import ForgotPassword from "./pages/admin/ForgotPassword";
import VerifyOtp from "./pages/admin/VerifyOtp";
import ResetPassword from "./pages/admin/ResetPassword";

// ==================== STUDENT LAYOUT ====================
import StudentLayout from "./layouts/StudentLayout";

// ==================== STUDENT PAGES ====================
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSettings from "./pages/student/StudentSettings";
import Notifications from "./pages/student/Notifications";
import StudentAttendance from "./pages/student/Attendance";
import ComingSoon from "./pages/student/ComingSoon";

// ==================== STUDENT AUTH ====================
import StudentForgotPassword from "./pages/student/ForgotPassword";
import StudentVerifyOtp from "./pages/student/VerifyOtp";
import StudentResetPassword from "./pages/student/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/admission" element={<Admission />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/instructor" element={<InstructorDashboard />} />

        {/* =====================================================
            STUDENT AUTH - FORGOT PASSWORD
        ===================================================== */}

        <Route path="/forgot-password" element={<StudentForgotPassword />} />

        <Route path="/verify-otp" element={<StudentVerifyOtp />} />

        <Route path="/reset-password" element={<StudentResetPassword />} />

        {/* =====================================================
            ADMIN AUTH ROUTES
        ===================================================== */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/forgot-password" element={<ForgotPassword />} />

        <Route path="/admin/verify-otp" element={<VerifyOtp />} />

        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* =====================================================
            ADMIN PROTECTED ROUTES
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Dashboard />} />

          <Route path="/admin/admissions" element={<Admissions />} />

          <Route path="/admin/students" element={<Students />} />

          <Route path="/admin/attendance" element={<AdminAttendance />} />

          <Route path="/admin/notices" element={<Notices />} />

          <Route path="/admin/gallery" element={<Gallery />} />

          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        {/* =====================================================
            STUDENT PROTECTED ROUTES
        ===================================================== */}

        <Route
          element={
            <ProtectedStudentRoute>
              <StudentLayout />
            </ProtectedStudentRoute>
          }
        >
          <Route path="/student/dashboard" element={<StudentDashboard />} />

          <Route path="/student/profile" element={<StudentProfile />} />

          <Route path="/student/settings" element={<StudentSettings />} />

          <Route path="/student/notifications" element={<Notifications />} />

          <Route path="/student/attendance" element={<StudentAttendance />} />

          <Route path="/student/courses" element={<ComingSoon />} />

          <Route path="/student/assignments" element={<ComingSoon />} />

          <Route path="/student/calendar" element={<ComingSoon />} />

          <Route path="/student/live-classes" element={<ComingSoon />} />

          <Route path="/student/pdf-notes" element={<ComingSoon />} />

          <Route path="/student/quiz" element={<ComingSoon />} />
        </Route>

        {/* =====================================================
            404
        ===================================================== */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
