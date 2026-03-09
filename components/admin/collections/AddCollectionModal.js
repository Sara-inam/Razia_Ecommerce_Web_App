"use client";
import { useState } from "react";

export default function AddCollectionModal({ onClose, refresh }) {
  const [form, setForm] = useState({
    collection_name: "",
    category: "",
    sub_category: "",
  });

  const handleSubmit = async () => {
    await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-3">Add Collection</h2>

        <input
          placeholder="Collection Name"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, collection_name: e.target.value })
          }
        />

        <input
          placeholder="Category"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          placeholder="Sub Category"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, sub_category: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 mr-2"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="bg-gray-400 px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}