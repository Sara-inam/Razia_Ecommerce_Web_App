"use client";

import { useState, useEffect } from "react";

export default function ProductModal({ product, selectedColor, onSelectColor, onClose }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [colorStartIndex, setColorStartIndex] = useState(0);

  const colors = product.colors || [];
  const visibleCount = 3; // Carousel count

  // Set default size when selectedColor changes
  useEffect(() => {
    if (selectedColor?.stock?.length > 0) {
      setSelectedSize(selectedColor.stock[0].size);
      setQuantity(1);
    } else {
      setSelectedSize("");
      setQuantity(1);
    }
  }, [selectedColor]);

  const handlePrev = () => {
    setColorStartIndex(prev =>
      prev === 0 ? Math.max(colors.length - visibleCount, 0) : prev - 1
    );
  };

  const handleNext = () => {
    setColorStartIndex(prev =>
      prev + visibleCount >= colors.length ? 0 : prev + 1
    );
  };

  const visibleColors = colors.slice(colorStartIndex, colorStartIndex + visibleCount);

  // Quantity functions based on selected size stock
  const maxQty = selectedColor?.stock?.find(s => s.size === selectedSize)?.quantity || 1;

  const increaseQty = () => {
    if (quantity < maxQty) setQuantity(q => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQuantity(1); // reset quantity when size changes
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-24 backdrop-blur-sm bg-black/20 pointer-events-none">
      <div className="bg-white rounded-3xl w-full md:w-4/5 lg:w-3/4 overflow-auto flex flex-col md:flex-row p-8 gap-8 shadow-2xl relative pointer-events-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Left: Image & Color Carousel */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-lg mb-5 border border-gray-200">
            <img
              src={selectedColor?.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Color Carousel */}
          {colors.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handlePrev}
                className={`text-gray-500 hover:text-gray-800 font-bold text-lg ${colors.length <= visibleCount ? "hidden" : ""}`}
              >
                &lt;
              </button>

              <div className="flex gap-3 overflow-hidden">
                {visibleColors.map((color, idx) => (
                  <div
                    key={color._id || idx}
                    onClick={() => onSelectColor(product._id, color)}
                    className={`w-16 h-16 rounded-full cursor-pointer border-2 transition-all duration-200 flex items-center justify-center ${
                      selectedColor === color ? "border-green-600 scale-110 shadow-md" : "border-gray-300 hover:scale-105 hover:shadow-sm"
                    }`}
                  >
                    <img
                      src={color.images?.[0]}
                      alt={`color-${idx}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className={`text-gray-500 hover:text-gray-800 font-bold text-lg ${colors.length <= visibleCount ? "hidden" : ""}`}
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-600">
                Brand: <span className="text-gray-800 font-semibold">{product.brand?.brand_name}</span>
              </p>
              {product.brand?.description && (
                <p className="text-xs text-gray-500 italic">{product.brand.description}</p>
              )}
              {product.brand?.collection?.collection_name && (
                <p className="text-sm text-gray-600">
                  Collection: <span className="text-gray-800 font-semibold">{product.brand.collection.collection_name}</span>
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Category: <span className="text-gray-700 font-medium">{product?.brand?.collection?.category}</span> | 
              Subcategory: <span className="text-gray-700 font-medium">{product?.brand?.collection?.sub_category}</span>
            </p>

            <div className="mt-2 flex items-center gap-4">
              {product.discountPercentage > 0 ? (
                <>
                  <span className="text-gray-400 line-through text-lg">Rs {product.price}</span>
                  <span className="text-green-600 font-bold text-2xl">Rs {product.discountPrice}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-md">
                    {product.discountPercentage}% OFF
                  </span>
                </>
              ) : (
                <span className="text-gray-900 font-bold text-2xl">Rs {product.price}</span>
              )}
            </div>

            {/* Size Selector */}
            {selectedColor?.stock?.length > 0 && (
              <div className="flex items-center gap-4 mt-5">
                <select
                  value={selectedSize}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:border-green-500 transition"
                >
                  {selectedColor.stock.map((s) => (
                    <option key={s.size} value={s.size}>{s.size}</option>
                  ))}
                </select>

                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decreaseQty}
                    className="px-4 py-1 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={maxQty}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(maxQty, Number(e.target.value)));
                      setQuantity(val);
                    }}
                    className="w-12 text-center text-sm border-l border-r border-gray-300 outline-none"
                  />
                  <button
                    onClick={increaseQty}
                    className="px-4 py-1 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5 text-gray-700 text-sm leading-relaxed border-t border-gray-200 pt-4">
              {product.description}
            </div>
          </div>

          <button
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition font-semibold text-lg disabled:opacity-50"
            disabled={!selectedColor || !selectedSize}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}