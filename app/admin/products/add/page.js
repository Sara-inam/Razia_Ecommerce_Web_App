// app/admin/products/add/page.js
"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function AddProductPage() {
  return (
    <main className="p-8 bg-gray-100 min-h-screen">
    
      <ProductForm />
    </main>
  );
}