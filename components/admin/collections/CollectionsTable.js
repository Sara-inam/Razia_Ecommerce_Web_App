"use client";

export default function CollectionTable({ collections, setDeleteId, setEditData }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th>Name</th>
          <th>Category</th>
          <th>Sub Category</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {collections.map((col) => (
          <tr key={col._id} className="border">
            <td>{col.collection_name}</td>
            <td>{col.category}</td>
            <td>{col.sub_category}</td>
            <td className="flex gap-2">

              {/* ✅ EDIT BUTTON */}
              <button
                onClick={() => setEditData(col)}
                className="bg-yellow-400 px-3 py-1"
              >
                Edit
              </button>

              {/* ✅ DELETE BUTTON */}
              <button
                onClick={() => setDeleteId(col._id)}
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