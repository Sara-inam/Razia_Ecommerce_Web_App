"use client";

export default function SubcategoryButtons({
  subcategories,
  activeSubcategory,
  setActiveSubcategory,
}) {
  return (
    <div className="w-full">
      
      {/* Scrollable Container */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        
        {/* All Button */}
        <button
          onClick={() => setActiveSubcategory(null)}
          className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
            activeSubcategory === null
              ? "bg-green-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>

        {/* Subcategories */}
        {subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubcategory(sub)}
            className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              activeSubcategory === sub
                ? "bg-green-600 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}