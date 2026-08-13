import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSettings } from "../services/settingsService";

function Navbar() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        setSettings(res.data.data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo + Institute Name */}
        <Link to="/" className="flex items-center gap-3">
          {settings?.logo && (
            <img
              src={`http://localhost:5000${settings.logo}`}
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          )}

          <span className="text-3xl font-bold text-blue-600">
            {settings?.instituteName || "Sayan's Chemistry Squad"}
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>

          {/* Contact Section */}
          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>

          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
