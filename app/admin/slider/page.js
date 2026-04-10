"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminSlider() {
  const queryClient = useQueryClient();

  const [slides, setSlides] = useState([
    { img: "", title: "", desc: "" },
    { img: "", title: "", desc: "" },
    { img: "", title: "", desc: "" },
  ]);

  /* ================= GET SLIDER ================= */
  const { data, isSuccess } = useQuery({
    queryKey: ["slider"],
    queryFn: async () => {
      const res = await fetch("/api/slider");
      return res.json();
    },
  });

  useEffect(() => {
    if (isSuccess && data?.slides?.length) {
      setSlides(data.slides);
    }
  }, [isSuccess, data]);

  /* ================= SAVE SLIDER ================= */
  const mutation = useMutation({
    mutationFn: async (slides) => {
      const res = await fetch("/api/admin/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider"] });
      alert("Slider Updated 🚀");
    },
  });

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    const updated = [...slides];
    updated[index].img = data.url;
    setSlides(updated);
  };

  const handleChange = (index, key, value) => {
    const updated = [...slides];
    updated[index][key] = value;
    setSlides(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🎯 Slider Management</h1>
        <p className="text-gray-500 mt-1">
          Upload and manage homepage slider content
        </p>
      </div>

      {/* SLIDER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >

            {/* IMAGE UPLOAD AREA */}
            <div className="p-4 border-b bg-gray-50">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Upload Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadImage(e.target.files[0], index)}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:bg-green-600 file:text-white
                hover:file:bg-green-700 cursor-pointer"
              />
            </div>

            {/* IMAGE PREVIEW */}
            {slide.img && (
              <img
                src={slide.img}
                alt="slider"
                className="w-full h-40 object-cover"
              />
            )}

            {/* FORM FIELDS */}
            <div className="p-4 space-y-3">

              <input
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Enter Heading"
                value={slide.title}
                onChange={(e) =>
                  handleChange(index, "title", e.target.value)
                }
              />

              <textarea
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Enter Description"
                value={slide.desc}
                onChange={(e) =>
                  handleChange(index, "desc", e.target.value)
                }
              />

            </div>

          </div>
        ))}
      </div>

      {/* SAVE BUTTON */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => mutation.mutate(slides)}
          className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition"
        >
          Save Slider 🚀
        </button>
      </div>

    </div>
  );
}