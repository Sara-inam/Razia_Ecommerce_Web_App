"use client";
import { useState } from "react";

export default function ProductDetailModal({ product, onClose, setEditData, setShowModal, handleDelete }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const selectedColor = product.colors?.[selectedColorIndex] || null;
  const selectedImage = selectedColor?.images?.[0] || "";
  const stockToShow = selectedColor?.stock || [];

  const displayColorName = selectedColor?.name || "No Color";
  const displayColorHex = selectedColor?.hex || "#ffffff";

  const discountPrice =
    product.discountPrice ??
    (product.discountPercentage
      ? Number(product.price) - (Number(product.price) * Number(product.discountPercentage)) / 100
      : Number(product.price));

  const isActive = Boolean(product.isActive);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto p-6 md:p-8 relative animate-fadeIn">
        
        {/* Close button */}
        <button
          className="absolute top-5 right-6 text-gray-500 hover:text-gray-800 text-3xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-8">

          {/* IMAGE SECTION */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="w-full flex justify-center mb-6">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  className="w-80 h-80 object-cover rounded-2xl shadow-lg border border-gray-200 transition-transform hover:scale-105"
                />
              ) : (
                <div className="w-80 h-80 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* COLOR SELECTOR */}
            <div className="flex justify-center gap-4 flex-wrap">
              {product.colors?.map((c, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedColorIndex(i)}
                  className={`w-16 h-16 rounded-full border-4 cursor-pointer overflow-hidden transition-transform duration-300 ${
                    selectedColorIndex === i
                      ? "border-green-500 scale-110 shadow-lg"
                      : "border-gray-200"
                  }`}
                >
                  {c.images?.[0] ? (
                    <img src={c.images[0]} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                      No
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="flex-1 space-y-4">
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{product.name}</h2>

            {/* Slug */}
            <p className="text-gray-600"><span className="font-semibold">Slug:</span> {product.slug || "-"}</p>

            {/* Collection / Brand Info */}
            <div className="flex flex-col gap-1 mt-1">
              {product.brand?.collection && (
                <>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    Collection: {product.brand.collection.collection_name || "-"}
                  </span>
                  <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    Category: {product.brand.collection.category || "-"}
                  </span>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    Sub Category: {product.brand.collection.sub_category || "-"}
                  </span>
                </>
              )}
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium inline-block mt-1">
                Brand: {product.brand?.brand_name || "-"}
              </span>
            </div>

            {/* Price */}
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              Rs {discountPrice.toFixed(2)}
              {product.discountPercentage > 0 && (
                <span className="line-through text-gray-400 text-lg ml-2">
                  Rs {product.price.toFixed(2)}
                </span>
              )}
            </p>
            {product.discountPercentage > 0 && (
              <p className="text-sm text-red-500 font-semibold">
                Discount: {product.discountPercentage}%
              </p>
            )}

            {/* Description */}
            <div>
              <p className="font-semibold text-gray-700">Description</p>
              <p className="text-gray-600">{product.description || "-"}</p>
            </div>

            {/* Active Status */}
            <p className="text-gray-600"><span className="font-semibold">Active:</span> {isActive ? "Yes" : "No"}</p>

            {/* Tags */}
            <div>
              <p className="font-semibold text-gray-700">Tags</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.tags?.length ? (
                  product.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No tags</span>
                )}
              </div>
            </div>

            {/* Color Info */}
            <div>
              <p className="font-semibold text-gray-700">Selected Color: {displayColorName}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="w-6 h-6 rounded-full border" style={{ backgroundColor: displayColorHex }} />
                <span className="text-gray-700 font-medium">{displayColorHex}</span>
              </div>
            </div>

            {/* Stock */}
            <div>
              <p className="font-semibold text-gray-700">Stock</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {stockToShow.length ? (
                  stockToShow.map((s, k) => (
                    <span key={k} className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                      Size: {s.size} | Qty: {s.quantity}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No stock available</span>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                className="bg-yellow-500 px-6 py-2 rounded-lg text-white font-semibold hover:bg-yellow-600 transition-all"
                onClick={() => {
                  setEditData(product);
                  setShowModal(true);
                  onClose();
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 px-6 py-2 rounded-lg text-white font-semibold hover:bg-red-600 transition-all"
                onClick={() => {
                  handleDelete(product._id);
                  onClose();
                }}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}