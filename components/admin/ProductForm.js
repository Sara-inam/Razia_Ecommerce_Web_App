// components/admin/ProductForm.js
"use client";
import { useState } from "react";

export default function ProductForm({ product, onSubmit }) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ name, price, stock });
    alert("Product submitted!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto transition-transform transform hover:-translate-y-1"
    >
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        {product ? "Edit Product" : "Add Product"}
      </h2>

      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2">Price (Rs)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Enter price"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Stock Quantity</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Enter stock quantity"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-800 hover:shadow-xl transition-all duration-300"
      >
        {product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}