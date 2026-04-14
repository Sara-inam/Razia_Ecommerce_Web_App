"use client";

import { useQuery } from "@tanstack/react-query";
import HomeSection from "@/components/HomeSection";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

/* ================= API ================= */
const fetchSlider = async () => {
  const res = await fetch("/api/slider");
  if (!res.ok) throw new Error("Error fetching slider");
  return res.json();
};

const fetchSections = async () => {
  const res = await fetch("/api/sections");
  if (!res.ok) throw new Error("Error fetching sections");
  return res.json();
};

export default function Home() {
  /* ================= SLIDER ================= */
  const {
    data: sliderData,
    isError: sliderError,
  } = useQuery({
    queryKey: ["slider"],
    queryFn: fetchSlider,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const slides = useMemo(() => sliderData?.slides || [], [sliderData]);

  const [current, setCurrent] = useState(0);

  /* reset index */
  useEffect(() => {
    if (slides.length > 0) setCurrent(0);
  }, [slides.length]);

  /* auto slide */
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((p) => (p + 1) % slides.length);
  };

  /* ================= SECTIONS ================= */
  const {
    data: sectionsData,
    isLoading: sectionLoading,
    isError: sectionError,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="w-full mt-6 md:mt-10 space-y-8 md:space-y-12">

      {/* ================= SLIDER ================= */}
      <div className="w-full flex justify-center px-2 sm:px-4">
        <div className="relative w-full max-w-7xl 
          h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh]
          rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl
          bg-gray-200">

          {/* ✅ fallback background (instant load) */}
          {slides[0]?.img && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 blur-sm"
              style={{ backgroundImage: `url(${slides[0].img})` }}
            />
          )}

          {/* ❌ NO loading UI → no flicker */}

          {/* ❌ error */}
          {sliderError && (
            <div className="flex items-center justify-center h-full text-red-500">
              Failed to load slider
            </div>
          )}

          {/* ✅ slides */}
          {slides.length > 0 &&
            slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={slide.img}
                  alt={slide.title || "slider"}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ))}

          {/* overlay */}
          {slides.length > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          )}

          {/* content */}
          {slides.length > 0 && (
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
              
              <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-3">
                {slides[current]?.title}
              </h1>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-xl md:max-w-2xl mb-5 text-gray-200">
                {slides[current]?.desc}
              </p>

              <Link href="/shop">
                <button className="px-5 py-2 sm:px-6 sm:py-3 bg-green-600 rounded-full hover:bg-green-700 transition">
                  Shop Now
                </button>
              </Link>
            </div>
          )}

          {/* arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 
                bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full items-center justify-center"
              >
                &#8249;
              </button>

              <button
                onClick={nextSlide}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 
                bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full items-center justify-center"
              >
                &#8250;
              </button>
            </>
          )}

          {/* dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`cursor-pointer rounded-full transition-all ${
                    idx === current
                      ? "w-6 h-2 bg-green-500"
                      : "w-2 h-2 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= SECTIONS ================= */}
      {sectionLoading && (
        <p className="text-center text-gray-500">Loading sections...</p>
      )}

      {sectionError && (
        <p className="text-center text-red-500">Error loading sections</p>
      )}

      {sectionsData?.sections?.map((section, index) => (
        <HomeSection key={section._id || index} section={section} />
      ))}
    </div>
  );
}