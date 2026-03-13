"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCardList from "@/components/admin/products/ProductCardList";
import ProductFormModal from "@/components/admin/products/ProductFormModal";
import ModernPagination from "@/components/ModernPagination";

export default function ProductsPage() {
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch products using v5 single-object signature
  const {
    data: productsData,
    refetch: fetchProducts,
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/products?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    keepPreviousData: true,
  });

  // Fetch brands
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/admin/brands");
      if (!res.ok) throw new Error("Failed to fetch brands");
      return res.json();
    },
  });

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700 transition"
        onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}
      >
        Add Product
      </button>

      <ProductCardList
  fetchProductsFn={`/api/admin/products?page=${page}&limit=${limit}`}
  setEditData={setEditData}
  setShowModal={setShowModal}
  handleDelete={handleDelete}
/>

      {productsData?.totalPages > 1 && (
        <ModernPagination
          currentPage={page}
          totalPages={productsData.totalPages}
          onPageChange={setPage}
        />
      )}

      {showModal && (
        <ProductFormModal
          fetchProducts={fetchProducts}
          setShowModal={setShowModal}
          editData={editData}
          brands={brands}
        />
      )}
    </div>
  );
}