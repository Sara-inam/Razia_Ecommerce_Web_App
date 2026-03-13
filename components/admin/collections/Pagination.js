"use client";

export default function ModernPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const maxPagesToShow = 5;
  let startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Previous */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 rounded-full border border-green-500 bg-white text-green-600 hover:bg-green-50 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &larr;
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 rounded-full border transition
            ${p === page
              ? "bg-green-600 text-white border-green-600 shadow-lg scale-105"
              : "bg-white text-green-700 border-green-300 hover:bg-green-50 hover:scale-105"
            }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 rounded-full border border-green-500 bg-white text-green-600 hover:bg-green-50 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &rarr;
      </button>
    </div>
  );
}