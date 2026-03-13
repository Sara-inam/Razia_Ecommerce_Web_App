// components/admin/EditUserModal.js
"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditUserModal({ isOpen, onClose, user, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "user");
  const [message, setMessage] = useState(null);

  const queryClient = useQueryClient();

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  // ✅ TanStack mutation for updating user
  const editUserMutation = useMutation({
    mutationFn: async ({ _id, name, email, role }) => {
      const res = await fetch(`/api/admin/users/update_user/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");
      return data.user;
    },
    onMutate: (updatedUser) => {
      // Optimistic update: call parent to update UI immediately
      onUpdate?.(updatedUser);
      setMessage({ type: "success", text: "Updating user..." });
    },
    onSuccess: (updatedUser) => {
      // Invalidate users query so list auto-refreshes
      queryClient.invalidateQueries(["users"]);

      // Success message
      setMessage({ type: "success", text: "User updated successfully!" });

      // Auto-close modal
      setTimeout(() => {
        setMessage(null);
        onClose?.();
      }, 1200);
    },
    onError: (err, variables, context) => {
      // Rollback optimistic update
      onUpdate?.(user);

      setMessage({ type: "error", text: err.message });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    editUserMutation.mutate({ _id: user._id, name, email, role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-slideIn border border-gray-100 transition-transform transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Edit User</h2>

        {/* Message / Alert */}
        {message && (
          <div
            className={`mb-5 px-5 py-3 rounded-lg text-sm font-medium shadow-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition bg-white cursor-pointer"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editUserMutation.isLoading}
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-md disabled:opacity-50"
            >
              {editUserMutation.isLoading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}