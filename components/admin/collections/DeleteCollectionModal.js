"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DeleteCollectionModal({ id, onClose }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (collectionId) => {
      const res = await fetch(`/api/admin/collections/${collectionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete collection");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      onClose();
    },
    onError: (err) => {
      console.error(err);
      alert("Something went wrong while deleting.");
    },
  });

  if (!id) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white w-[400px] p-6 rounded-2xl shadow-xl flex flex-col animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Delete Collection
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Are you sure you want to delete this collection? This action cannot be undone.
        </p>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => mutation.mutate(id)}
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