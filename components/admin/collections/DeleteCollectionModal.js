"use client";

export default function DeleteCollectionModal({ id, onClose, refresh }) {

  if (!id) return null;

  const deleteCollection = async () => {
    await fetch(`/api/admin/collections/${id}`, {
      method: "DELETE",
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <h2 className="mb-4">Delete this collection?</h2>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border"
          >
            Cancel
          </button>

          <button
            onClick={deleteCollection}
            className="px-4 py-2 bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}