"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "@/components/ConfirmModal";
import AddUserModal from "@/components/admin/AddUserModal"; 
import EditUserModal from "@/components/admin/EditUserModal";
import ModernPagination from "@/components/ModernPagination";

const fetchUsers = async (page, limit) => {
  const res = await fetch(`/api/admin/users?page=${page}&limit=${limit}`, {
    credentials: "include",
    headers: { "Cache-Control": "no-store" },
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch {
    throw new Error("Unexpected server response");
  }
  if (!res.ok) throw new Error(data.message || "Failed to fetch users");
  data.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return data;
};

export default function UsersPage() {
  const limit = 10;
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const queryClient = useQueryClient();

  // Fetch users using TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page, limit),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await fetch(`/api/admin/users/delete_user/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { return; }
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.setQueryData(["users", page], (oldData) => {
        const updatedUsers = oldData.users.filter((u) => u._id !== userId);
        return { ...oldData, users: updatedUsers };
      });
      setIsModalOpen(false);
      setUserToDelete(null);
    },
  });

  // Add mutation
  const addMutation = useMutation({
    mutationFn: async (newUser) => {
      const res = await fetch(`/api/admin/users`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add user");
      return data;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(["users", page], (oldData) => ({
        ...oldData,
        users: [newUser, ...oldData.users],
      }));
      setIsAddModalOpen(false);
    },
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async (updatedUser) => {
      const res = await fetch(`/api/admin/users/${updatedUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");
      return data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users", page], (oldData) => ({
        ...oldData,
        users: oldData.users.map((u) => u._id === updatedUser._id ? updatedUser : u),
      }));
      setIsEditModalOpen(false);
      setUserToEdit(null);
    },
  });

  // Handlers
  const openDeleteModal = (user) => { setUserToDelete(user); setIsModalOpen(true); };
  const confirmDelete = () => { if (userToDelete) deleteMutation.mutate(userToDelete._id); };
  const cancelDelete = () => { setIsModalOpen(false); setUserToDelete(null); };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (user) => { setUserToEdit(user); setIsEditModalOpen(true); };
  const closeEditModal = () => { setUserToEdit(null); setIsEditModalOpen(false); };

  if (isLoading) return <div className="p-6 text-gray-500 text-center">Loading users...</div>;
  if (isError) return <div className="p-6 text-red-500 text-center">{error.message}</div>;

  const users = data.users;
  const totalPages = data.pagination.totalPages;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <button onClick={openAddModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Add User
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase();
              return (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">{initials}</div>
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <Link href={`/admin/users/${user._id}`} className="text-blue-600 hover:underline">View</Link>
                    <button onClick={() => openEditModal(user)} className="text-green-600 hover:underline">Edit</button>
                    <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ModernPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={(user) => addMutation.mutate(user)}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        user={userToEdit}
        onUpdate={(user) => editMutation.mutate(user)}
      />
    </div>
  );
}