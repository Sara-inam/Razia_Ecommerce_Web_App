"use client";
import { useState } from "react";

export default function EditBrandModal({ data, onClose, refresh }) {
  const [brandName, setBrandName] = useState(data.brand_name);
  const [description, setDescription] = useState(data.description);
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("brand_name", brandName);
  formData.append("description", description);
  if (image) formData.append("image", image);

  const res = await fetch(`/api/admin/brands/${data._id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    alert("Update failed");
    return;
  }

  refresh();
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="mb-4 font-bold">Edit Brand</h2>
        <input
          placeholder="Brand Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="w-full mb-2 border px-2 py-1"
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 border px-2 py-1"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-2"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-yellow-400">Update</button>
        </div>
      </div>
    </div>
  );
}