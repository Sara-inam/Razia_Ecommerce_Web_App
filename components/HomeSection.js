"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

const makeSlug = (text = "") =>
  text.toLowerCase().trim().replace(/\s+/g, "-");

export default function HomeSection({ section }) {
  const router = useRouter();
  const { title, collection, category, subCategory, image, products: initialProducts } = section;

  const { data: productsData = initialProducts, isLoading } = useQuery({
    queryKey: ["sectionProducts", collection, category, subCategory],
    queryFn: async () => initialProducts || [],
    staleTime: 1000 * 60 * 5,
  });

  if (!productsData?.length) return null;

  const displayProducts = productsData.slice(0, 12);

  const [selectedColors, setSelectedColors] = useState(
    displayProducts.reduce((acc, product) => {
      acc[product._id] = product.colors?.[0] || null;
      return acc;
    }, {})
  );

  const [activeProduct, setActiveProduct] = useState(null);

  const handleSelectColor = (productId, color) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const handleViewAll = () => {
    const catSlug = makeSlug(category);
    const query = subCategory
      ? `?sub_category=${makeSlug(subCategory)}&collection=${makeSlug(collection)}`
      : `?collection=${makeSlug(collection)}`;

    router.push(`/products/${catSlug}${query}`);
  };

  return (
    <>
      <section className="px-3 sm:px-4 md:px-6 py-5 md:py-7 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2 sm:gap-0">
          <div className="flex items-center gap-3">
            {image && (
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <div>
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 leading-tight">
                {title}
              </h2>
              <div className="h-[2px] w-12 bg-emerald-500 mt-1 rounded-full"></div>
            </div>
          </div>
          <button
            onClick={handleViewAll}
            className="px-3 py-1 text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors self-start sm:self-auto"
          >
            View all
          </button>
        </div>

        {/* GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
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
        )}

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