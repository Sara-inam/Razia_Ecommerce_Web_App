"use client";

export default function CollectionTable({ collections, setDeleteId, setEditData }) {
  if (collections.length === 0) {
    return <p className="text-center my-6 text-gray-500 italic">No collections found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">Name</th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">Category</th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">Sub Category</th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((col) => (
            <tr
              key={col._id}
              className="border-b hover:bg-green-50 transition duration-200"
            >
              <td className="px-6 py-4 text-gray-800 font-medium">{col.collection_name}</td>
              <td className="px-6 py-4 text-gray-600">{col.category}</td>
              <td className="px-6 py-4 text-gray-600">{col.sub_category}</td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => setEditData(col)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:brightness-110 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(col._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:brightness-110 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}