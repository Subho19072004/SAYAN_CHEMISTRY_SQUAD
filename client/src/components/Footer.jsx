import { useEffect, useState } from "react";
import { getSettings } from "../services/settingsService";

function Footer() {
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
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* ================= BRAND ================= */}

        <div className="text-center">
          {settings?.logo && (
            <img
              src={`http://localhost:5000${settings.logo}`}
              alt="Logo"
              className="w-20 h-20 mx-auto object-contain"
            />
          )}

          <h2 className="text-3xl font-bold mt-4">
            {settings?.instituteName || "Sayan's Chemistry Squad"}
          </h2>

          {settings?.tagline && (
            <p className="text-gray-400 mt-2">{settings.tagline}</p>
          )}
        </div>

        {/* ================= CENTRES ================= */}

        {settings?.centres?.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8">Our Centres</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {settings.centres.map((centre, index) => (
                <div
                  key={index}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:bg-slate-750 hover:border-blue-500 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Location Icon */}

                    <div className="w-11 h-11 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-xl">
                      📍
                    </div>

                    {/* Centre Details */}

                    <div>
                      <h4 className="text-lg font-bold">
                        {centre.name || `Centre ${index + 1}`}
                      </h4>

                      {centre.location && (
                        <p className="text-gray-400 mt-2 leading-6">
                          {centre.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CONTACT ================= */}

        <div className="mt-12 border-t border-gray-700 pt-10">
          <h3 className="text-2xl font-bold text-center mb-7">Contact Us</h3>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
            {/* Phone */}

            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="text-gray-300 hover:text-white transition"
              >
                📞 {settings.phone}
              </a>
            )}

            {/* Email */}

            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="text-gray-300 hover:text-white transition"
              >
                📧 {settings.email}
              </a>
            )}

            {/* Website */}

            {settings?.website && (
              <a
                href={
                  settings.website.startsWith("http")
                    ? settings.website
                    : `https://${settings.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                🌐 {settings.website}
              </a>
            )}
          </div>
        </div>

        {/* ================= MAIN ADDRESS ================= */}

        {settings?.address && (
          <div className="text-center mt-8">
            <p className="text-gray-400">📍 {settings.address}</p>
          </div>
        )}

        {/* ================= COPYRIGHT ================= */}

        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()}{" "}
            {settings?.instituteName || "Sayan's Chemistry Squad"}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
