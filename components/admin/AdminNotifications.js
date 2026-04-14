"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [editId, setEditId] = useState(null);

  // TOAST
  const [toast, setToast] = useState(null);

  // CONFIRM MODAL STATE
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const queryClient = useQueryClient();
  const params = useSearchParams();

  const emailParam = params.get("email");
  const nameParam = params.get("name");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // FETCH NOTIFICATIONS
  const { data: notificationsData } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: async () =>
      (await fetch("/api/admin/notifications")).json(),
  });

  const notifications = notificationsData || [];

  // FETCH USERS
  const { data: usersData } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => (await fetch("/api/admin/users")).json(),
  });

  const users = usersData?.users || [];

  // AUTO SELECT USER
  useEffect(() => {
    if (emailParam && users.length > 0) {
      const foundUser = users.find((u) => u.email === emailParam);
      if (foundUser) setUserId(foundUser._id);
    }
  }, [emailParam, users]);

  // AUTO TITLE
  useEffect(() => {
    if (nameParam) {
      setTitle(`Hello ${nameParam}`);
    }
  }, [nameParam]);

  // CREATE / UPDATE
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

      if (!res.ok) throw new Error("Failed");

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["adminNotifications"]);
      setTitle("");
      setMessage("");
      setUserId("");
      setEditId(null);
      showToast(editId ? "Updated!" : "Sent!");
    },

    onError: () => showToast("Something went wrong!", "error"),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/admin/notifications/delete", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["adminNotifications"]);
      showToast("Deleted!");
    },

    onError: () => showToast("Delete failed!", "error"),
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

  const handleEdit = (n) => {
    setEditId(n._id);
    setTitle(n.title);
    setMessage(n.message);
    setUserId(n.userId || "");
  };

  // OPEN MODAL
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteId);
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="p-6">

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-lg text-white shadow-lg z-50 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-3">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this notification?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Notifications
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-2xl shadow space-y-4"
      >
        <input
          className="w-full border px-4 py-2 rounded-lg"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border px-4 py-2 rounded-lg"
          placeholder="Message"
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

        <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
          {editId ? "Update" : "Send"}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="grid grid-cols-5 p-4 font-semibold bg-gray-100">
          <div>Title</div>
          <div>Message</div>
          <div>User</div>
          <div>Date</div>
          <div>Actions</div>
        </div>

        {notifications.map((n) => (
          <div
            key={n._id}
            className="grid grid-cols-5 p-4 border-t"
          >
            <div>{n.title}</div>
            <div className="truncate">{n.message}</div>

            <div>
              {n.userId
                ? users.find((u) => u._id === n.userId)?.name ||
                  "User"
                : "All Users"}
            </div>

            <div className="text-sm text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(n)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteClick(n._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}