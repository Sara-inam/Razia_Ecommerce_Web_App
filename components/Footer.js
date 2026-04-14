"use client";

import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-green-200 via-green-300 to-green-200 text-white mt-12">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-14 backdrop-blur-xl bg-green-900/30 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* BRAND */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-extrabold tracking-wide">
            My Store
          </h2>

          <p className="text-sm md:text-base text-green-100 leading-relaxed">
            Premium ecommerce store delivering high-quality products with fast shipping
            and excellent customer service. Your satisfaction is our priority.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-lg font-semibold text-green-100">
            Quick Links
          </h3>

          <ul className="space-y-2 text-green-100 text-sm md:text-base">
            {[
              { name: "About Us", link: "/about" },
              { name: "Contact", link: "/contact" },
              { name: "Privacy Policy", link: "/privacy" },
              { name: "Terms & Conditions", link: "/terms" },
              { name: "FAQ", link: "/faq" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  href={item.link}
                  className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  → {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="space-y-5 text-center md:text-left">

          <h3 className="text-lg font-semibold text-green-100">
            Connect With Us
          </h3>

          <div className="flex justify-center md:justify-start gap-4">

            <a
              href="https://wa.me/923001234567"
              target="_blank"
              className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-green-600 hover:scale-110 transition shadow-lg"
            >
              <FaWhatsapp size={20} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-pink-500 hover:scale-110 transition shadow-lg"
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-blue-600 hover:scale-110 transition shadow-lg"
            >
              <FaLinkedin size={20} />
            </a>

          </div>

          <p className="text-sm text-green-100">
            Follow us for latest updates & offers 
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="text-center text-green-100 text-sm py-5 border-t border-white/20 mt-6">
        © {new Date().getFullYear()} My Store. All rights reserved.
      </div>

    </footer>
  );
}