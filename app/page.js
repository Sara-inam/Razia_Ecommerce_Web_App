"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const slides = [
    { img: "/images/slider1.jpg", title: "Ecommerce Website", desc: "Discover Amazing Products at Best Prices" },
    { img: "/images/slider4.jpg", title: "Trendy Collections", desc: "Shop the latest fashion and accessories" },
    { img: "/images/slider3.jpg", title: "Quality Guaranteed", desc: "Premium products with fast delivery" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative h-[65vh] w-full flex justify-center mt-8">

      {/* Slider Container */}
      <div className="relative w-full max-w-7xl rounded-3xl overflow-hidden shadow-2xl">

        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out rounded-3xl ${
              index === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-[6000ms] ease-linear"
              style={{ backgroundImage: `url(${slide.img})` }}
            ></div>
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/20 rounded-3xl"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-6 md:px-10">
          <h1 key={slides[current].title} className="text-3xl md:text-5xl font-bold mb-4 animate-slideUp">
            {slides[current].title}
          </h1>
          <p key={slides[current].desc} className="text-sm md:text-lg max-w-3xl mb-6 text-gray-200 animate-slideUp delay-150">
            {slides[current].desc}
          </p>
          <button className="px-8 py-3 bg-green-600 rounded-full text-white font-semibold hover:bg-green-700 hover:scale-105 transition duration-300 shadow-lg">
            Shop Now
          </button>
        </div>

        {/* Arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/25 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-green-600 transition duration-300 z-30 shadow-lg">
          &#8249;
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/25 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-green-600 transition duration-300 z-30 shadow-lg">
          &#8250;
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                idx === current ? "w-8 bg-green-500" : "w-3 bg-white/60 hover:bg-white"
              }`}
            ></span>
          ))}
        </div>

      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.7s ease forwards; }
        .delay-150 { animation-delay: 0.15s; }
      `}</style>

    </div>
  );
}