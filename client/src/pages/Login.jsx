import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginStudent } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Redirect already logged-in student
  useEffect(() => {
    const studentToken = localStorage.getItem("studentToken");

    if (studentToken) {
      navigate("/student/dashboard", { replace: true });
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle student login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginStudent(formData);

      console.log("Student Login Response:", res.data);

      // Store student authentication data
      const token = res.data.token;

      if (!token) {
        throw new Error("Student token was not received from server");
      }

      localStorage.setItem("studentToken", token);

      // Store student information if returned by backend
      if (res.data.student) {
        localStorage.setItem("student", JSON.stringify(res.data.student));
      }

      alert("Login Successful");

      // Redirect to student dashboard
      navigate("/student/dashboard", { replace: true });
    } catch (error) {
      console.error("Student Login Error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mt-2">Student Login</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="font-medium text-gray-700">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-2 border rounded-lg px-4 py-3
                         focus:outline-none focus:ring-2
                         focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-gray-700">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-2 border rounded-lg px-4 py-3
                         focus:outline-none focus:ring-2
                         focus:ring-blue-500"
              required
            />
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2" />
              Remember Me
            </label>

            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg
                       hover:bg-blue-700 transition
                       disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?
          <Link
            to="/register"
            className="text-blue-600 ml-2 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Admin Login */}
        <p className="text-center mt-4 text-sm text-gray-500">
          Admin?
          <Link
            to="/admin/login"
            className="text-blue-600 ml-1 hover:underline"
          >
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
