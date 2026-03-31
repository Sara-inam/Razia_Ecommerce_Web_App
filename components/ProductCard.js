"use client";

import { useState } from "react";
import ProductModal from "./ProductModal";

export default function ProductCard({ product, selectedColor, onSelectColor }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group flex flex-col
                      w-full h-full">

        {/* Flags / Badges */}
        <div className="flex justify-between items-center px-2 pt-2">
          {product.discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md">
              {product.discountPercentage}% OFF
            </span>
          )}

          {product.brand?.collection?.collection_name && (
            <span className="bg-green-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md">
              {product.brand.collection.collection_name}
            </span>
          )}
        </div>

        {/* Image */}
       <div className="relative w-32 h-32 md:w-36 md:h-36 mx-auto mt-2 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
  <img
    src={selectedColor?.images?.[0] || "/placeholder.png"}
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
  />
</div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          
          {/* Name */}
          <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 line-clamp-2 text-center">
            {product.name} — {product.brand?.brand_name}
          </p>

          {/* Price */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {product.discountPercentage > 0 ? (
              <>
                <span className="text-gray-400 line-through text-xs sm:text-sm">
                  Rs {product.price}
                </span>
                <span className="text-green-600 font-bold text-sm sm:text-base md:text-lg">
                  Rs {product.discountPrice}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-bold text-sm sm:text-base md:text-lg">
                Rs {product.price}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            onClick={() => setShowModal(true)}
            className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium
                       text-xs sm:text-sm md:text-base mt-3"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={product}
          selectedColor={selectedColor}
          onSelectColor={onSelectColor}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}