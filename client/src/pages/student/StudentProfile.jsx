import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { updateStudentProfile } from "../../services/studentService";
import { getMe } from "../../services/authService";

function StudentProfile() {
  const { student, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setRefreshing(true);
      const res = await getMe();
      setProfile(res.data.student);

      setFormData((prev) => ({
        ...prev,
        name: res.data.student.name || "",
        phone: res.data.student.phone || "",
      }));
    } catch (error) {
      toast.error("Failed to load profile.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      toast.error("Please enter your current password to confirm changes.");
      return;
    }

    try {
      setLoading(true);

      const res = await updateStudentProfile(formData);

      toast.success(res.data.message || "Profile updated successfully");

      const token = localStorage.getItem("studentToken");
      login(token, {
        ...student,
        name: res.data.student.name,
        phone: res.data.student.phone,
      });

      setFormData((prev) => ({ ...prev, currentPassword: "" }));

      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (refreshing) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h2>
      <p className="text-gray-500 mb-8">
        View and update your personal information.
      </p>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <FaUserCircle className="text-7xl text-blue-600" />

          <div>
            <h3 className="text-xl font-bold text-gray-800">{profile?.name}</h3>
            <p className="text-gray-500">{profile?.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              {profile?.className} • {profile?.board}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full mt-2 border rounded-lg px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed.
            </p>
          </div>

          <div>
            <label className="font-medium text-gray-700">
              Current Password (required to save changes)
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full mt-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;
