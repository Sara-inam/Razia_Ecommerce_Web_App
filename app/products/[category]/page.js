"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CollectionButtons from "@/components/CollectionButtons";

// ✅ SAFE FUNCTION
const slugToName = (slug = "") =>
  slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

export default function ProductsPage() {
  const params = useParams();
  const category = params?.category || "";

  const searchParams = useSearchParams();
  const subFromURL = searchParams.get("sub_category");
  const collectionFromURL = searchParams.get("collection"); // NEW

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

  const [activeBrand, setActiveBrand] = useState("All");
  const [activeCollection, setActiveCollection] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const limit = 12;

  // ✅ set subcategory from URL
  useEffect(() => {
    if (subFromURL) {
      setActiveSubcategory(slugToName(subFromURL));
    }
  }, [subFromURL]);

  // ✅ set collection from URL
  useEffect(() => {
    if (collectionFromURL) {
      setActiveCollection(slugToName(collectionFromURL));
    }
  }, [collectionFromURL]);

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    if (!category) return;

    const categoryName = slugToName(category);

    const subQuery = subFromURL
      ? `&sub_category=${slugToName(subFromURL)}`
      : "";

    fetch(`/api/products?category=${categoryName}${subQuery}`)
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
  }, [category, subFromURL]);

  // ✅ COLLECTIONS (SAFE)
  const collections = [
    ...Array.from(
      new Set(
        products
          .map((p) => p.brand?.collection?.collection_name)
          .filter(Boolean)
      )
    ),
  ];

  // ✅ SUBCATEGORIES
  const subcategories = [
    "All",
    ...Array.from(
      new Set(products.map((p) => p.sub_category).filter(Boolean))
    ),
  ];

  // ✅ BRANDS
  const brands = [
    "All",
    ...Array.from(
      new Set(
        products
          .filter((p) => {
            if (activeCollection) {
              return p.brand?.collection?.collection_name === activeCollection;
            }
            return true;
          })
          .filter((p) =>
            activeSubcategory === "All"
              ? true
              : p.sub_category === activeSubcategory
          )
          .map((p) => p.brand?.brand_name)
          .filter(Boolean)
      )
    ),
  ];

  // ✅ RESET FILTERS
  useEffect(() => {
    setActiveBrand("All");
    setCurrentPage(1);
  }, [activeSubcategory, activeCollection]);

  // ✅ FILTER LOGIC
  useEffect(() => {
    let temp = [...products];

    if (activeCollection) {
      temp = temp.filter(
        (p) => p.brand?.collection?.collection_name === activeCollection
      );
    }

    if (activeSubcategory !== "All") {
      temp = temp.filter((p) => p.sub_category === activeSubcategory);
    }

    if (activeBrand !== "All") {
      temp = temp.filter((p) => p.brand?.brand_name === activeBrand);
    }

    setFilteredProducts(temp);
    setCurrentPage(1);
  }, [products, activeSubcategory, activeBrand, activeCollection]);

  const handleSelectColor = (productId, color) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / limit);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-green-500 to-green-400 px-5 py-3 rounded-xl shadow-md inline-block">
          {slugToName(category)}
        </h1>
      </div>

      {/* LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR */}
        <div className="w-full lg:w-56 flex-shrink-0 space-y-6">

          {/* COLLECTIONS */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 uppercase">
              Collections
            </h3>

            <CollectionButtons
              collections={collections}
              activeCollection={activeCollection}
              setActiveCollection={setActiveCollection}
            />
          </div>

          {/* SUBCATEGORIES */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 uppercase">
              Subcategories
            </h3>

            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2">
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
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

          {/* BRANDS */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 uppercase">
              Brands
            </h3>

            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
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

        {/* PRODUCTS */}
        <div className="flex-1">
          {paginatedProducts.length === 0 ? (
            <div className="text-center mt-16">
              <p className="text-gray-500 text-lg">No products found 😔</p>
              <p className="text-sm text-gray-400 mt-1">
                Try changing filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  selectedColor={selectedColors[product._id]}
                  onSelectColor={handleSelectColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-gray-200"
          >
            &lt; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1 rounded-lg ${
                p === currentPage
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-200"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}