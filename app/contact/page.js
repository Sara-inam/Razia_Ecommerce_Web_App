"use client";
import React from "react";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="bg-gradient-to-br from-green-100 via-white to-green-50 px-4 pt-24 pb-16">

      <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-8 backdrop-blur-xl bg-white/40 shadow-2xl rounded-3xl p-8 md:p-12 border border-white/30 animate-fadeIn">

        {/* Left Side */}
        <div className="space-y-6 animate-slideLeft">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Contact Us
          </h1>

          <p className="text-gray-700">
            Have any questions? We’re here to help. Reach out anytime.
          </p>

          <div className="space-y-2 text-gray-800 text-sm">
            <p><span className="font-semibold">Email:</span> support@ecommerce.com</p>
            <p><span className="font-semibold">Phone:</span> +92 300 1234567</p>
            <p><span className="font-semibold">Address:</span> Lahore, Pakistan</p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 pt-4 border-t border-white/40">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/60 p-3 rounded-full text-green-600 hover:scale-110 transition duration-300 shadow-md"
            >
              <FaWhatsapp />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/60 p-3 rounded-full text-pink-500 hover:scale-110 transition duration-300 shadow-md"
            >
              <FaInstagram />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/60 p-3 rounded-full text-blue-600 hover:scale-110 transition duration-300 shadow-md"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="animate-slideRight">
          <form className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full bg-white/70 border border-white/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              Send Message
            </button>

          </form>
        </div>

      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.8s ease-out forwards;
        }

        @keyframes slideRight {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideRight {
          animation: slideRight 0.8s ease-out forwards;
        }
      `}</style>

    </div>
  );
}