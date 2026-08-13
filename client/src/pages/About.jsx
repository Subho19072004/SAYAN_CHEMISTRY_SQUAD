import { useEffect, useState } from "react";
import { getSettings } from "../services/settingsService";
import sayanSir from "../assets/images/sayan-sir.jpeg";

function About() {
  const [settings, setSettings] = useState(null);

  // =====================================================
  // FETCH SETTINGS
  // =====================================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();

        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // =====================================================
  // SETTINGS
  // =====================================================

  const instituteName = settings?.instituteName || "Sayan's Chemistry Squad";

  const businessCategory =
    settings?.businessCategory || "Educational Institution";

  const tagline =
    settings?.tagline ||
    "Building strong chemistry concepts through clear explanations, regular practice and personal guidance.";

  const aboutDescription =
    settings?.aboutDescription ||
    `Sayan Sir is the CEO & Founder of Sayan's Chemistry Squad. Here, AC classrooms are available with digital smart boards. Audio-visual classes are also available. Sayan Sir teaches Chemistry for West Bengal Board, CBSE Board and ICSE/ISC Board students from Classes VIII to XII, and Physical Science for Classes VII to X for WB Board students.

Both Bengali and English medium students of the WB Board can study here. Separate batches are available for separate boards. Monthly mock tests, daily oral tests and weekly assessment tests are available. Practical classes can be explained visually using digital smart boards.

Sayan Sir's main motto is "Education First" — money is not the most important thing when it comes to providing proper education to students from financially weaker backgrounds.`;

  const centres = settings?.centres || [];

  return (
    <section className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-linear-to-br from-blue-950 via-blue-900 to-cyan-800">
        {/* Background Decorations */}

        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="text-white">
              {/* Small Label */}

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />

                <span className="text-sm font-semibold tracking-wide">
                  {businessCategory}
                </span>
              </div>

              {/* Heading */}

              <p className="mt-8 text-cyan-300 font-semibold uppercase tracking-[0.2em] text-sm">
                Meet Your Chemistry Mentor
              </p>

              <h1 className="mt-3 text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight">
                Sayan Surjo Dey
              </h1>

              <div className="mt-4 h-1 w-20 bg-cyan-300 rounded-full" />

              <h2 className="mt-5 text-xl md:text-2xl font-medium text-blue-100">
                Founder & CEO
              </h2>

              <p className="mt-2 text-lg text-cyan-200">{instituteName}</p>

              {/* Description */}

              <p className="mt-7 max-w-xl text-blue-100 leading-8 text-base md:text-lg">
                {tagline}
              </p>

              {/* Education First */}

              <div className="mt-8 pl-5 border-l-4 border-cyan-300">
                <p className="text-2xl font-bold text-white">
                  "Education First"
                </p>

                <p className="mt-2 text-sm md:text-base text-blue-200 leading-6">
                  Quality education, strong concepts and personal guidance for
                  every student.
                </p>
              </div>

              {/* Quick Stats */}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
                <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md p-5">
                  <p className="text-2xl font-bold text-white">XI–XII</p>

                  <p className="text-sm text-blue-200 mt-1">Chemistry</p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md p-5">
                  <p className="text-2xl font-bold text-white">3+</p>

                  <p className="text-sm text-blue-200 mt-1">Boards</p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md p-5 col-span-2 sm:col-span-1">
                  <p className="text-2xl font-bold text-white">100%</p>

                  <p className="text-sm text-blue-200 mt-1">Concept Focus</p>
                </div>
              </div>
            </div>

            {/* =================================================
                SIR PHOTO
            ================================================= */}

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Soft Glow */}

                <div className="absolute -inset-5 rounded-[3rem] bg-cyan-400/20 blur-2xl" />

                {/* Outer Frame */}

                <div className="relative rounded-[3rem] p-2 bg-linear-to-br from-cyan-300 via-white/30 to-blue-500 shadow-2xl">
                  {/* Image Container */}

                  <div className="overflow-hidden rounded-[2.5rem] bg-white">
                    <img
                      src={sayanSir}
                      alt="Sayan Sir - Founder and CEO of Sayan's Chemistry Squad"
                      className="w-full h-130 md:h-162.5 object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* =====================================================
            ABOUT US
        ===================================================== */}

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm">
            About Us
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">
            {instituteName}
          </h2>

          <div className="mt-5 mx-auto w-20 h-1 rounded-full bg-linear-to-r from-blue-600 to-cyan-400" />
        </div>

        {/* Story Card */}

        <div className="mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-[280px_1fr]">
            {/* Colored Side */}

            <div className="relative bg-linear-to-br from-blue-700 to-cyan-500 p-8 md:p-10">
              <div className="flex lg:flex-col items-center justify-center h-full text-white text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-4xl">
                  🎓
                </div>

                <div className="ml-5 lg:ml-0 lg:mt-6">
                  <h3 className="text-2xl font-bold">Our Vision</h3>

                  <p className="mt-2 text-blue-50 leading-6 text-sm">
                    Learn with clarity.
                    <br />
                    Grow with confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}

            <div className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Our Story
              </h3>

              <div className="mt-6 text-gray-600 leading-8 whitespace-pre-line">
                {aboutDescription}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            WHY CHOOSE US
        ===================================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                ⭐
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Our Approach
                </p>

                <h2 className="text-2xl font-bold text-gray-900">
                  Why Choose Us?
                </h2>
              </div>
            </div>

            <div className="space-y-7">
              {/* Feature 1 */}

              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                  🎓
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Experienced Guidance
                  </h3>

                  <p className="text-gray-600 mt-1 leading-6">
                    Clear and structured teaching focused on strong concepts.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}

              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-cyan-50 flex items-center justify-center text-xl">
                  🧪
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Concept-Based Learning
                  </h3>

                  <p className="text-gray-600 mt-1 leading-6">
                    Understand chemistry instead of simply memorizing formulas.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}

              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
                  📝
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Regular Assessments
                  </h3>

                  <p className="text-gray-600 mt-1 leading-6">
                    Monthly mock tests, daily oral tests and weekly assessment
                    tests.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}

              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                  💬
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Doubt Clearing
                  </h3>

                  <p className="text-gray-600 mt-1 leading-6">
                    Dedicated academic support to help students understand
                    difficult topics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FACILITIES
          ================================================= */}

          <div className="rounded-3xl bg-linear-to-br from-blue-950 to-blue-800 p-8 md:p-10 text-white shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                🏫
              </div>

              <div>
                <p className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
                  Learning Environment
                </p>

                <h2 className="text-2xl font-bold">Our Facilities</h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
                <div className="text-3xl">❄️</div>

                <h3 className="mt-3 font-bold">Air-Conditioned Classrooms</h3>

                <p className="mt-2 text-sm text-blue-200 leading-6">
                  Comfortable classroom environment for focused learning.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
                <div className="text-3xl">🖥️</div>

                <h3 className="mt-3 font-bold">Digital Smart Board</h3>

                <p className="mt-2 text-sm text-blue-200 leading-6">
                  Visual and interactive learning through digital smart board
                  classes.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
                <div className="text-3xl">🎥</div>

                <h3 className="mt-3 font-bold">Audio-Visual Classes</h3>

                <p className="mt-2 text-sm text-blue-200 leading-6">
                  Audio-visual explanations to make difficult chemistry concepts
                  easier.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
                <div className="text-3xl">🧪</div>

                <h3 className="mt-3 font-bold">Practical Learning</h3>

                <p className="mt-2 text-sm text-blue-200 leading-6">
                  Practical concepts explained visually using digital learning
                  tools.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
    ACADEMIC COVERAGE
