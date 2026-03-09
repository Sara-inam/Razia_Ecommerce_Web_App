"use client";

export default function BrandsTable({ brands, setDeleteId, setEditData }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th>Brand Name</th>
          <th>Description</th>
          <th>Collection Name</th> {/* ✅ New Column */}
          <th>Category</th> {/* ✅ New Column */}
          <th>Sub Category</th> {/* ✅ New Column */}
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {brands.map((b) => (
          <tr key={b._id} className="border">
            <td>{b.brand_name}</td>
            <td>{b.description}</td>
            <td>{b.collection?.collection_name || "N/A"}</td> {/* ✅ Show collection name */}
            <td>{b.collection?.category}</td>
  <td>{b.collection?.sub_category}</td>
            <td>
              <img
                src={b.image}
                alt={b.brand_name}
                className="w-20 h-12 object-cover"
              />
            </td>
            <td className="flex gap-2">
              <button
                onClick={() => setEditData(b)}
                className="bg-yellow-400 px-3 py-1"
              >
                Edit
              </button>

              <button
                onClick={() => setDeleteId(b._id)}
                className="bg-red-500 text-white px-3 py-1"
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