import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerStudent } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerStudent({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Create Student Account
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Join our Learning Management System
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Full Name */}
          <div>
            <label className="font-medium">Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-2 border rounded-lg px-4 py-3
                         focus:ring-2 focus:ring-blue-500
                         outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-2 border rounded-lg px-4 py-3
                         focus:ring-2 focus:ring-blue-500
                         outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full mt-2 border rounded-lg px-4 py-3
                         focus:ring-2 focus:ring-blue-500
                         outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-medium">Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full mt-2 border rounded-lg px-4 py-3
                         focus:ring-2 focus:ring-blue-500
                         outline-none"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg
                       hover:bg-blue-700 transition
                       disabled:bg-blue-400
                       disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login */}
        <p className="text-center mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-600 ml-2 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