===================================================== */}

        <div className="mt-20">
          <div className="text-center">
            <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm">
              Academic Coverage
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
              Boards & Classes
            </h2>

            <p className="mt-3 text-gray-500">
              Quality academic guidance for students across different boards.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {/* BOARD */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                  🏫
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-600 uppercase">
                    Board
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900">
                    Boards We Support
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {["WB", "CBSE", "ICSE", "ISC"].map((board) => (
                  <span
                    key={board}
                    className="px-5 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100"
                  >
                    {board}
                  </span>
                ))}
              </div>
            </div>

            {/* CLASSES */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center text-2xl">
                  🎓
                </div>

                <div>
                  <p className="text-sm font-semibold text-cyan-600 uppercase">
                    Classes
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900">
                    Classes Available
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {["VIII", "IX", "X", "XI", "XII"].map((className) => (
                  <span
                    key={className}
                    className="px-5 py-3 rounded-xl bg-cyan-50 text-cyan-700 font-bold border border-cyan-100"
                  >
                    Class {className}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* WB SPECIAL NOTE */}

          <div className="mt-8 rounded-3xl bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-100 p-7 md:p-8">
            <div className="flex flex-col md:flex-row gap-5 items-start">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl">
                🧪
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  West Bengal Board – Physical Science
                </h3>

                <p className="mt-2 text-gray-600 leading-7">
                  For <strong>WB Board Classes VIII, IX & X</strong>, Physical
                  Science classes are available with clear concept-based
                  teaching and regular academic support.
                </p>
              </div>
            </div>
          </div>

          {/* MEDIUM */}

          <div className="mt-6 rounded-3xl bg-white border border-gray-100 shadow-lg p-7 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">
                  🌐
                </div>

                <div>
                  <p className="text-sm font-semibold text-purple-600 uppercase">
                    Medium
                  </p>

                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Bengali & English Version Available
                  </h3>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                <span className="px-5 py-3 rounded-xl bg-orange-50 text-orange-700 font-bold border border-orange-100">
                  বাংলা Medium
                </span>

                <span className="px-5 py-3 rounded-xl bg-green-50 text-green-700 font-bold border border-green-100">
                  English Medium
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CENTRES
        ===================================================== */}

        {centres.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm">
                Our Locations
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                Our Centres
              </h2>

              <p className="mt-3 text-gray-500">
                Find our coaching centres near you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {centres.map((centre, index) => (
                <div
                  key={centre._id || index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                      📍
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {centre.name}
                      </h3>

                      <p className="mt-2 text-gray-600 leading-6">
                        {centre.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            CONTACT
        ===================================================== */}

        {(settings?.phone ||
          settings?.whatsappNumber ||
          settings?.email ||
          settings?.website ||
          settings?.address) && (
          <div className="mt-20 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center mb-10">
              <p className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm">
                Contact Us
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                Get In Touch
              </h2>

              <p className="mt-3 text-gray-500">
                Contact us for admission and academic enquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Address */}

              {settings?.address && (
                <div className="rounded-2xl bg-slate-50 border border-gray-100 p-6 hover:bg-blue-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                      📍
                    </div>

                    <h3 className="font-bold text-gray-900">Address</h3>
                  </div>

                  <p className="mt-4 text-gray-600 whitespace-pre-line">
                    {settings.address}
                  </p>
                </div>
              )}

              {/* Phone */}

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="rounded-2xl bg-slate-50 border border-gray-100 p-6 hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                      📞
                    </div>

                    <h3 className="font-bold text-gray-900">Phone</h3>
                  </div>

                  <p className="mt-4 text-gray-600">{settings.phone}</p>
                </a>
              )}

              {/* WhatsApp */}

              {settings?.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-slate-50 border border-gray-100 p-6 hover:bg-green-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                      💬
                    </div>

                    <h3 className="font-bold text-gray-900">WhatsApp</h3>
                  </div>

                  <p className="mt-4 text-gray-600">
                    {settings.whatsappNumber}
                  </p>
                </a>
              )}

              {/* Email */}

              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="rounded-2xl bg-slate-50 border border-gray-100 p-6 hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                      📧
                    </div>

                    <h3 className="font-bold text-gray-900">Email</h3>
                  </div>

                  <p className="mt-4 text-gray-600 break-all">
                    {settings.email}
                  </p>
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
                  className="rounded-2xl bg-slate-50 border border-gray-100 p-6 hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                      🌐
                    </div>

                    <h3 className="font-bold text-gray-900">Website</h3>
                  </div>

                  <p className="mt-4 text-gray-600 break-all">
                    {settings.website}
                  </p>
                </a>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            EDUCATION FIRST
        ===================================================== */}

        <div className="mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-800 via-blue-700 to-cyan-600 p-10 md:p-14 text-center text-white shadow-2xl">
            <div className="relative">
              <div className="text-5xl">🎓</div>

              <h2 className="mt-5 text-3xl md:text-4xl font-extrabold">
                Education First
              </h2>

              <p className="mt-5 max-w-3xl mx-auto text-blue-50 leading-8">
                Our main motto is to provide proper education and academic
                guidance to every student. Education comes first, and financial
                limitations should not prevent deserving students from receiving
                quality education.
              </p>

              <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20">
                <span>❤️</span>

                <span className="font-semibold">
                  Learn with Purpose. Grow with Confidence.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
