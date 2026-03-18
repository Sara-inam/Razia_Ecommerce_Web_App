"use client";

export default function SubcategoryButtons({ subcategories, activeSubcategory, setActiveSubcategory }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setActiveSubcategory(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
          activeSubcategory === null
            ? "bg-green-600 text-white shadow"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        All
      </button>

      {subcategories.map((sub) => (
        <button
          key={sub}
          onClick={() => setActiveSubcategory(sub)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            activeSubcategory === sub
              ? "bg-green-600 text-white shadow"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {sub}
        </button>
      ))}
    </div>
  );
}