"use client";
import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function EditBrandModal({ data, onClose, refresh }) {
  const [brandName, setBrandName] = useState(data.brand_name || "");
  const [description, setDescription] = useState(data.description || "");
  const [image, setImage] = useState(null); // new image
  const [collectionId, setCollectionId] = useState(data.collection?._id || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch collections
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/admin/collections");
      const json = await res.json();
      return json.data || [];
    },
  });

  // Mutation for updating brand
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`/api/admin/brands/${data._id}`, {
        method: "PUT",
        body: formData,
      });

      const resultText = await res.text();
      let result;
      try {
        result = resultText ? JSON.parse(resultText) : null;
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) throw new Error(result?.message || "Failed to update brand");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setMessage({ text: "Brand updated successfully!", type: "success" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
        refresh();
        onClose();
      }, 1500);
    },
    onError: (err) => {
      setMessage({ text: err.message || "Something went wrong.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    },
  });

  const handleSubmit = () => {
    if (!brandName.trim()) {
      setMessage({ text: "Brand name cannot be empty.", type: "error" });
      return setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
    if (!collectionId) {
      setMessage({ text: "Please select a collection.", type: "error" });
      return setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }

    const formData = new FormData();
    formData.append("brand_name", brandName.trim());
    formData.append("description", description.trim());
    formData.append("collection", collectionId);
    if (image) formData.append("image", image);

    mutation.mutate(formData);
  };

  const selectedCollection = collections.find((c) => c._id === collectionId);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white w-[480px] rounded-xl shadow-xl p-6 relative animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Brand
        </h2>

        <form className="flex flex-col gap-4 relative" onSubmit={(e) => e.preventDefault()}>
          {/* Messages */}
          {message.text && (
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-[90%] text-center px-4 py-2 rounded-lg font-medium shadow-md animate-fadeIn transition-all ${
                message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Brand Name */}
          <input
            type="text"
            placeholder="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none transition resize-none"
            rows={3}
          />

          {/* Collection Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left flex justify-between items-center focus:ring-2 focus:ring-green-500"
            >
              {selectedCollection
                ? `${selectedCollection.collection_name} - ${selectedCollection.category} - ${selectedCollection.sub_category}`
                : "Select Collection"}
              <span className="ml-2">▾</span>
            </button>
            {dropdownOpen && (
              <ul
                ref={dropdownRef}
                className="absolute z-50 w-full max-h-48 overflow-y-auto mt-1 bg-white border border-gray-300 rounded shadow-lg"
              >
                {isLoading ? (
                  <li className="px-4 py-2 text-gray-400">Loading...</li>
                ) : (
                  collections.map((c) => (
                    <li
                      key={c._id}
                      onClick={() => {
                        setCollectionId(c._id);
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-green-100 transition"
                    >
                      {c.collection_name} - {c.category} - {c.sub_category}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200 transition text-center">
              {image ? "Change Image" : "Choose Image"}
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
                accept="image/*"
              />
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border border-gray-300"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isLoading}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {mutation.isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}