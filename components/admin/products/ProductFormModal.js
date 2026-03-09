"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";

export default function ProductFormModal({ setShowModal, fetchProducts, editData, brands = [] }) {
  const [form, setForm] = useState({
    name: editData?.name || "",
    description: editData?.description || "",
    price: editData?.price || 0,
    sku: editData?.sku || "",
    brand: editData?.brand?._id || "",
    featuredImage: editData?.featuredImage || "",
    colors: editData?.colors || [],
    tags: editData?.tags || [],
  });

  const [tagInput, setTagInput] = useState("");

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editData ? "PUT" : "POST";
    const url = editData ? `/api/admin/products/${editData._id}` : "/api/admin/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      fetchProducts();
      setShowModal(false);
    } else {
      const err = await res.json();
      alert(err.message || "Something went wrong");
    }
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
  const handleAddColor = () => setForm({
    ...form,
    colors: [...form.colors, { name: "", hex: "#ffffff", images: [], stock: [] }]
  });
  const handleRemoveColor = (index) => {
    const colors = [...form.colors];
    colors.splice(index, 1);
    setForm({ ...form, colors });
  };
  const handleAddStock = (colorIndex) => {
    const colors = [...form.colors];
    colors[colorIndex].stock.push({ size: "", quantity: 0 });
    setForm({ ...form, colors });
  };
  const handleRemoveStock = (colorIndex, stockIndex) => {
    const colors = [...form.colors];
    colors[colorIndex].stock.splice(stockIndex, 1);
    setForm({ ...form, colors });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-3/4 max-h-[90vh] overflow-auto space-y-4">
        <h2 className="text-xl font-bold mb-4">{editData ? "Edit Product" : "Add Product"}</h2>

        {/* Basic Fields */}
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border w-full p-2"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border w-full p-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: Number(e.target.value) })}
          className="border w-full p-2"
          required
        />
        <input
          type="text"
          placeholder="SKU"
          value={form.sku}
          onChange={e => setForm({ ...form, sku: e.target.value })}
          className="border w-full p-2"
        />

        {/* Brand Dropdown */}
        <select
          value={form.brand}
          onChange={e => setForm({ ...form, brand: e.target.value })}
          className="border w-full p-2"
          required
        >
          <option value="">Select Brand</option>
          {brands.map(b => (
            <option key={b._id} value={b._id}>{b.brand_name}</option>
          ))}
        </select>

        {/* Featured Image */}
        <ImageUpload
          image={form.featuredImage}
          onChange={url => setForm({ ...form, featuredImage: url })}
        />

        {/* Tags */}
        <div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              className="border p-1 flex-1"
            />
            <button type="button" onClick={handleAddTag} className="bg-gray-200 px-2 rounded">
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map(t => (
              <span key={t} className="bg-blue-200 px-2 py-1 rounded flex items-center gap-1">
                {t} <button type="button" onClick={() => handleRemoveTag(t)}>x</button>
              </span>
            ))}
          </div>
        </div>

        {/* Colors Section */}
        <div>
          <h3 className="font-semibold mb-2">Colors</h3>
          {form.colors.map((color, i) => (
            <div key={i} className="border p-2 mb-2">
              <div className="flex justify-between items-center mb-2">
                <strong>Color {i + 1}</strong>
                <button type="button" onClick={() => handleRemoveColor(i)} className="text-red-500">
                  Remove Color
                </button>
              </div>

              <input
                type="text"
                placeholder="Color Name"
                value={color.name}
                onChange={e => {
                  const colors = [...form.colors];
                  colors[i].name = e.target.value;
                  setForm({ ...form, colors });
                }}
                className="border w-full mb-1 p-1"
                required
              />
              <input
                type="color"
                value={color.hex}
                onChange={e => {
                  const colors = [...form.colors];
                  colors[i].hex = e.target.value;
                  setForm({ ...form, colors });
                }}
                className="mb-2"
              />

              {/* Color Image */}
              <ImageUpload
                image={color.images[0] || ""}
                onChange={url => {
                  const colors = [...form.colors];
                  colors[i].images = [url];
                  setForm({ ...form, colors });
                }}
              />

              {/* Stock */}
              <div>
                <h4 className="font-semibold mt-2">Stock</h4>
                {color.stock.map((s, k) => (
                  <div key={k} className="flex gap-2 mb-1">
                    <input
                      type="text"
                      placeholder="Size"
                      value={s.size}
                      onChange={e => {
                        const colors = [...form.colors];
                        colors[i].stock[k].size = e.target.value;
                        setForm({ ...form, colors });
                      }}
                      className="border p-1 flex-1"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={s.quantity}
                      onChange={e => {
                        const colors = [...form.colors];
                        colors[i].stock[k].quantity = Number(e.target.value);
                        setForm({ ...form, colors });
                      }}
                      className="border p-1 w-20"
                    />
                    <button type="button" onClick={() => handleRemoveStock(i, k)} className="text-red-500">x</button>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddStock(i)} className="bg-gray-200 px-2 rounded mt-1">
                  Add Stock
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddColor} className="bg-gray-300 px-3 py-1 rounded">
            Add Color
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowModal(false)}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">{editData ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
}