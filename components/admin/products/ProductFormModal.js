"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ImageUpload from "./ImageUpload";

export default function ProductFormModal({ setShowModal, fetchProducts, editData, brands = [] }) {
  const [form, setForm] = useState(() => ({
    name: editData?.name || "",
    slug: editData?.slug || "",
    description: editData?.description || "",
    price: editData?.price || 0,
    discountPercentage: editData?.discountPercentage || 0,
    brand: editData?.brand?._id || "",
    colors: editData?.colors || [],
    tags: editData?.tags || [],
    isActive: editData?.isActive ?? true,
  }));

  const [tagInput, setTagInput] = useState("");
  const [toast, setToast] = useState(null);

  const productMutation = useMutation({
    mutationFn: async (payload) => {
      const method = editData ? "PUT" : "POST";
      const url = editData ? `/api/admin/products/${editData._id}` : "/api/admin/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      fetchProducts();
      showToast(editData ? "Product updated!" : "Product added!", "success");
      setTimeout(() => setShowModal(false), 1200);
    },
    onError: (err) => showToast(err.message, "error"),
  });

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const colors = form.colors.map(c => ({
      name: c.name,
      hex: c.hex,
      images: c.images || [],
      stock: (c.stock || []).map(s => ({ size: s.size, quantity: Number(s.quantity) })),
    }));

    const payload = {
      ...form,
      price: Number(form.price),
      discountPercentage: Number(form.discountPercentage),
      colors,
    };

    productMutation.mutate(payload);
  };

  // Tag handlers
  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };
  const handleRemoveTag = (tag) => setForm({ ...form, tags: form.tags.filter(t => t !== tag) });

  // Color handlers
  const handleAddColor = () => setForm(prev => ({
    ...prev,
    colors: [...prev.colors, { name: "", hex: "#ffffff", images: [], stock: [] }]
  }));
  const handleRemoveColor = (i) => {
    const colors = [...form.colors];
    colors.splice(i, 1);
    setForm({ ...form, colors });
  };

  const handleColorNameChange = (i, value) => {
    const colors = [...form.colors];
    colors[i].name = value;
    setForm({ ...form, colors });
  };
  const handleColorHexChange = (i, value) => {
    const colors = [...form.colors];
    colors[i].hex = value;
    setForm({ ...form, colors });
  };

  const handleAddStock = (i) => {
    const colors = [...form.colors];
    colors[i].stock.push({ size: "", quantity: 0 });
    setForm({ ...form, colors });
  };
  const handleRemoveStock = (i, k) => {
    const colors = [...form.colors];
    colors[i].stock.splice(k, 1);
    setForm({ ...form, colors });
  };
  const handleStockChange = (i, k, field, value) => {
    const colors = [...form.colors];
    colors[i].stock[k][field] = field === "quantity" ? Number(value) : value;
    setForm({ ...form, colors });
  };

  const handleUploadColorImage = (i, url) => {
    const colors = form.colors.map((c, idx) => idx === i ? { ...c, images: [...(c.images || []), url] } : c);
    setForm({ ...form, colors });
  };
  const handleRemoveColorImage = (i, idx) => {
    const colors = form.colors.map((c, colorIdx) => colorIdx === i ? { ...c, images: c.images.filter((_, j) => j !== idx) } : c);
    setForm({ ...form, colors });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      {toast && (
        <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg font-semibold text-white animate-slide-in ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto space-y-6 shadow-2xl">
        <h2 className="text-3xl font-bold text-green-700">{editData ? "Edit Product" : "Add Product"}</h2>

        {/* Basic fields */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Product Name</span>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 w-full" required />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Slug</span>
            <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 w-full" required />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Price</span>
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 w-full" required />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Discount %</span>
            <input type="number" value={form.discountPercentage} onChange={e => setForm({ ...form, discountPercentage: Number(e.target.value) })} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 w-full" />
          </label>
          <label className="flex flex-col col-span-2">
            <span className="font-semibold text-gray-700">Description</span>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 w-full" />
          </label>
        </div>
        <div>
          <label className="font-semibold text-gray-700">Tags</label>

          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="border p-2 rounded-lg"
              placeholder="Add tag"
            />

            <button
              type="button"
              onClick={handleAddTag}
              className="bg-green-500 text-white px-3 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 mt-2 flex-wrap">
            {form.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>x</button>
              </span>
            ))}
          </div>
        </div>

        {/* Brand */}
        <label className="flex flex-col">
          <span className="font-semibold text-gray-700">Brand</span>
          <select
            value={form.brand}
            onChange={e => setForm({ ...form, brand: e.target.value })}
            className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 w-full"
            required
          >
            <option value="">Select Brand</option>
            {(brands?.data || []).map(b => (
              <option key={b._id} value={b._id}>
                {b.brand_name} - {b.collection?.collection_name || ""} / {b.collection?.category || ""} / {b.collection?.sub_category || ""}
              </option>
            ))}
          </select>
        </label>

        {/* Colors Section */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Colors</h3>
          {form.colors.map((color, i) => (
            <div key={i} className="border p-4 rounded-lg mb-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Color {i + 1}</span>
                <button type="button" className="text-red-500" onClick={() => handleRemoveColor(i)}>Remove</button>
              </div>
              <div className="flex gap-4">
                <input type="text" value={color.name} placeholder="Color Name" onChange={e => handleColorNameChange(i, e.target.value)} className="border p-2 rounded-lg" />
                <input type="color" value={color.hex} onChange={e => handleColorHexChange(i, e.target.value)} className="w-12 h-12 rounded-lg p-0 border" />
              </div>

              {/* Images */}
              <div className="flex gap-2 flex-wrap">
                {color.images?.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} className="w-20 h-20 object-cover rounded-lg" />
                    <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1" onClick={() => handleRemoveColorImage(i, idx)}>x</button>
                  </div>
                ))}
                <ImageUpload onChange={url => handleUploadColorImage(i, url)} />
              </div>

              {/* Stock */}
              <div className="space-y-1">
                {color.stock.map((s, k) => (
                  <div key={k} className="flex gap-2 items-center">
                    <input type="text" value={s.size} placeholder="Size" onChange={e => handleStockChange(i, k, "size", e.target.value)} className="border p-1 rounded-lg" />
                    <input type="number" value={s.quantity} placeholder="Qty" onChange={e => handleStockChange(i, k, "quantity", e.target.value)} className="border p-1 rounded-lg w-20" />
                    <button type="button" className="text-red-500" onClick={() => handleRemoveStock(i, k)}>Remove</button>
                  </div>
                ))}
                <button type="button" className="bg-green-500 text-white px-3 py-1 rounded-lg mt-1" onClick={() => handleAddStock(i)}>Add Stock</button>
              </div>
            </div>
          ))}
          <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleAddColor}>Add Color</button>
        </div>

        {/* Featured & Active */}
        <div className="flex gap-4 items-center mt-3">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="px-6 py-2 bg-gray-200 rounded-lg" onClick={() => setShowModal(false)}>Cancel</button>
          <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">{editData ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
}