"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CollectionTable from "@/components/admin/collections/CollectionsTable";
import AddCollectionModal from "@/components/admin/collections/AddCollectionModal";
import DeleteCollectionModal from "@/components/admin/collections/DeleteCollectionModal";
import EditCollectionModal from "@/components/admin/collections/EditCollectionModal";
import ModernPagination from "@/components/ModernPagination";

const fetchCollections = async (page) => {
  const res = await fetch(`/api/admin/collections?page=${page}&limit=10`);
  const data = await res.json();
  if (!res.ok && !data.success) throw new Error("Failed to fetch collections");
  return data;
};

export default function CollectionsPage() {
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);

  const queryClient = useQueryClient();

  // ✅ Fetch collections with TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["collections", page],
    queryFn: () => fetchCollections(page),
    keepPreviousData: true,
  });

  // Optional: a helper to refresh current page
  const refreshCollections = () => queryClient.invalidateQueries({ queryKey: ["collections", page] });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>

      <button
        onClick={() => setShowAdd(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700 transition"
      >
        Add Collection
      </button>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-center text-red-500">{error.message}</p>
      ) : (
        <CollectionTable
          collections={data.data}
          setDeleteId={setDeleteId}
          setEditData={setEditData}
        />
      )}

      <ModernPagination page={page} totalPages={data?.pagination?.totalPages || 1} onPageChange={setPage} />

      {showAdd && (
        <AddCollectionModal onClose={() => setShowAdd(false)} refresh={refreshCollections} />
      )}

      {deleteId && (
        <DeleteCollectionModal id={deleteId} onClose={() => setDeleteId(null)} refresh={refreshCollections} />
      )}

      {editData && (
        <EditCollectionModal data={editData} onClose={() => setEditData(null)} refresh={refreshCollections} />
      )}
    </div>
  );
}