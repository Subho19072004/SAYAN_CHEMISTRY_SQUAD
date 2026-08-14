import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSettings } from "../services/settingsService";
import { SERVER_BASE_URL } from "../utils/constants";

const Hero = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();

        if (res.data?.success) {
          setSettings(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const primaryColor = settings?.themeColor || "#1e3a8a";
  const secondaryColor = settings?.secondaryColor || "#0891b2";

  // Build profile image URL
  const profileImage = settings?.profileImage
    ? settings.profileImage.startsWith("http")
      ? settings.profileImage
      : `${SERVER_BASE_URL}${settings.profileImage}`
    : null;

  return (
    <section
      className="text-white"
      style={{
        background: `linear-gradient(
          135deg,
          ${primaryColor},
          ${secondaryColor}
        )`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div>
            {/* Admission Status */}
            <div className="inline-block bg-white text-blue-700 px-5 py-2 rounded-full font-medium">
              Admissions {settings?.admissionStatus || "Open"}
              {settings?.academicSession && (
                <>
                  {" • "}
                  {settings.academicSession}
                </>
              )}
            </div>

            {/* Institute Name */}
            <h1 className="text-5xl font-extrabold mt-6 leading-tight">
              {settings?.instituteName || "Sayan's Chemistry Squad"}
            </h1>

            {/* Tagline */}
            {settings?.tagline && (
              <p className="mt-6 text-xl text-blue-100">{settings.tagline}</p>
            )}

            {/* Course Information */}
            <p className="text-lg mt-3">
              Chemistry Coaching for Class XI & XII
            </p>

            <p className="text-lg mt-2">WBCHSE • CBSE • ISC</p>

            {/* Description */}
            <p className="mt-6 text-blue-100 leading-8 max-w-2xl">
              Learn Chemistry through Digital Smart Board Classes, Monthly Mock
              Tests, Doubt Clearing Sessions, Practical Chemistry Discussions,
              and Project Assistance.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/admission"
                className="bg-white text-blue-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-100 transition"
              >
                Admission Form
              </Link>

              {settings?.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20Sir,%20I%20want%20to%20know%20about%20your%20Chemistry%20classes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-700 transition"
                >
                  WhatsApp Now
                </a>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt={settings?.adminName || "Administrator"}
                className="rounded-3xl shadow-2xl w-full max-w-md object-cover"
                onError={(event) => {
                  console.error("Failed to load profile image:", profileImage);
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full max-w-md h-105 rounded-3xl shadow-2xl bg-white/20 flex items-center justify-center">
                <p className="text-lg text-white/80">
                  Profile image not available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
