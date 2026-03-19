"use client";

export default function BrandButtons({
  brands,
  activeBrand,
  setActiveBrand,
}) {
  return (
    <div className="w-full">
      
      {/* Scrollable Row */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        
        {/* All Button */}
        <button
          onClick={() => setActiveBrand(null)}
          className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
            activeBrand === null
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>

        {/* Brand Buttons */}
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setActiveBrand(brand)}
            className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              activeBrand === brand
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}