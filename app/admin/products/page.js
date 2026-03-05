"use client";
import Link from "next/link";
import { useState } from "react";

// Mock products
const mockProducts = [
  { id: 1, name: "Leather Bag", price: 2500, stock: 10 },
  { id: 2, name: "Canvas Bag", price: 1800, stock: 5 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">Products</h1>
        <Link
          href="/admin/products/add"
          className="bg-green-700 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-800 hover:shadow-xl transition"
        >
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-green-700 mb-2">{p.name}</h2>
            <p className="text-gray-700 mb-1">Price: <span className="font-semibold">Rs {p.price}</span></p>
            <p className="text-gray-700 mb-3">Stock: <span className="font-semibold">{p.stock}</span></p>

            <div className="flex gap-3">
              <Link
                href={`/admin/products/${p.id}`}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700 transition shadow-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-center hover:bg-red-700 transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}