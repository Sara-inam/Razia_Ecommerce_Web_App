"use client";

import { useEffect, useState } from "react";
import BrandsTable from "@/components/admin/brands/BrandsTable";
import AddBrandModal from "@/components/admin/brands/AddBrandModal";
import EditBrandModal from "@/components/admin/brands/EditBrandModal";
import DeleteBrandModal from "@/components/admin/brands/DeleteBrandModal";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBrands = async () => {
    const res = await fetch("/api/admin/brands");
    const data = await res.json();
    setBrands(data);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>

      <button
        onClick={() => setShowAdd(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Brand
      </button>

      <BrandsTable
        brands={brands}
        setEditData={setEditData}
        setDeleteId={setDeleteId}
      />

      {showAdd && <AddBrandModal onClose={() => setShowAdd(false)} refresh={fetchBrands} />}
      {editData && <EditBrandModal data={editData} onClose={() => setEditData(null)} refresh={fetchBrands} />}
      {deleteId && <DeleteBrandModal id={deleteId} onClose={() => setDeleteId(null)} refresh={fetchBrands} />}
    </div>
  );
}