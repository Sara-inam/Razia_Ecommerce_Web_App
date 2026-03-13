"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, deleteId }) {
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  // ✅ TanStack mutation if deleteId is provided
  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/users/delete_user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // refresh users
      onCancel();
    },
    onError: (err) => {
      console.error(err);
      alert("Something went wrong");
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      mutation.mutate(deleteId);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white w-[400px] p-6 rounded-2xl shadow-xl flex flex-col animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">{title}</h2>
        <p className="text-gray-600 mb-6 text-center">{message}</p>

        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={mutation.isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {mutation.isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}