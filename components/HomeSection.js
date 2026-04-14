"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

const makeSlug = (text = "") =>
  text.toLowerCase().trim().replace(/\s+/g, "-");

export default function HomeSection({ section }) {
  const router = useRouter();

  const {
    title,
    collection,
    category,
    subCategory,
    products: initialProducts = [],
  } = section || {};

  // ✅ Always safe array
  const productsData = initialProducts || [];

  // ⚡ only first 12 products
  const displayProducts = useMemo(
    () => productsData.slice(0, 12),
    [productsData]
  );

  // ✅ FIX: safe initial state (no hydration bug)
  const [selectedColors, setSelectedColors] = useState(() => {
    const acc = {};
    displayProducts.forEach((product) => {
      acc[product?._id] = product?.colors?.[0] || null;
    });
    return acc;
  });

  const [activeProduct, setActiveProduct] = useState(null);

  const handleSelectColor = (productId, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  const handleViewAll = () => {
    const catSlug = makeSlug(category);

    const query = subCategory
      ? `?sub_category=${makeSlug(subCategory)}&collection=${makeSlug(collection)}`
      : `?collection=${makeSlug(collection)}`;

    router.push(`/products/${catSlug}${query}`);
  };

  // ✅ SAFE RENDER GUARD (fixes Vercel blank section issue)
  if (!displayProducts.length) return null;

  return (
    <>
      <section className="px-3 sm:px-4 md:px-6 py-5 md:py-7 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 md:mb-7">

          {/* LEFT */}
          <div className="flex flex-col gap-2">

            {/* BADGES */}
            <div className="flex flex-wrap items-center gap-2">

              {collection && (
                <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {collection}
                </span>
              )}

              {category && (
                <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {category}
                </span>
              )}

              {subCategory && (
                <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {subCategory}
                </span>
              )}

            </div>

            {/* TITLE */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>

            {/* ACCENT */}
            <div className="w-14 h-[3px] bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
          </div>

          {/* RIGHT BUTTON */}
          <div className="sm:ml-auto flex sm:justify-end">
            <button
              onClick={handleViewAll}
              className="px-5 py-2.5 text-sm font-semibold text-white 
              bg-gradient-to-r from-emerald-600 to-emerald-700 
              hover:from-emerald-700 hover:to-emerald-800
              active:scale-95 hover:scale-105
              transition-all duration-300 
              rounded-xl shadow-md whitespace-nowrap"
            >
              View All →
            </button>
          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              selectedColor={selectedColors[product._id]}
              onSelectColor={handleSelectColor}
              onViewDetails={() => setActiveProduct(product)}
              imageClass="object-contain"
            />
          ))}
        </div>

        {/* FOOTER */}
        {displayProducts.length === 12 && (
          <div className="mt-5 text-center">
            <span className="text-[11px] sm:text-xs text-gray-500">
              Showing top products
            </span>
          </div>
        )}

      </section>

      {/* MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
          <div className="w-full max-w-2xl md:max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-xl border">
            <ProductModal
              product={activeProduct}
              selectedColor={selectedColors[activeProduct._id]}
              onSelectColor={handleSelectColor}
              onClose={() => setActiveProduct(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}