"use client";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-green-200 via-green-300 to-green-200 text-white mt-12">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 backdrop-blur-xl bg-green-900/30 rounded-3xl shadow-xl grid md:grid-cols-3 gap-8 animate-fadeIn">

        {/* Brand & Description */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wider">My Store</h2>
          <p className="text-sm md:text-base text-green-100">
            Premium ecommerce store delivering high-quality products with fast shipping and excellent customer service. Your satisfaction is our priority!
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 text-green-100">
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/about" className="hover:text-white transition">About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Social + Newsletter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-green-100">Connect with Us</h3>
          <div className="flex gap-4">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/30 p-3 rounded-full hover:bg-green-600 hover:scale-110 transition transform shadow-md"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/30 p-3 rounded-full hover:bg-pink-500 hover:scale-110 transition transform shadow-md"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/30 p-3 rounded-full hover:bg-blue-600 hover:scale-110 transition transform shadow-md"
            >
              <FaLinkedin />
            </a>
          </div>

          {/* Newsletter */}
          <div className="mt-4">
            <h4 className="text-green-100 font-medium mb-2">Subscribe to our newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <button className="px-4 py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="text-center text-green-100 text-sm py-4 animate-fadeIn delay-150">
        Made with ❤️ for our customers. Powered by My Store Team.
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </footer>
  );
}