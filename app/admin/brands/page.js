"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BrandsTable from "@/components/admin/brands/BrandsTable";
import AddBrandModal from "@/components/admin/brands/AddBrandModal";
import EditBrandModal from "@/components/admin/brands/EditBrandModal";
import DeleteBrandModal from "@/components/admin/brands/DeleteBrandModal";
import ModernPagination from "@/components/ModernPagination";

// ✅ Fetch brands with backend pagination
const fetchBrands = async (page = 1, limit = 5) => {
  const res = await fetch(`/api/admin/brands?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch brands");
  return data; // return full response including page, totalPages, data
};

export default function BrandsPage() {
  const [page, setPage] = useState(1); // Current page
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const queryClient = useQueryClient();

  // ✅ TanStack Query for brands with page
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brands", page],
    queryFn: () => fetchBrands(page, 5),
    keepPreviousData: true, // smooth transition between pages
  });

  const refreshBrands = () => queryClient.invalidateQueries({ queryKey: ["brands"] });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>

      <button
        onClick={() => setShowAdd(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700 transition"
      >
        Add Brand
      </button>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading brands...</p>
      ) : isError ? (
        <p className="text-center text-red-500">{error.message}</p>
      ) : (
        <>
          {/* Brands Table */}
          <BrandsTable
            brands={data?.data || []} // array of brands
            setEditData={setEditData}
            setDeleteId={setDeleteId}
          />

          {/* Modern Pagination */}
          <ModernPagination
            page={data?.page || 1}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Add Brand Modal */}
      {showAdd && (
        <AddBrandModal
          onClose={() => setShowAdd(false)}
          refresh={refreshBrands}
        />
      )}

      {/* Edit Brand Modal */}
      {editData && (
        <EditBrandModal
          data={editData}
          onClose={() => setEditData(null)}
          refresh={refreshBrands}
        />
      )}

      {/* Delete Brand Modal */}
      {deleteId && (
        <DeleteBrandModal
          id={deleteId}
          onClose={() => setDeleteId(null)}
          refresh={refreshBrands}
        />
      )}
    </div>
  );
}