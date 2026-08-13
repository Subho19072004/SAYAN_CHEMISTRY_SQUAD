import React from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  return (
    <section className="py-20 bg-gray-50" id="contact">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-lg">Get In Touch</p>

          <h2 className="text-4xl font-bold text-gray-800 mt-2">Contact Us</h2>

          <p className="text-gray-600 mt-4">
            Have questions about admission or our chemistry classes? Contact us
            today.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">
              <FaPhone />
            </div>

            <h3 className="text-xl font-semibold mt-4">Call Us</h3>

            <a
              href="tel:7003349913"
              className="text-gray-600 mt-2 block hover:text-blue-600"
            >
              7003349913
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">
              <FaWhatsapp />
            </div>

            <h3 className="text-xl font-semibold mt-4">WhatsApp</h3>

            <a
              href="https://wa.me/917003349913"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 mt-2 block hover:text-green-600"
            >
              Chat With Us
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">
              <FaEnvelope />
            </div>

            <h3 className="text-xl font-semibold mt-4">Email Us</h3>

            <a
              href="mailto:your-email@example.com"
              className="text-gray-600 mt-2 block hover:text-red-600"
            >
              your-email@example.com
            </a>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl">
              <FaMapMarkerAlt />
            </div>

            <h3 className="text-xl font-semibold mt-4">Visit Us</h3>

            <p className="text-gray-600 mt-2">Kadamtala, West Bengal</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="/admission"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Apply for Admission
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
