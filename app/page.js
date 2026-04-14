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
  /* ================= SLIDER QUERY ================= */
  const {
    data: sliderData,
    isLoading: sliderLoading,
    isError: sliderError,
  } = useQuery({
    queryKey: ["slider"],
    queryFn: fetchSlider,
    staleTime: 1000 * 60 * 5,
  });

  const slides = useMemo(() => sliderData?.slides || [], [sliderData]);

  const [current, setCurrent] = useState(0);

  /* reset index safely */
  useEffect(() => {
    if (slides.length > 0) setCurrent(0);
  }, [slides.length]);

  /* auto slider */
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [slides.length]);

  /* navigation */
  const prevSlide = () => {
    if (!slides.length) return;
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    if (!slides.length) return;
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
    <div className="w-full mt-10 space-y-10">

      {/* ================= SLIDER ================= */}
      <div className="w-full flex justify-center px-3">
        <div className="relative w-full max-w-7xl h-[55vh] sm:h-[65vh] md:h-[70vh] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-gray-900 via-black to-gray-900">

          {/* ================= LOADING SKELETON ================= */}
          {sliderLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-gray-900 animate-pulse">
              <div className="w-32 h-4 bg-gray-700 rounded"></div>
              <div className="w-48 h-3 bg-gray-700 rounded"></div>
            </div>
          )}

          {/* ================= ERROR ================= */}
          {sliderError && (
            <div className="flex items-center justify-center h-full text-red-400">
              Failed to load slider
            </div>
          )}

          {/* ================= EMPTY ================= */}
          {!sliderLoading && slides.length === 0 && (
            <div className="flex items-center justify-center h-full text-white">
              No Slider Images Found
            </div>
          )}

          {/* ================= SLIDES ================= */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.img}
                alt={slide.title || "slider"}
                fill
                priority={index === 0}   // ⚡ FIRST IMAGE FAST LOAD
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}

          {/* ================= OVERLAY ================= */}
          {slides.length > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          )}

          {/* ================= CONTENT ================= */}
          {slides.length > 0 && (
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-3">
                {slides[current]?.title}
              </h1>

              <p className="text-xs sm:text-sm md:text-lg max-w-2xl mb-6 text-gray-200">
                {slides[current]?.desc}
              </p>

              <Link href="/shop">
                <button className="px-6 py-3 bg-green-600 rounded-full hover:bg-green-700 transition">
                  Shop Now
                </button>
              </Link>
            </div>
          )}

          {/* ================= ARROWS ================= */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-11 h-11 rounded-full transition"
              >
                &#8249;
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-11 h-11 rounded-full transition"
              >
                &#8250;
              </button>
            </>
          )}

          {/* ================= DOTS ================= */}
          {slides.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`cursor-pointer rounded-full transition-all ${
                    idx === current
                      ? "w-7 h-2 bg-green-500"
                      : "w-2 h-2 bg-white/50"
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