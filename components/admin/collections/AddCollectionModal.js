"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddCollectionModal({ onClose }) {
  const [form, setForm] = useState({
    collection_name: "",
    category: "",
    sub_category: "",
  });

  const queryClient = useQueryClient();
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' | 'error'

  const mutation = useMutation({
    mutationFn: async (newCollection) => {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCollection),
      });
      if (!res.ok) throw new Error("Failed to save collection");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setMessage({ text: "Collection added successfully!", type: "success" });

      // Automatically close modal after short delay
      setTimeout(() => {
        setMessage({ text: "", type: "" });
        onClose();
      }, 1500);
    },
    onError: (err) => {
      console.error(err);
      setMessage({ text: "Something went wrong. Please try again.", type: "error" });
      // Remove error message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    },
  });

  const handleSubmit = () => {
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 relative animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
          Add Collection
        </h2>

        <form className="flex flex-col gap-4 relative">
          {/* ✅ Professional Messages */}
          {message.text && (
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-[90%] text-center px-4 py-2 rounded-lg font-medium shadow-md animate-fadeIn transition-all ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <input
            type="text"
            placeholder="Collection Name"
            value={form.collection_name}
            onChange={(e) =>
              setForm({ ...form, collection_name: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="text"
            placeholder="Sub Category"
            value={form.sub_category}
            onChange={(e) =>
              setForm({ ...form, sub_category: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isLoading}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {mutation.isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}