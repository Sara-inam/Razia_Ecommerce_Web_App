"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";

export default function ProductModal({ product, selectedColor, onSelectColor, onClose }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [colorStartIndex, setColorStartIndex] = useState(0);

  const visibleCount = 3;

  // TanStack Query to fetch latest product data
  const { data: productData = product, isLoading } = useQuery({
    queryKey: ["product", product._id],
    queryFn: async () => {
      // Replace with actual API if needed
      // const res = await fetch(`/api/products/${product._id}`);
      // return res.json();
      return product;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const colors = productData.colors || [];

  useEffect(() => {
    if (selectedColor?.stock?.length > 0) {
      setSelectedSize(selectedColor.stock[0].size);
      setQuantity(1);
    } else {
      setSelectedSize("");
      setQuantity(1);
    }
  }, [selectedColor]);

  const maxQty =
    selectedColor?.stock?.find((s) => s.size === selectedSize)?.quantity || 1;

  const increaseQty = () => {
    if (quantity < maxQty) setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handlePrev = () => {
    setColorStartIndex((prev) =>
      prev === 0 ? Math.max(colors.length - visibleCount, 0) : prev - 1
    );
  };

  const handleNext = () => {
    setColorStartIndex((prev) =>
      prev + visibleCount >= colors.length ? 0 : prev + 1
    );
  };

  const visibleColors = colors.slice(
    colorStartIndex,
    colorStartIndex + visibleCount
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-end sm:items-center p-2">
      <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-h-[90vh] sm:w-[95%] md:w-[90%] lg:w-[75%] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-y-auto">

          {/* LEFT */}
          <div className="flex-1 flex flex-col items-center p-4 sm:p-6">
            {/* Product Image */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square rounded-2xl overflow-hidden shadow border border-gray-200 mb-4">
              <img
                src={selectedColor?.images?.[0] || "/placeholder.png"}
                alt={productData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Color Carousel */}
            {colors.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handlePrev}
                  className={`text-gray-500 text-lg ${colors.length <= visibleCount ? "hidden" : ""}`}
                >
                  &lt;
                </button>

                <div className="flex gap-2 sm:gap-3">
                  {visibleColors.map((color, idx) => (
                    <div
                      key={color._id || idx}
                      onClick={() => onSelectColor(productData._id, color)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full cursor-pointer border-2 flex items-center justify-center transition ${
                        selectedColor === color
                          ? "border-green-600 scale-110 shadow"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={color.images?.[0]}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className={`text-gray-500 text-lg ${colors.length <= visibleCount ? "hidden" : ""}`}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Title */}
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
                {productData.name}
              </h2>

              {/* Brand Info */}
              <div className="flex flex-col gap-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Brand:{" "}
                  <span className="text-gray-800 font-semibold">
                    {productData.brand?.brand_name}
                  </span>
                </p>
                {productData.brand?.description && (
                  <p className="text-xs text-gray-500 italic">
                    {productData.brand.description}
                  </p>
                )}
                {productData.brand?.collection?.collection_name && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    Collection:{" "}
                    <span className="text-gray-800 font-semibold">
                      {productData.brand.collection.collection_name}
                    </span>
                  </p>
                )}
              </div>

              {/* Category */}
              <p className="text-xs sm:text-sm text-gray-500">
                Category:{" "}
                <span className="text-gray-700 font-medium">
                  {productData?.brand?.collection?.category || "-"}
                </span>{" "}
                | Subcategory:{" "}
                <span className="text-gray-700 font-medium">
                  {productData?.brand?.collection?.sub_category || "-"}
                </span>
              </p>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                {productData.discountPercentage > 0 ? (
                  <>
                    <span className="text-gray-400 line-through text-sm sm:text-lg">
                      Rs {productData.price}
                    </span>
                    <span className="text-green-600 font-bold text-lg sm:text-2xl">
                      Rs {productData.discountPrice}
                    </span>
                    <span className="bg-green-100 text-green-800 text-[10px] sm:text-xs px-2 py-0.5 rounded-md">
                      {productData.discountPercentage}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-gray-900 font-bold text-lg sm:text-2xl">
                    Rs {productData.price}
                  </span>
                )}
              </div>

              {/* Size + Qty */}
              {selectedColor?.stock?.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <select
                    value={selectedSize}
                    onChange={(e) => handleSizeChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {selectedColor.stock.map((s) => (
                      <option key={s.size} value={s.size}>
                        {s.size}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={decreaseQty} className="px-3 py-1">-</button>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      max={maxQty}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(maxQty, Number(e.target.value)));
                        setQuantity(val);
                      }}
                      className="w-12 text-center text-sm outline-none"
                    />
                    <button onClick={increaseQty} className="px-3 py-1">+</button>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-3 text-gray-700 text-xs sm:text-sm leading-relaxed border-t pt-3">
                {productData.description}
              </div>
              {selectedColor?.stock?.length > 0 && selectedSize && (
  <div className="mt-3 text-gray-700 text-sm flex items-center gap-2">
    <label className="font-medium">Max Quantity:</label>
    <span className="px-2 py-1 border rounded-lg bg-gray-100">
      {selectedColor.stock.find(s => s.size === selectedSize)?.quantity || 0}
    </span>
  </div>
)}
            </div>
           

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                if (!selectedColor || !selectedSize) return;
                addToCart({
                  productId: productData._id,
                  name: productData.name,
                  price: productData.discountPrice || productData.price,
                  image: selectedColor?.images?.[0],
                  colorId: selectedColor?._id,
                  colorName: selectedColor?.name || selectedColor?.color || "",
                  size: selectedSize,
                  quantity,
                });
                onClose();
              }}
              className="mt-4 sm:mt-6 w-full bg-green-600 text-white py-2 sm:py-3 rounded-xl hover:bg-green-700 transition font-semibold text-sm sm:text-lg disabled:opacity-50"
              disabled={!selectedColor || !selectedSize}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}