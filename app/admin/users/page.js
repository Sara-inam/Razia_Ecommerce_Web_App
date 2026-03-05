"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import AddUserModal from "@/components/admin/AddUserModal"; 
import EditUserModal from "@/components/admin/EditUserModal"; // import your edit modal

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Delete Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Add User Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit User Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Fetch users
  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${pageNumber}&limit=${limit}`, {
        credentials: "include",
        headers: { "Cache-Control": "no-store" },
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch {
        setError("Unexpected server response");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(data.message || "Failed to fetch users");

      const sortedUsers = data.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUsers(sortedUsers);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(page); }, [page]);

  // Delete handlers
  const openDeleteModal = (user) => { setUserToDelete(user); setIsModalOpen(true); };
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users/delete_user/${userToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch {
        console.error("Response not JSON:", text);
        setIsModalOpen(false);
        setUserToDelete(null);
        return;
      }
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      setUsers((prev) => {
        const updatedUsers = prev.filter((u) => u._id !== userToDelete._id);
        if (updatedUsers.length === 0 && page > 1) setPage((prevPage) => prevPage - 1);
        return updatedUsers;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };
  const cancelDelete = () => { setIsModalOpen(false); setUserToDelete(null); };

  // Add User Modal handlers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const handleUserAdded = (newUser) => setUsers((prev) => [newUser, ...prev]);

  // Edit User Modal handlers
  const openEditModal = (user) => { setUserToEdit(user); setIsEditModalOpen(true); };
  const closeEditModal = () => { setUserToEdit(null); setIsEditModalOpen(false); };
  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
  };

  // Loading / Error
  if (loading) return <div className="p-6 text-gray-500 text-center">Loading users...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add User
        </button>
      </div>

      {/* Table */}
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
                    <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                      {initials}
                    </div>
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40">Prev</button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}
          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40">Next</button>
      </div>

      {/* Modals */}
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
        onAdd={handleUserAdded}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        user={userToEdit}
        onUpdate={handleUserUpdated}
      />
    </div>
  );
}