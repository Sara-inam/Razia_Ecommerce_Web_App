"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function ShopPage() {
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      return res.json();
    },
  });

  const grouped = collections.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    if (
      item.sub_category &&
      !acc[item.category].includes(item.sub_category)
    ) {
      acc[item.category].push(item.sub_category);
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Explore Our Collections
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            Discover categories and premium sub categories
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {Object.keys(grouped).map((cat) => (
            <div
              key={cat}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition overflow-hidden"
            >

              {/* top accent */}
              <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500"></div>

              <div className="p-5">

                {/* CATEGORY TITLE */}
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                  {cat}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {grouped[cat].length} premium sub categories
                </p>

                {/* 🔥 SUB CATEGORIES (PROMINENT CHIPS) */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {grouped[cat].map((sub) => (
                    <Link
                      key={sub}
                      href={`/products/${cat}?sub_category=${sub}`}
                      className="
                        px-4 py-2 text-sm font-medium
                        rounded-full
                        bg-gray-100
                        text-gray-700
                        border border-gray-200

                        hover:bg-green-500
                        hover:text-white
                        hover:border-green-500

                        hover:scale-105
                        transition-all duration-200
                        shadow-sm hover:shadow-md
                      "
                    >
                      {sub}
                    </Link>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Browse all items in {cat}
                  </span>

                  <Link
                    href={`/products/${cat}`}
                    className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline"
                  >
                    View All →
                  </Link>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}