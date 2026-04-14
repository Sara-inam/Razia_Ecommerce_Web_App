"use client";

import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

export default function ProductCardList({ products, setEditData, setShowModal, handleDelete }) {

  const [modalProduct, setModalProduct] = useState(null);

  if (!products.length) {
    return <p className="text-center py-10 text-gray-500">No products found</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow-sm p-3 flex flex-col items-center space-y-2"
          >

            {/* Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {p.colors?.[0]?.images?.[0] ? (
                <img src={p.colors[0].images[0]} className="w-full h-full object-cover" />
              ) : (
                <span>No Image</span>
              )}
            </div>

            {/* Name */}
            <h3 className="text-sm font-semibold text-center text-gray-800">
              {p.name}{" "}
              {p.brand?.brand_name && (
                <span className="text-xs italic text-gray-500">
                  ({p.brand.brand_name})
                </span>
              )}
            </h3>

            {/* Price */}
            <span className="text-green-600 font-bold">
              {p.discountPercentage > 0 ? (
                <>
                  <span className="line-through text-gray-400 mr-2">
                    Rs {p.price}
                  </span>
                  Rs {p.discountPrice}
                </>
              ) : (
                <>Rs {p.price}</>
              )}
            </span>

            {/* Collection / Category */}
            <div className="flex flex-wrap gap-1 justify-center text-xs">
              {p.brand?.collection?.collection_name && (
                <span className="bg-blue-100 px-2 rounded">
                  {p.brand.collection.collection_name}
                </span>
              )}
              {p.brand?.collection?.category && (
                <span className="bg-yellow-100 px-2 rounded">
                  {p.brand.collection.category}
                </span>
              )}
              {p.brand?.collection?.sub_category && (
                <span className="bg-yellow-100 px-2 rounded">
                  {p.brand.collection.sub_category}
                </span>
              )}
            </div>

            {/* Button */}
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => setModalProduct(p)}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          setEditData={setEditData}
          setShowModal={setShowModal}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}