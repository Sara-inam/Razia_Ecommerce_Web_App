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

  // TOAST
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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

      if (!res.ok) throw new Error("Failed");

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider"] });
      showToast("Slider Updated Successfully 🚀", "success");
    },

    onError: () => {
      showToast("Something went wrong!", "error");
    },
  });

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file, index) => {
    try {
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

      showToast("Image uploaded ✅");
    } catch (err) {
      showToast("Image upload failed!", "error");
    }
  };

  const handleChange = (index, key, value) => {
    const updated = [...slides];
    updated[index][key] = value;
    setSlides(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white shadow-lg ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          🎯 Slider Management
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Upload and manage homepage slider content
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition"
          >

            {/* UPLOAD */}
            <div className="p-4 border-b bg-gray-50">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Upload Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  uploadImage(e.target.files[0], index)
                }
                className="w-full text-sm file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:bg-green-600 file:text-white
                hover:file:bg-green-700 cursor-pointer"
              />
            </div>

            {/* IMAGE */}
            {slide.img && (
              <img
                src={slide.img}
                alt="slider"
                className="w-full h-40 object-cover"
              />
            )}

            {/* FORM */}
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
          disabled={mutation.isPending}
          className={`px-8 md:px-10 py-3 rounded-full font-semibold shadow-lg transition transform ${
            mutation.isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-emerald-500 hover:scale-105 text-white"
          }`}
        >
          {mutation.isPending ? "Saving..." : "Save Slider 🚀"}
        </button>
      </div>
    </div>
  );
}