"use client";

export default function ProductTable({ products, setEditData, setShowModal, handleDelete }) {
  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Description</th>
          <th className="border px-2 py-1">Price</th>
          <th className="border px-2 py-1">SKU</th>
          <th className="border px-2 py-1">Brand</th>
          <th className="border px-2 py-1">Collection</th>
          <th className="border px-2 py-1">Colors</th>
          <th className="border px-2 py-1">Featured Image</th>
          <th className="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 && (
          <tr>
            <td colSpan={9} className="text-center py-4">No products found</td>
          </tr>
        )}

        {products.map((p) => (
          <tr key={p._id} className="border hover:bg-gray-50 align-top">
            <td className="border px-2 py-1">{p.name}</td>
            <td className="border px-2 py-1">{p.description}</td>
            <td className="border px-2 py-1">{p.price}</td>
            <td className="border px-2 py-1">{p.sku}</td>

            {/* Brand */}
            <td className="border px-2 py-1">
              {p.brand ? (
                <div className="flex flex-col gap-1">
                  <div><strong>Name:</strong> {p.brand.brand_name}</div>
                  <div><strong>Description:</strong> {p.brand.description}</div>
                  {p.brand.image && (
                    <img src={p.brand.image} className="w-20 h-12 object-cover" />
                  )}
                </div>
              ) : "N/A"}
            </td>

            {/* Collection */}
            <td className="border px-2 py-1">
              {p.brand?.collection ? (
                <div className="flex flex-col gap-1">
                  <div><strong>Name:</strong> {p.brand.collection.collection_name}</div>
                  <div><strong>Category:</strong> {p.brand.collection.category}</div>
                  <div><strong>Sub-category:</strong> {p.brand.collection.sub_category}</div>
                </div>
              ) : "N/A"}
            </td>

            {/* Colors */}
            <td className="border px-2 py-1">
              {p.colors.length > 0 ? (
                <table className="w-full border border-gray-200 text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-1">Name</th>
                      <th className="border px-1">Hex</th>
                      <th className="border px-1">Images</th>
                      <th className="border px-1">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.colors.map((c, i) => (
                      <tr key={i}>
                        <td className="border px-1">{c.name}</td>
                        <td className="border px-1">
                          <div className="w-5 h-5" style={{ backgroundColor: c.hex }}></div>
                        </td>
                        <td className="border px-1 flex gap-1">
                          {c.images.map((img, idx) => (
                            <img key={idx} src={img} className="w-10 h-10 object-cover" />
                          ))}
                        </td>
                        <td className="border px-1">
                          {c.stock.map((s, idx) => (
                            <div key={idx}>Size: {s.size}, Qty: {s.quantity}</div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : "No colors"}
            </td>

            {/* Featured Image */}
            <td className="border px-2 py-1">
              {p.featuredImage ? (
                <img src={p.featuredImage} className="w-20 h-12 object-cover" />
              ) : "No Image"}
            </td>

            {/* Actions */}
            <td className="border px-2 py-1 flex gap-2">
              <button
                className="bg-yellow-400 px-3 py-1 rounded"
                onClick={() => { setEditData(p); setShowModal(true); }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}