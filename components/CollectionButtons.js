"use client";

export default function CollectionButtons({
  collections,
  activeCollection,
  setActiveCollection,
}) {
  return (
    <div className="w-full">
      
      {/* Responsive Container */}
      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-2">

        {/* All Button */}
        <button
          onClick={() => setActiveCollection(null)}
          className={`whitespace-nowrap px-3 sm:px-4 py-1.5 lg:py-2 rounded-full lg:rounded-lg text-xs sm:text-sm font-medium transition border ${
            activeCollection === null
              ? "bg-green-600 text-white border-green-600 shadow"
              : "bg-white text-green-700 border-green-200 hover:bg-green-50"
          }`}
        >
          All
        </button>

        {/* Collections */}
        {collections.map((col) => {
          const name =
            typeof col === "string"
              ? col
              : col?.collection_name || col;

          return (
            <button
              key={name}
              onClick={() => setActiveCollection(name)}
              className={`whitespace-nowrap px-3 sm:px-4 py-1.5 lg:py-2 rounded-full lg:rounded-lg text-xs sm:text-sm font-medium transition border ${
                activeCollection === name
                  ? "bg-green-600 text-white border-green-600 shadow"
                  : "bg-white text-green-700 border-green-200 hover:bg-green-50"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}