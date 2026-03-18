"use client";

import { useState } from "react";
import ProductModal from "./ProductModal";

export default function ProductCard({ product, selectedColor, onSelectColor }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden group p-4 flex flex-col items-center
                      w-full sm:w-64 md:w-72 lg:w-72 max-w-[20rem] min-w-[16rem] h-auto">
        {/* Flags / Badges */}
        <div className="flex justify-between w-full mb-1 px-1">
          {product.discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-md">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.brand?.collection?.collection_name && (
            <span className="bg-green-600 text-white text-[9px] px-2 py-0.5 rounded-md">
              {product.brand.collection.collection_name}
            </span>
          )}
        </div>

        {/* Main Image */}
        <div className="relative w-full h-36 sm:h-40 md:h-44 rounded-xl overflow-hidden border-2 border-gray-200 mb-3">
          <img
            src={selectedColor?.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name & Brand */}
        <p className="text-sm font-semibold text-gray-800 text-center truncate w-full mb-1">
          {product.name} — {product.brand?.brand_name}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {product.discountPercentage > 0 ? (
            <>
              <span className="text-gray-400 line-through text-xs sm:text-[10px]">
                Rs {product.price}
              </span>
              <span className="text-green-600 font-bold text-sm sm:text-base">
                Rs {product.discountPrice}
              </span>
            </>
          ) : (
            <span className="text-gray-900 font-bold text-sm sm:text-base">
              Rs {product.price}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm sm:text-base"
        >
          View Details
        </button>
      </div>

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