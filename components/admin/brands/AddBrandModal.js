"use client";
import { useState, useEffect } from "react";

export default function AddBrandModal({ onClose, refresh }) {
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [collections, setCollections] = useState([]); // Collections list
  const [collectionId, setCollectionId] = useState(""); // Selected collection

  // Fetch collections for dropdown
  useEffect(() => {
    fetch("/api/admin/collections")
      .then(res => res.json())
      .then(data => setCollections(data));
  }, []);

  const handleSubmit = async () => {
    if (!collectionId) return alert("Please select a collection");

    const formData = new FormData();
    formData.append("brand_name", brandName);
    formData.append("description", description);
    formData.append("collection", collectionId); // Send collection ObjectId
    if (image) formData.append("image", image);

    await fetch("/api/admin/brands", {
      method: "POST",
      body: formData,
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="mb-4 font-bold">Add Brand</h2>

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

        {/* Collection Dropdown */}
        <select
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className="w-full mb-2 border px-2 py-1"
        >
          <option value="">Select Collection</option>
          {collections.map((c) => (
            <option key={c._id} value={c._id}>
              {c.collection_name} - {c.category} - {c.sub_category}
              
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-2"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white">Save</button>
        </div>
      </div>
    </div>
  );
}