// app/admin/users/[id]/page.js
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ name: "", email: "", role: "user" });
  const [message, setMessage] = useState("");

  // ✅ Fetch user data with TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${id}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user");
      return data.user;
    },
    onSuccess: (user) => setFormData({ name: user.name, email: user.email, role: user.role }),
  });

  // ✅ Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await fetch(`/api/admin/users/update_user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");
      return data.user;
    },
    onSuccess: () => {
      setMessage("✅ User updated successfully");
      queryClient.invalidateQueries(["users"]); // Refresh user list if needed
      setTimeout(() => router.push("/admin/users"), 1500);
    },
    onError: (err) => {
      setMessage(err.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading user...
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error.message || "Failed to load user"}
      </div>
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 relative animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
          Edit User
        </h2>

        {message && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="User Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateUserMutation.isLoading}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {updateUserMutation.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}