"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [editId, setEditId] = useState(null);

  const queryClient = useQueryClient();
  const params = useSearchParams();

  const emailParam = params.get("email");
  const nameParam = params.get("name");

  // ✅ Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: async () => (await fetch("/api/admin/notifications")).json(),
  });
  const notifications = notificationsData || [];

  // ✅ Fetch users
  const { data: usersData } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => (await fetch("/api/admin/users")).json(),
  });
  const users = usersData?.users || [];

  // ✅ Auto select user from email
  useEffect(() => {
    if (emailParam && users.length > 0) {
      const foundUser = users.find((u) => u.email === emailParam);
      if (foundUser) {
        setUserId(foundUser._id);
      }
    }
  }, [emailParam, users]);

  // ✅ Auto fill title
  useEffect(() => {
    if (nameParam) {
      setTitle(`Hello ${nameParam}`);
    }
  }, [nameParam]);

  // ✅ Create / Update
  const saveMutation = useMutation({
    mutationFn: async (notif) => {
      const url = editId
        ? "/api/admin/notifications/update"
        : "/api/admin/notifications/create";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notif),
      });

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminNotifications"]);
      setTitle("");
      setMessage("");
      setUserId("");
      setEditId(null);
    },
  });

  // ✅ Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/admin/notifications/delete", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminNotifications"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      id: editId,
      title,
      message,
      userId: userId || null,
    });
  };

  const handleEdit = (notif) => {
    setEditId(notif._id);
    setTitle(notif.title);
    setMessage(notif.message);
    setUserId(notif.userId || "");
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Notifications
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-2xl shadow space-y-4"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Message"
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg"
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
          {editId ? "Update Notification" : "Send Notification"}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="grid grid-cols-5 gap-2 p-4 font-semibold bg-gray-100 text-gray-700">
          <div>Title</div>
          <div>Message</div>
          <div>User</div>
          <div>Date</div>
          <div>Actions</div>
        </div>

        {notifications.map((n) => (
          <div
            key={n._id}
            className="grid grid-cols-5 gap-2 p-4 border-t items-center hover:bg-gray-50"
          >
            <div className="font-medium">{n.title}</div>
            <div className="truncate">{n.message}</div>
            <div>
              {n.userId
                ? users.find((u) => u._id === n.userId)?.name || "User"
                : "All Users"}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </div>

            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                onClick={() => handleEdit(n)}
              >
                Edit
              </button>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                onClick={() => handleDelete(n._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
}