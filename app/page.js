"use client";

import { useQuery } from "@tanstack/react-query";
import HomeSection from "@/components/HomeSection";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

/* 🔥 Fetch sections from API */
const fetchSections = async () => {
  const res = await fetch("/api/sections");
  if (!res.ok) throw new Error("Error fetching sections");
  return res.json();
};

export default function Home() {
  const slides = [
    {
      img: "/images/slider1.jpg",
      title: "Ecommerce Website",
      desc: "Discover Amazing Products at Best Prices",
    },
    {
      img: "/images/slider4.jpg",
      title: "Trendy Collections",
      desc: "Shop the latest fashion and accessories",
    },
    {
      img: "/images/slider3.jpg",
      title: "Quality Guaranteed",
      desc: "Premium products with fast delivery",
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  /* 🔥 React Query */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
    staleTime: 1000 * 60 * 5, // cache for 5 min
  });

  return (
    <div className="w-full mt-10 space-y-10">

      {/* 🔥 SLIDER */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-7xl h-[65vh] rounded-3xl overflow-hidden shadow-2xl">

          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {slides[current].title}
            </h1>
            <p className="text-sm md:text-lg max-w-3xl mb-6 text-gray-200">
              {slides[current].desc}
            </p>
            <button className="px-8 py-3 bg-green-600 rounded-full hover:bg-green-700 transition">
              Shop Now
            </button>
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/25 backdrop-blur-md text-white w-12 h-12 rounded-full"
          >
            &#8249;
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/25 backdrop-blur-md text-white w-12 h-12 rounded-full"
          >
            &#8250;
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all ${idx === current ? "w-8 bg-green-500" : "w-3 bg-white/60"
                  }`}
              ></span>
            ))}
          </div>

        </div>
      </div>

      {/* 🔥 LOADING */}
      {isLoading && (
        <p className="text-center text-gray-500">Loading sections...</p>
      )}

      {/* 🔥 ERROR */}
      {isError && (
        <p className="text-center text-red-500">Error loading sections</p>
      )}

      {/* 🔥 DYNAMIC SECTIONS */}
      {data?.sections?.map((section, index) => (
        <HomeSection key={section._id || index} section={section} />
      ))}

    </div>
  );
}