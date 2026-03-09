"use client";
import { useState } from "react";

export default function EditCollectionModal({ data, onClose, refresh }) {
  const [form, setForm] = useState(data);

  const handleUpdate = async () => {
    await fetch(`/api/admin/collections/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-3">Edit Collection</h2>

        <input
          value={form.collection_name}
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, collection_name: e.target.value })
          }
        />

        <input
          value={form.category}
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          value={form.sub_category}
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, sub_category: e.target.value })
          }
        />

        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 mr-2"
        >
          Update
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