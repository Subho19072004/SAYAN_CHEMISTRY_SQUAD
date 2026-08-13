import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/adminService";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email: cleanEmail,
      });

      toast.success(response.data?.message || "OTP sent successfully");

      navigate("/admin/verify-otp", {
        state: {
          email: cleanEmail,
        },
      });
    } catch (error) {
      console.error("Forgot Password Error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to send OTP. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>

          <p className="text-gray-500 mt-2">
            Enter your admin email to receive an OTP.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Admin Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              autoComplete="email"
              disabled={loading}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* Back to Login */}
        <button
          type="button"
          onClick={() => navigate("/admin/login")}
          disabled={loading}
          className="w-full mt-4 text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
