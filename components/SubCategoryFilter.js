"use client";

export default function SubCategoryFilter({ subCategories, selected, onSelect }) {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {subCategories.map((sub) => (
        <button
          key={sub}
          onClick={() => onSelect(sub)}
          className={`px-3 py-1 rounded-full text-sm font-medium border ${
            selected === sub
              ? "bg-green-700 text-white border-green-700"
              : "bg-white text-green-700 border-green-300"
          }`}
        >
          {sub}
        </button>
      ))}
    </div>
  );
}