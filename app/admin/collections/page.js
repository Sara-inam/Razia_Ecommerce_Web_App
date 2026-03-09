"use client";

import { useEffect, useState } from "react";
import CollectionTable from "@/components/admin/collections/CollectionsTable";
import AddCollectionModal from "@/components/admin/collections/AddCollectionModal";
import DeleteCollectionModal from "@/components/admin/collections/DeleteCollectionModal";
import EditCollectionModal from "@/components/admin/collections/EditCollectionModal";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);   // ✅ EDIT STATE

  const fetchCollections = async () => {
    const res = await fetch("/api/admin/collections");
    const data = await res.json();
    setCollections(data);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>

      <button
        onClick={() => setShowAdd(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Collection
      </button>

      <CollectionTable
        collections={collections}
        setDeleteId={setDeleteId}
        setEditData={setEditData}   // ✅ PASS THIS
      />

      {showAdd && (
        <AddCollectionModal
          onClose={() => setShowAdd(false)}
          refresh={fetchCollections}
        />
      )}

      {deleteId && (
  <DeleteCollectionModal
    id={deleteId}
    onClose={() => setDeleteId(null)}
    refresh={fetchCollections}
  />
)}

      {editData && (   // ✅ EDIT MODAL
        <EditCollectionModal
          data={editData}
          onClose={() => setEditData(null)}
          refresh={fetchCollections}
        />
      )}
    </div>
  );
}