"use client";

import { useState, useEffect } from "react";
import ProductTable from "@/components/admin/products/ProductTable";
import ProductFormModal from "@/components/admin/products/ProductFormModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]); // ✅ Add brands
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  // Fetch brands for the dropdown
  const fetchBrands = async () => {
    const res = await fetch("/api/admin/brands");
    const data = await res.json();
    setBrands(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands(); // ✅ Fetch brands when page loads
  }, []);

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
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}
      >
        Add Product
      </button>

      <ProductTable
        products={products}
        setEditData={setEditData}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
      />

      {showModal && (
        <ProductFormModal
          fetchProducts={fetchProducts}
          setShowModal={setShowModal}
          editData={editData}
          brands={brands} // ✅ Pass brands to the modal
        />
      )}
    </div>
  );
}