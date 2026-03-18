"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const params = useParams();
  const { collection, category } = params;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [selectedColors, setSelectedColors] = useState({});

  const slugToName = (slug) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Fetch products
  useEffect(() => {
    if (!collection || !category) return;

    const collectionName = slugToName(collection);
    const categoryName = slugToName(category);

    fetch(`/api/products?collection=${collectionName}&category=${categoryName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.products) {
          setProducts(data.products);
          const initialColors = {};
          data.products.forEach((p) => {
            initialColors[p._id] = p.colors?.[0] || null;
          });
          setSelectedColors(initialColors);
        }
      });
  }, [collection, category]);

  // Subcategories
  const subcategories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.sub_category).filter(Boolean))),
  ];

  // Dynamic brands based on selected subcategory
  const brands = [
    "All",
    ...Array.from(
      new Set(
        products
          .filter((p) =>
            activeSubcategory === "All" ? true : p.sub_category === activeSubcategory
          )
          .map((p) => p.brand?.brand_name)
          .filter(Boolean)
      )
    ),
  ];

  // Reset brand to "All" if subcategory changes
  useEffect(() => {
    setActiveBrand("All");
  }, [activeSubcategory]);

  // Filtering logic
  useEffect(() => {
    let temp = [...products];

    if (activeSubcategory !== "All") {
      temp = temp.filter((p) => p.sub_category === activeSubcategory);
    }

    if (activeBrand !== "All") {
      temp = temp.filter((p) => p.brand?.brand_name === activeBrand);
    }

    setFilteredProducts(temp);
  }, [products, activeSubcategory, activeBrand]);

  const handleSelectColor = (productId, color) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {slugToName(collection)} / {slugToName(category)}
        </h1>
        <p className="text-gray-500 mt-1">
          Explore premium products with best quality ✨
        </p>
      </div>

      <div className="flex gap-4">
        {/* Sidebar Filters */}
        <div className="w-48 flex-shrink-0 sticky top-24 self-start space-y-6">
          {/* Subcategories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">Subcategories</h3>
            <div className="flex flex-col gap-2">
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                    activeSubcategory === sub
                      ? "bg-green-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">Brands</h3>
            <div className="flex flex-col gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                    activeBrand === brand
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center mt-16">
              <p className="text-gray-500 text-lg">No products found 😔</p>
              <p className="text-sm text-gray-400 mt-1">Try changing filters</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                selectedColor={selectedColors[product._id]}
                onSelectColor={handleSelectColor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}