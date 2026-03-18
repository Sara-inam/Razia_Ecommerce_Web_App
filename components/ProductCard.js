"use client";

import { useState } from "react";

export default function ProductCard({ product, selectedColor, onSelectColor }) {
  const [selectedSize, setSelectedSize] = useState(
    selectedColor?.stock?.[0]?.size || ""
  );
  const [quantity, setQuantity] = useState(1);

  const handleColorClick = (color) => {
    onSelectColor(product._id, color);
    setSelectedSize(color.stock?.[0]?.size || "");
    setQuantity(1);
  };

  const increaseQty = () => {
    if (selectedColor && quantity < selectedColor.stock.length) {
      setQuantity((q) => q + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group">
      
      {/* 🔥 Image Section */}
      <div className="relative">
        <img
          src={selectedColor?.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            {product.discountPercentage}% OFF
          </span>
        )}

        {/* Collection Badge */}
        {product.brand?.collection?.collection_name && (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-md">
            {product.brand.collection.collection_name}
          </span>
        )}
      </div>

      {/* 🔥 Content */}
      <div className="p-4 flex flex-col h-full">

        {/* Title */}
        <h2 className="text-md font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h2>

        {/* Brand */}
        <p className="text-xs text-gray-500 mt-1">
          {product.brand?.brand_name}
        </p>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          {product.discountPercentage > 0 ? (
            <>
              <span className="text-gray-400 line-through text-sm">
                Rs {product.price}
              </span>
              <span className="text-green-600 font-bold">
                Rs {product.discountPrice}
              </span>
            </>
          ) : (
            <span className="text-gray-900 font-bold">
              Rs {product.price}
            </span>
          )}
        </div>

        {/* 🔥 Colors */}
        {product.colors?.length > 0 && (
          <div className="flex gap-2 mt-3">
            {product.colors.map((color, idx) => (
              <img
                key={idx}
                src={color.images?.[0]}
                onClick={() => handleColorClick(color)}
                className={`w-8 h-8 rounded-full border cursor-pointer transition ${
                  selectedColor === color
                    ? "border-green-600 scale-110"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* 🔥 Size + Qty */}
        <div className="flex items-center gap-2 mt-3">
          {selectedColor?.stock?.length > 0 && (
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border rounded-md px-2 py-1 text-xs"
            >
              {selectedColor.stock.map((s) => (
                <option key={s.size}>{s.size}</option>
              ))}
            </select>
          )}

          {selectedColor?.stock?.length > 0 && (
            <div className="flex items-center border rounded-md">
              <button onClick={decreaseQty} className="px-2">-</button>
              <span className="px-2 text-sm">{quantity}</span>
              <button onClick={increaseQty} className="px-2">+</button>
            </div>
          )}
        </div>

        {/* 🔥 Button */}
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
          disabled={!selectedColor || !selectedSize}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}