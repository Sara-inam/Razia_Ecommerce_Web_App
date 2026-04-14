"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedColors, setSelectedColors] = useState({});

  const getDefaultColor = (product) =>
    product.colors?.find((c) => c?.images?.length > 0) ||
    product.colors?.[0] ||
    null;

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">

        <h1 className="text-xl font-bold">
          Search Results: <span className="text-green-600">{q}</span>
        </h1>

        {loading && <p>Loading...</p>}

        {!loading && results.length === 0 && q && (
          <p>No products found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {results.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              selectedColor={selectedColors[p._id]}
              onSelectColor={(id, color) =>
                setSelectedColors((prev) => ({ ...prev, [id]: color }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}