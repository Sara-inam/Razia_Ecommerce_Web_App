"use client";
import React from "react";
import Link from "next/link";

export default function About() {
  return (
    <div className="bg-gradient-to-br from-green-100 via-white to-green-50 px-4 pt-14 pb-12">

      <div className="max-w-5xl mx-auto bg-white/50 backdrop-blur-lg shadow-xl rounded-2xl p-6 md:p-10 border border-white/40 animate-fadeIn">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            About Our Store
          </h1>
          <p className="text-gray-600 mt-3 text-base md:text-lg">
            Delivering quality products with trust and reliability.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-md animate-slideLeft">
            <img
              src="/images/slider4.jpg"
              alt="About"
              className="w-full h-[280px] object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* Text */}
          <div className="space-y-4 animate-slideRight">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Who We Are
            </h2>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              We are a modern ecommerce brand focused on providing high-quality
              products at competitive prices. Our goal is to create a smooth,
              secure and satisfying shopping experience for every customer.
            </p>

            <ul className="space-y-1 text-gray-700 text-sm md:text-base pt-2">
              <li>✔ Premium quality products</li>
              <li>✔ Secure & easy checkout</li>
              <li>✔ Fast nationwide delivery</li>
              <li>✔ Customer-first approach</li>
            </ul>

            <Link href="/contact">
              <button className="mt-4 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                Get in Touch
              </button>
            </Link>

          </div>
        </div>

      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.6s ease-out forwards;
        }

        @keyframes slideRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideRight {
          animation: slideRight 0.6s ease-out forwards;
        }
      `}</style>

    </div>
  );
}