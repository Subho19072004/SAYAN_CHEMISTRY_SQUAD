import { useEffect, useState } from "react";

import {
  FaCog,
  FaUniversity,
  FaUser,
  FaLock,
  FaGlobe,
  FaSave,
  FaCamera,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import { toast } from "react-toastify";

import { getSettings, updateSettings } from "../../services/settingsService";

import { changePassword, updateProfile } from "../../services/adminService";

// ======================================================
// DEFAULT CENTRE
// ======================================================

const emptyCentre = {
  name: "",
  location: "",
};

// ======================================================
// SETTINGS COMPONENT
// ======================================================

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [logoPreview, setLogoPreview] = useState("");
  const [profilePreview, setProfilePreview] = useState("");

  // ====================================================
  // FORM DATA
  // ====================================================

  const [formData, setFormData] = useState({
    instituteName: "",
    tagline: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    website: "",
    address: "",

    adminName: "",
    adminEmail: "",

    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    facebook: "",
    instagram: "",
    youtube: "",
    telegram: "",

    themeColor: "#2563eb",
    secondaryColor: "#0f172a",

    academicSession: "",
    admissionStatus: "Open",

    logo: null,
    profileImage: null,

    centres: [
      {
        name: "",
        location: "",
      },
    ],
  });

  // ====================================================
  // LOAD SETTINGS
  // ====================================================

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await getSettings();

      if (res.data.success) {
        const data = res.data.data;

        setFormData((prev) => ({
          ...prev,
          ...data,

          // Never allow centres to become undefined
          centres:
            Array.isArray(data.centres) && data.centres.length > 0
              ? data.centres.map((centre) => ({
                  name: centre.name || "",
                  location: centre.location || "",
                }))
              : [{ ...emptyCentre }],

          // File objects should not come from API data
          logo: null,
          profileImage: null,
        }));

        if (data.logo) {
          setLogoPreview(`http://localhost:5000${data.logo}`);
        } else {
          setLogoPreview("");
        }

        if (data.profileImage) {
          setProfilePreview(`http://localhost:5000${data.profileImage}`);
        } else {
          setProfilePreview("");
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);

      toast.error(error.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // NORMAL INPUT CHANGE
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================================
  // CENTRE FUNCTIONS
  // ====================================================

  const handleCentreChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedCentres = [...prev.centres];

      updatedCentres[index] = {
        ...updatedCentres[index],
        [field]: value,
      };

      return {
        ...prev,
        centres: updatedCentres,
      };
    });
  };

  const addCentre = () => {
    setFormData((prev) => ({
      ...prev,
      centres: [
        ...prev.centres,
        {
          ...emptyCentre,
        },
      ],
    }));
  };

  const removeCentre = (index) => {
    setFormData((prev) => {
      // Keep at least one centre input
      if (prev.centres.length === 1) {
        return {
          ...prev,
          centres: [{ ...emptyCentre }],
        };
      }

      return {
        ...prev,
        centres: prev.centres.filter((_, centreIndex) => centreIndex !== index),
      };
    });
  };

  // ====================================================
  // LOGO
  // ====================================================

  const handleLogo = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      logo: file,
    }));

    setLogoPreview(URL.createObjectURL(file));
  };

  // ====================================================
  // PROFILE IMAGE
  // ====================================================

  const handleProfile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));

    setProfilePreview(URL.createObjectURL(file));
  };

  // ====================================================
  // SAVE SETTINGS
  // ====================================================

  const handleSave = async () => {
    try {
      setSaving(true);

      const data = new FormData();

      // ----------------------------------------------
      // General
      // ----------------------------------------------

      data.append("instituteName", formData.instituteName || "");

      data.append("tagline", formData.tagline || "");

      data.append("phone", formData.phone || "");

      data.append("whatsappNumber", formData.whatsappNumber || "");

      data.append("email", formData.email || "");

      data.append("website", formData.website || "");

      data.append("address", formData.address || "");

      // ----------------------------------------------
      // Admin
      // ----------------------------------------------

      data.append("adminName", formData.adminName || "");

      data.append("adminEmail", formData.adminEmail || "");

      // ----------------------------------------------
      // Academic
      // ----------------------------------------------

      data.append("academicSession", formData.academicSession || "");

      data.append("admissionStatus", formData.admissionStatus || "Open");

      // ----------------------------------------------
      // Social
      // ----------------------------------------------

      data.append("facebook", formData.facebook || "");

      data.append("instagram", formData.instagram || "");

      data.append("youtube", formData.youtube || "");

      data.append("telegram", formData.telegram || "");

      // ----------------------------------------------
      // Theme
      // ----------------------------------------------

      data.append("themeColor", formData.themeColor || "#2563eb");

      data.append("secondaryColor", formData.secondaryColor || "#0f172a");

      // ----------------------------------------------
      // CENTRES
      // ----------------------------------------------
      // IMPORTANT:
      // FormData cannot directly send an array of objects.
      // Convert centres to JSON first.
      // ----------------------------------------------

      const cleanedCentres = formData.centres
        .filter((centre) => centre.name?.trim() || centre.location?.trim())
        .map((centre) => ({
          name: centre.name?.trim() || "",
          location: centre.location?.trim() || "",
        }));

      data.append("centres", JSON.stringify(cleanedCentres));

      // ----------------------------------------------
      // Logo
      // ----------------------------------------------

      if (formData.logo instanceof File) {
        data.append("logo", formData.logo);
      }

      // ----------------------------------------------
      // Profile Image
      // ----------------------------------------------

      if (formData.profileImage instanceof File) {
        data.append("profileImage", formData.profileImage);
      }

      // ----------------------------------------------
      // API
      // ----------------------------------------------

      const res = await updateSettings(data);

      if (res.data.success) {
        toast.success("Settings updated successfully");

        // Reload database values
        await fetchSettings();
      }
    } catch (error) {
      console.error("Save settings error:", error);

      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // CHANGE PASSWORD
  // ====================================================

  const handleChangePassword = async () => {
    try {
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        return toast.error("All password fields are required");
      }

      if (formData.newPassword !== formData.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      const res = await changePassword({
        currentPassword: formData.currentPassword,

        newPassword: formData.newPassword,
      });

      toast.success(res.data.message);

      setFormData((prev) => ({
        ...prev,

        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  // ====================================================
  // UPDATE ADMIN PROFILE
  // ====================================================

  const handleUpdateProfile = async () => {
    try {
      if (
        !formData.adminName ||
        !formData.adminEmail ||
        !formData.currentPassword
      ) {
        return toast.error("Name, email and current password are required");
      }

      const res = await updateProfile({
        name: formData.adminName,
        email: formData.adminEmail,
        currentPassword: formData.currentPassword,
      });

      toast.success(res.data.message);

      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* =================================================
          IMPORTANT:
          No Sidebar here.
          AdminLayout already provides the Sidebar.
      ================================================= */}

      <main className="flex-1 p-6 lg:p-10 bg-slate-100 overflow-y-auto">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl p-8 flex flex-col lg:flex-row justify-between items-center text-white">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FaCog />
              Settings
            </h1>

            <p className="mt-3 text-blue-100">
              Manage institute, administrator and website settings.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 lg:mt-0 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
            <p className="text-gray-500">Institute</p>

            <h2 className="font-bold text-xl mt-2">
              {formData.instituteName || "Not Set"}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
            <p className="text-gray-500">Administrator</p>

            <h2 className="font-bold text-xl mt-2">
              {formData.adminName || "Admin"}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
            <p className="text-gray-500">Centres</p>

            <h2 className="font-bold text-xl mt-2">
              {
                formData.centres.filter(
                  (centre) => centre.name?.trim() || centre.location?.trim(),
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
            <p className="text-gray-500">Admission</p>

            <h2
              className={`font-bold mt-2 ${
                formData.admissionStatus === "Open"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formData.admissionStatus}
            </h2>
          </div>
        </div>

        {/* =================================================
            SETTINGS PANEL
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-lg mt-8 overflow-hidden">
          {/* =================================================
              TABS
          ================================================= */}

          <div className="border-b p-5 flex flex-wrap gap-3">
            {[
              {
                id: "general",
                label: "General",
                icon: <FaUniversity />,
              },
              {
                id: "admin",
                label: "Admin",
                icon: <FaUser />,
              },
              {
                id: "security",
                label: "Security",
                icon: <FaLock />,
              },
              {
                id: "social",
                label: "Social",
                icon: <FaGlobe />,
              },
              {
                id: "website",
                label: "Website",
                icon: <FaCog />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* =================================================
              TAB CONTENT
          ================================================= */}

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* =================================================
                    GENERAL
                ================================================= */}

                {activeTab === "general" && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800">
                        General Settings
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Update your institute information.
                      </p>
                    </div>

                    {/* GENERAL INFORMATION */}

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-semibold mb-2">
                          Institute Name
                        </label>

                        <input
                          type="text"
                          name="instituteName"
                          value={formData.instituteName}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Tagline
                        </label>

                        <input
                          type="text"
                          name="tagline"
                          value={formData.tagline}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Phone Number
                        </label>

                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          WhatsApp Number
                        </label>

                        <input
                          type="text"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={handleChange}
                          placeholder="e.g. 917003349913"
                          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Website
                        </label>

                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://example.com"
                          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block font-semibold mb-2">
                          Main Address
                        </label>

                        <textarea
                          rows={4}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your main institute address"
                          className="w-full border rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* =================================================
                        OUR CENTRES
                    ================================================= */}

                    <div className="border border-gray-300 rounded-2xl p-7 bg-gray-50">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-7">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <FaMapMarkerAlt className="text-blue-600" />
                            Our Centres
                          </h3>

                          <p className="text-gray-500 mt-2">
                            Add and manage your institute centre locations.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={addCentre}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                        >
                          <FaPlus />
                          Add Centre
                        </button>
                      </div>

                      <div className="space-y-5">
                        {formData.centres.map((centre, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>

                                <h4 className="font-bold text-lg">
                                  Centre {index + 1}
                                </h4>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeCentre(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition"
                                title="Remove Centre"
                              >
                                <FaTrash />
                              </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                              <div>
                                <label className="block font-semibold mb-2">
                                  Centre Name
                                </label>

                                <input
                                  type="text"
                                  value={centre.name}
                                  onChange={(e) =>
                                    handleCentreChange(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g. Dinu Lane"
                                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>

                              <div>
                                <label className="block font-semibold mb-2">
                                  Location / Address
                                </label>

                                <input
                                  type="text"
                                  value={centre.location}
                                  onChange={(e) =>
                                    handleCentreChange(
                                      index,
                                      "location",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g. Opp. Kadamtala Bus Stand"
                                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <div className="border rounded-2xl p-8 bg-gray-50">
                      <h3 className="text-xl font-bold mb-6">Institute Logo</h3>

                      <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-white">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaCamera className="text-6xl text-gray-400" />
                          )}
                        </div>

                        <div>
                          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl inline-flex items-center gap-2">
                            <FaCamera />
                            Upload Logo
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleLogo}
                            />
                          </label>

                          <p className="mt-4 text-gray-500 text-sm">
                            Recommended size: 512 × 512 px
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    ADMIN
                ================================================= */}

                {activeTab === "admin" && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800">
                        Administrator Profile
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Update administrator information.
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* PROFILE IMAGE */}

                      <div className="bg-gray-50 rounded-2xl border p-8 flex flex-col items-center">
                        <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-blue-500">
                          {profilePreview ? (
                            <img
                              src={profilePreview}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <FaUser className="text-7xl text-gray-400" />
                            </div>
                          )}
                        </div>

                        <label className="mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl inline-flex items-center gap-2">
                          <FaCamera />
                          Upload Photo
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleProfile}
                          />
                        </label>
                      </div>

                      {/* ADMIN DETAILS */}

                      <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-2 font-semibold">
                            Full Name
                          </label>

                          <input
                            type="text"
                            name="adminName"
                            value={formData.adminName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 font-semibold">
                            Email
                          </label>

                          <input
                            type="email"
                            name="adminEmail"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block mb-2 font-semibold">
                            Current Password
                          </label>

                          <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                          />
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                          <button
                            onClick={handleUpdateProfile}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                          >
                            Update Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    SECURITY
                ================================================= */}

                {activeTab === "security" && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800">
                        Security
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Change your administrator password.
                      </p>
                    </div>

                    <div className="grid gap-6">
                      <div>
                        <label className="block mb-2 font-semibold">
                          Current Password
                        </label>

                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">
                          New Password
                        </label>

                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">
                          Confirm Password
                        </label>

                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleChangePassword}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    SOCIAL
                ================================================= */}

                {activeTab === "social" && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FaGlobe className="text-blue-600" />
                        Social Media
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Add your institute social media links.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-semibold">
                          Facebook
                        </label>

                        <input
                          type="text"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleChange}
                          placeholder="https://facebook.com/..."
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">
                          Instagram
                        </label>

                        <input
                          type="text"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleChange}
                          placeholder="https://instagram.com/..."
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">
                          YouTube
                        </label>

                        <input
                          type="text"
                          name="youtube"
                          value={formData.youtube}
                          onChange={handleChange}
                          placeholder="https://youtube.com/..."
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">
                          Telegram
                        </label>

                        <input
                          type="text"
                          name="telegram"
                          value={formData.telegram}
                          onChange={handleChange}
                          placeholder="https://t.me/..."
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    WEBSITE
                ================================================= */}

                {activeTab === "website" && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800">
                        Website Settings
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Configure website appearance and admission settings.
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-semibold">
                          Primary Theme Color
                        </label>

                        <input
                          type="color"
                          name="themeColor"
                          value={formData.themeColor}
                          onChange={handleChange}
                          className="w-20 h-14"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">
                          Secondary Theme Color
                        </label>

                        <input
                          type="color"
                          name="secondaryColor"
                          value={formData.secondaryColor}
                          onChange={handleChange}
                          className="w-20 h-14"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">
                          Academic Session
                        </label>

                        <input
                          type="text"
                          name="academicSession"
                          value={formData.academicSession}
                          onChange={handleChange}
                          placeholder="2026-2027"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-semibold">
                          Admission Status
                        </label>

                        <select
                          name="admissionStatus"
                          value={formData.admissionStatus}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        >
                          <option value="Open">Open</option>

                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* THEME PREVIEW */}

                    <div
                      className="rounded-2xl p-8 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${formData.themeColor}, ${formData.secondaryColor})`,
                      }}
                    >
                      <h2 className="text-4xl font-bold">
                        {formData.instituteName || "Institute Name"}
                      </h2>

                      <p className="mt-2">
                        {formData.tagline || "Institute Tagline"}
                      </p>

                      <button className="mt-6 bg-white text-black px-6 py-2 rounded-xl">
                        {formData.admissionStatus === "Open"
                          ? "Admission Open"
                          : "Admission Closed"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
