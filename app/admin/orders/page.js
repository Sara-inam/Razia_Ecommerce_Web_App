"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchOrders = async (page = 1) => {
  const res = await fetch(`/api/admin/orders?page=${page}&limit=15`);
  return res.json();
};

export default function AdminDashboard() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminOrders", page],
    queryFn: () => fetchOrders(page),
    keepPreviousData: true,
  });

  const orders = data?.orders || [];
  const totalOrders = data?.totalOrders || 0;
  const totalPages = Math.ceil(totalOrders / 15);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const updateStatus = async (id, status) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refetch();
  };

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to fetch orders.</p>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center md:text-left">
        📦 Orders Dashboard
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white shadow-lg rounded-2xl border p-4 md:p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 md:gap-0">
            <div className="space-y-1 text-gray-700 text-sm md:text-base">
              <p>Customer: <strong>{order.customer.name}</strong></p>
              <p>Phone: <strong>{order.customer.phone}</strong></p>
              <p>Tracking ID: <strong>{order.trackingId}</strong></p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 mt-2 md:mt-0">
              <p className="font-semibold text-blue-600 text-sm md:text-base">Cash on Delivery</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border rounded px-2 py-1 text-xs md:text-sm outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <p className="font-bold text-gray-800 text-sm md:text-base">Total: Rs {order.total}</p>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-2 py-1">
                      {item.image || item.product?.images?.[0] ? (
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `${window.location.origin}${item.image || item.product.images[0]}`
                          }
                          alt={item.name || "Product image"}
                          className="w-16 h-16 object-cover rounded-xl border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.color || "N/A"}</td>
                    <td>{item.size || "N/A"}</td>
                    <td>{item.quantity}</td>
                    <td className="font-semibold text-green-600">Rs {item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Prev
        </button>
        <span className="px-4 py-2 bg-gray-100 rounded font-medium">{page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}