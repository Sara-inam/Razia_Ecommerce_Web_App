"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 15;

  // Fetch messages with pagination
  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/messages?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    keepPreviousData: true,
  });

  // Mutation to mark message as seen
  const seenMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/admin/messages/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to update seen status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Loading messages...</div>;

  if (error)
    return <div className="p-6 text-center text-red-500">Error loading messages</div>;

  const messages = data?.messages || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Messages</h1>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Seen</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {messages.map((msg, index) => (
                <tr key={msg._id} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4">{(page - 1) * limit + index + 1}</td>
                  <td className="px-6 py-4 font-semibold">{msg.name}</td>
                  <td className="px-6 py-4 text-gray-600">{msg.email}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{msg.message}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={msg.isRead}
                      onChange={() => seenMutation.mutate(msg._id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/notifications?email=${msg.email}&name=${msg.name}`
                        )
                      }
                      className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-green-700 transition"
                    >
                      Send Notification
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {messages.length === 0 && (
          <div className="p-6 text-center text-gray-500">No messages found</div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 bg-gray-100 rounded font-medium">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}