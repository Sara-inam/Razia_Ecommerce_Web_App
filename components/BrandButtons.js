"use client";

export default function BrandButtons({ brands, activeBrand, setActiveBrand }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setActiveBrand(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
          activeBrand === null
            ? "bg-green-600 text-white shadow"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        All
      </button>

      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => setActiveBrand(brand)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            activeBrand === brand
              ? "bg-green-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {brand}
        </button>
      ))}
    </div>
  );
}