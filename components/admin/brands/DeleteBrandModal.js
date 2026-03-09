"use client";

export default function DeleteBrandModal({ id, onClose, refresh }) {
  const handleDelete = async () => {
  const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });

  if (!res.ok) {
    alert("Delete failed");
    return;
  }

  refresh();
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="mb-4 font-bold">Delete this Brand?</h2>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}