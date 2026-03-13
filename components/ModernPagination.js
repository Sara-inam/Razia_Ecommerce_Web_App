"use client";

export default function ModernPagination({ page, totalPages, onPageChange }) {
  const maxPagesToShow = 5;

  if (totalPages === 0) return null;

  let startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      {/* Previous */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 rounded-md border border-green-400 bg-white text-green-600 hover:bg-green-50 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &larr;
      </button>

      {/* First Page */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded-md border border-green-300 bg-white text-green-700 hover:bg-green-50 hover:scale-105 transition"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-md border transition ${
            p === page
              ? "bg-green-600 text-white border-green-600 shadow-lg scale-105"
              : "bg-white text-green-700 border-green-300 hover:bg-green-50 hover:scale-105"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Last Page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-md border border-green-300 bg-white text-green-700 hover:bg-green-50 hover:scale-105 transition"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 rounded-md border border-green-400 bg-white text-green-600 hover:bg-green-50 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &rarr;
      </button>
    </div>
  );
}