"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

export default function ProductCardList({ fetchProductsFn, setEditData, setShowModal, handleDelete }) {
  const [page, setPage] = useState(1);
  const limit = 6;
  const [modalProduct, setModalProduct] = useState(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      const res = await fetch(`${fetchProductsFn}?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    keepPreviousData: true,
  });

  const products = productsData?.items || productsData?.data || [];
  const totalPages = productsData?.totalPages || 1;

  if (isLoading) return <p className="text-center py-10 text-gray-500">Loading products...</p>;
  if (!products.length) return <p className="text-center py-10 text-gray-500">No products found</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
  <div
    key={p._id}
    className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 p-3 flex flex-col items-center space-y-2 group"
  >
    {/* Image */}
    <div className="w-24 h-24 rounded-full overflow-hidden shadow bg-gray-100 flex items-center justify-center">
      {p.colors?.[0]?.images?.[0] ? (
        <img
          src={p.colors[0].images[0]}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          alt={p.name}
        />
      ) : (
        <span className="text-gray-400 text-xs">No Image</span>
      )}
    </div>

    {/* Product Name */}
    <h3 className="font-semibold text-sm text-gray-800 text-center line-clamp-2">
      {p.name}
    </h3>

  {/* Price */}
<span className="text-green-600 font-bold text-base bg-green-50 px-3 py-0.5 rounded-full">
  {p.discountPercentage > 0 ? (
    <>
      <span className="line-through text-gray-400 mr-2">Rs {p.price}</span>
      Rs {p.discountPrice}
    </>
  ) : (
    <>Rs {p.price}</>
  )}
</span>

    {/* Brand */}
    {p.brand?.brand_name && (
      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
        {p.brand.brand_name}
      </span>
    )}

    {/* Collection / Category */}
    <div className="flex flex-wrap justify-center gap-1">
      {p.brand?.collection?.collection_name && (
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px]">
          {p.brand.collection.collection_name}
        </span>
      )}

      {p.brand?.collection?.category && (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-[10px]">
          {p.brand.collection.category}
        </span>
      )}
       {p.brand?.collection?.sub_category && (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-[10px]">
          {p.brand.collection.sub_category}
        </span>
      )}
    </div>

    {/* Button */}
    <button
      className="mt-1 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md py-1.5 transition"
      onClick={() => setModalProduct(p)}
    >
      View
    </button>
  </div>
))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg border ${page === i + 1 ? "bg-green-500 text-white" : "bg-white hover:bg-gray-100"
              }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Product Detail Modal */}
      {modalProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          setEditData={setEditData}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}