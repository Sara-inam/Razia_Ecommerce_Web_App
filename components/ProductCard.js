"use client";
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-4 shadow-md rounded">
      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">Rs {product.price}</p>
      <Link 
        href={`/products/${product.id}`} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        View Details
      </Link>
    </div>
  );
}