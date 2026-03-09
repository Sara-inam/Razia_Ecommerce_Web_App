"use client";

export default function BrandsTable({ brands, setDeleteId, setEditData }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1 text-left">Brand Name</th>
          <th className="border px-2 py-1 text-left">Description</th>
          <th className="border px-2 py-1 text-left">Collection Name</th>
          <th className="border px-2 py-1 text-left">Category</th>
          <th className="border px-2 py-1 text-left">Sub Category</th>
          <th className="border px-2 py-1 text-left">Image</th>
          <th className="border px-2 py-1 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {brands.length === 0 && (
          <tr>
            <td colSpan={7} className="text-center py-4">
              No brands found
            </td>
          </tr>
        )}

        {brands.map((b) => (
          <tr key={b._id} className="border hover:bg-gray-50">
            <td className="border px-2 py-1">{b.brand_name}</td>
            <td className="border px-2 py-1">{b.description}</td>
            <td className="border px-2 py-1">
              {b.collection?.collection_name || "N/A"}
            </td>
            <td className="border px-2 py-1">{b.collection?.category || "N/A"}</td>
            <td className="border px-2 py-1">
              {b.collection?.sub_category || "N/A"}
            </td>
            <td className="border px-2 py-1">
              {b.image ? (
                <img
                  src={b.image}
                  alt={b.brand_name}
                  className="w-20 h-12 object-cover"
                />
              ) : (
                "No Image"
              )}
            </td>
            <td className="border px-2 py-1 flex gap-2">
              <button
                onClick={() => setEditData(b)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => setDeleteId(b._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
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