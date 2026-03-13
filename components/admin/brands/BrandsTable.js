"use client";

export default function BrandsTable({ brands = [], setDeleteId, setEditData }) {
  if (!Array.isArray(brands) || brands.length === 0) {
    return <p className="text-center my-6 text-gray-500 italic">No brands found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">
              Brand Name
            </th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">
              Collection Name
            </th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">
              Sub Category
            </th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left uppercase text-sm font-medium tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {brands.map((b) => (
            <tr
              key={b._id}
              className="border-b hover:bg-green-50 transition duration-200"
            >
              <td className="px-6 py-4 text-gray-800 font-medium">{b.brand_name}</td>
              <td className="px-6 py-4 text-gray-600">{b.description}</td>
              <td className="px-6 py-4 text-gray-600">
                {b.collection?.collection_name || "N/A"}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {b.collection?.category || "N/A"}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {b.collection?.sub_category || "N/A"}
              </td>
              <td className="px-6 py-4">
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.brand_name}
                    className="w-24 h-16 object-cover rounded-md shadow-sm"
                  />
                ) : (
                  <span className="text-gray-400 italic">No Image</span>
                )}
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => setEditData(b)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:brightness-110 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(b._id)}
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