"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedColors, setSelectedColors] = useState({});

  const getDefaultColor = (product) => {
    return (
      product.colors?.find((c) => c?.images?.length > 0) ||
      product.colors?.[0] ||
      null
    );
  };

  useEffect(() => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();

        setResults(data);

        const map = {};
        data.forEach((p) => {
          map[p._id] = getDefaultColor(p);
        });

        setSelectedColors(map);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  const handleSelectColor = (productId, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Search Results for:{" "}
            <span className="text-green-600">{q}</span>
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {results.length > 0 && !loading
              ? `${results.length} products found`
              : ""}
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-48 sm:h-56 bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && results.length === 0 && q && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-500 text-lg font-medium">
              No products found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && results.length > 0 && (
          <div className="
            grid
            grid-cols-1      /* ✅ MOBILE = 1 CARD */
            sm:grid-cols-2   /* TABLET = 2 */
            md:grid-cols-3   /* MD = 3 */
            lg:grid-cols-4   /* LG = 4 */
            xl:grid-cols-5   /* XL = 5 */
            gap-3 sm:gap-4
          ">
            {results.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                selectedColor={selectedColors[p._id]}
                onSelectColor={handleSelectColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}