"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchOrders = async (page = 1, limit = 15) => {
  const res = await fetch(`/api/orders/my?page=${page}&limit=${limit}`, {
    credentials: "include",
  });
  return res.json();
};

export default function MyOrders() {
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["myOrders", page],
    queryFn: () => fetchOrders(page, limit),
    keepPreviousData: true,
  });

  const orders = data?.orders || [];
  const totalOrders = data?.totalOrders || 0;
  const totalPages = Math.ceil(totalOrders / limit);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  if (isLoading)
    return (
      <p className="text-center mt-24 text-gray-500 text-lg">
        Loading your orders...
      </p>
    );
  if (isError)
    return (
      <p className="text-center mt-24 text-red-500 text-lg">
        Failed to fetch orders.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-16 p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-green-700 text-center md:text-left">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">
          You haven't placed any orders yet.
        </p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-2xl p-4 md:p-6 border border-green-100 space-y-4 hover:shadow-xl transition"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <p className="font-semibold text-gray-700">
                <span className="text-gray-500">Order ID:</span> {order._id}
              </p>
              <p className="font-semibold text-gray-700">
                <span className="text-gray-500">Date:</span>{" "}
                {formatDateTime(order.createdAt)}
              </p>
              <p className="font-semibold text-gray-700">
                <span className="text-gray-500">Status:</span>{" "}
                <span
                  className={`${
                    order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  } font-bold`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </p>
              <p className="font-semibold text-gray-700">
                <span className="text-gray-500">Total:</span> Rs {order.total}
              </p>
            </div>

            {/* Products */}
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition"
                >
                  {/* Image */}
                  <div className="w-full sm:w-24 flex-shrink-0">
                    <img
                      src={
                        item.image
                          ? item.image.startsWith("http")
                            ? item.image
                            : `${window.location.origin}${item.image}`
                          : item.product?.images?.[0]
                          ? `${window.location.origin}${item.product.images[0]}`
                          : "/placeholder.png"
                      }
                      alt={item.name}
                      className="w-full h-32 sm:h-24 object-cover rounded-xl border"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full">
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <p>
                        Color: <span className="font-medium text-gray-800">{item.color || "N/A"}</span>
                      </p>
                      <p>
                        Size: <span className="font-medium text-gray-800">{item.size || "N/A"}</span>
                      </p>
                      <p>
                        Quantity: <span className="font-medium text-gray-800">{item.quantity}</span>
                      </p>
                      <p>
                        Price: <span className="font-bold text-green-600">Rs {item.price}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
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