"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCardList from "@/components/admin/products/ProductCardList";
import ProductFormModal from "@/components/admin/products/ProductFormModal";
import ModernPagination from "@/components/ModernPagination";

export default function ProductsPage() {
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [brand, setBrand] = useState("");

  const [page, setPage] = useState(1);
  const limit = 15;

  // ================= BRANDS =================
  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/admin/brands");
      return res.json();
    },
  });

  const brands = useMemo(() => {
    if (!brandsData) return [];
    if (Array.isArray(brandsData)) return brandsData;
    if (Array.isArray(brandsData?.data)) return brandsData.data;
    if (Array.isArray(brandsData?.brands)) return brandsData.brands;
    return [];
  }, [brandsData]);

  // ================= FILTERS =================
  const categories = useMemo(() => {
    return [...new Set(brands.map(b => b?.collection?.category).filter(Boolean))];
  }, [brands]);

  const collections = useMemo(() => {
    return [...new Set(
      brands
        .filter(b => !category || b?.collection?.category === category)
        .map(b => b?.collection?.collection_name)
        .filter(Boolean)
    )];
  }, [brands, category]);

  const subCategories = useMemo(() => {
    return [...new Set(
      brands
        .filter(b =>
          (!category || b?.collection?.category === category) &&
          (!collection || b?.collection?.collection_name === collection)
        )
        .map(b => b?.collection?.sub_category)
        .filter(Boolean)
    )];
  }, [brands, category, collection]);

  const brandList = useMemo(() => {
    return [...new Set(brands.map(b => b?.brand_name).filter(Boolean))];
  }, [brands]);

  // ================= PRODUCTS =================
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", page, category, subCategory, collection, brand],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", limit);

      if (category) params.set("category", category);
      if (subCategory) params.set("sub_category", subCategory);
      if (collection) params.set("collection", collection);
      if (brand) params.set("brand", brand);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");

      return res.json();
    },
    keepPreviousData: true, // ⭐ IMPORTANT FIX
  });

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    refetch();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-3">

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCollection("");
            setSubCategory("");
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {/* COLLECTION */}
        <select
          value={collection}
          onChange={(e) => {
            setCollection(e.target.value);
            setSubCategory("");
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Collections</option>
          {collections.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <select
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Sub Categories</option>
          {subCategories.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>

        {/* BRAND */}
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Brands</option>
          {brandList.map((b, i) => (
            <option key={i} value={b}>{b}</option>
          ))}
        </select>

      </div>

      {/* ADD BUTTON */}
      <div className="flex justify-end mb-5">
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* PRODUCTS */}
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ProductCardList
          products={productsData?.items || []}
          setEditData={setEditData}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
        />
      )}

      {/* ⭐ PAGINATION FIX (MAIN ISSUE FIXED) */}
      {productsData?.totalPages > 1 && (
        <div className="flex justify-center mt-8">
         <ModernPagination
  page={page}                // ✅ FIX
  totalPages={productsData.totalPages}
  onPageChange={setPage}
/>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <ProductFormModal
          fetchProducts={refetch}
          setShowModal={setShowModal}
          editData={editData}
          brands={brands}
        />
      )}
    </div>
  );
}