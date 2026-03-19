"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductModal({
  product,
  selectedColor,
  onSelectColor,
  onClose,
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [colorStartIndex, setColorStartIndex] = useState(0);

  const colors = product.colors || [];
  const visibleCount = 3;
  const { addToCart } = useCart();

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

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-end sm:items-center">

      {/* Modal */}
      <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-h-[90vh]
                      sm:w-[95%] md:w-[90%] lg:w-[75%]
                      rounded-t-3xl sm:rounded-3xl
                      overflow-hidden flex flex-col shadow-2xl relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
        >
          &times;
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row h-full overflow-y-auto">

          {/* LEFT */}
          <div className="flex-1 flex flex-col items-center p-4 sm:p-6">

            {/* Image */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square rounded-2xl overflow-hidden shadow border border-gray-200 mb-4">
              <img
                src={selectedColor?.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Color Carousel */}
            {colors.length > 0 && (
              <div className="flex items-center gap-2 mt-2">

                <button
                  onClick={handlePrev}
                  className={`text-gray-500 text-lg ${colors.length <= visibleCount ? "hidden" : ""
                    }`}
                >
                  &lt;
                </button>

                <div className="flex gap-2 sm:gap-3">
                  {visibleColors.map((color, idx) => (
                    <div
                      key={color._id || idx}
                      onClick={() => onSelectColor(product._id, color)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full cursor-pointer border-2 flex items-center justify-center transition ${selectedColor === color
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
                  className={`text-gray-500 text-lg ${colors.length <= visibleCount ? "hidden" : ""
                    }`}
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
                {product.name}
              </h2>

              {/* Brand Info */}
              <div className="flex flex-col gap-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Brand:{" "}
                  <span className="text-gray-800 font-semibold">
                    {product.brand?.brand_name}
                  </span>
                </p>

                {product.brand?.description && (
                  <p className="text-xs text-gray-500 italic">
                    {product.brand.description}
                  </p>
                )}

                {product.brand?.collection?.collection_name && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    Collection:{" "}
                    <span className="text-gray-800 font-semibold">
                      {product.brand.collection.collection_name}
                    </span>
                  </p>
                )}
              </div>

              {/* Category */}
              <p className="text-xs sm:text-sm text-gray-500">
                Category:{" "}
                <span className="text-gray-700 font-medium">
                  {product?.brand?.collection?.category}
                </span>{" "}
                | Subcategory:{" "}
                <span className="text-gray-700 font-medium">
                  {product?.brand?.collection?.sub_category}
                </span>
              </p>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                {product.discountPercentage > 0 ? (
                  <>
                    <span className="text-gray-400 line-through text-sm sm:text-lg">
                      Rs {product.price}
                    </span>
                    <span className="text-green-600 font-bold text-lg sm:text-2xl">
                      Rs {product.discountPrice}
                    </span>
                    <span className="bg-green-100 text-green-800 text-[10px] sm:text-xs px-2 py-0.5 rounded-md">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-gray-900 font-bold text-lg sm:text-2xl">
                    Rs {product.price}
                  </span>
                )}
              </div>

              {/* Size + Qty */}
              {selectedColor?.stock?.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">

                  {/* Size */}
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

                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={decreaseQty} className="px-3 py-1">
                      -
                    </button>

                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      max={maxQty}
                      onChange={(e) => {
                        const val = Math.max(
                          1,
                          Math.min(maxQty, Number(e.target.value))
                        );
                        setQuantity(val);
                      }}
                      className="w-12 text-center text-sm outline-none"
                    />

                    <button onClick={increaseQty} className="px-3 py-1">
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-3 text-gray-700 text-xs sm:text-sm leading-relaxed border-t pt-3">
                {product.description}
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => {
                console.log("CLICKED ADD TO CART");
                console.log("selectedColor:", selectedColor);
                console.log("selectedSize:", selectedSize);
                console.log("quantity:", quantity);

                const item = {
                  productId: product._id,
                  name: product.name,
                  price: product.discountPrice || product.price,
                  image: selectedColor?.images?.[0],
                  colorId: selectedColor?._id,
                  colorName: selectedColor?.name || selectedColor?.color || "",
                  size: selectedSize,
                  quantity: quantity,
                };

                console.log("ITEM:", item);

                addToCart(item);
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