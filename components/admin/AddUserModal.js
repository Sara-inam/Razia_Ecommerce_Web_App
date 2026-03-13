"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddUserModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // success or error

  const queryClient = useQueryClient();

  // ✅ TanStack mutation for adding user
  const addUserMutation = useMutation({
    mutationFn: async ({ name, email, password, role }) => {
      const res = await fetch("/api/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add user");
      return data.user;
    },
    onSuccess: (user) => {
      // Optional: invalidate users query if you have a users list query
      queryClient.invalidateQueries(["users"]);
      
      // Call parent onAdd
      onAdd?.(user);

      // Clear form
      setName(""); setEmail(""); setPassword(""); setRole("user");

      // Show success message briefly
      setMessage({ type: "success", text: "User added successfully!" });

      // Auto-close modal after 1.2s
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1200);
    },
    onError: (err) => {
      setMessage({ type: "error", text: err.message });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    addUserMutation.mutate({ name, email, password, role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-slideIn border border-gray-100 transition-transform transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Add New User</h2>

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
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
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
              disabled={addUserMutation.isLoading}
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-md disabled:opacity-50"
            >
              {addUserMutation.isLoading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}