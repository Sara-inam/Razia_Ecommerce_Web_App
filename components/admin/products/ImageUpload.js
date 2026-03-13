import { useMutation } from "@tanstack/react-query";

export default function ImageUpload({ image, onChange }) {
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const reader = new FileReader();

      const fileDataUrl = await new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject("Failed to read file");
      });

      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: fileDataUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.message || "Upload failed");
      }

      return data.url;
    },
    onSuccess: (url) => onChange(url),
  });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadMutation.mutate(file);
  };

  return (
    <div className="mb-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploadMutation.isLoading}
      />
      {uploadMutation.isLoading && <p className="text-gray-500">Uploading...</p>}
      {uploadMutation.isError && (
        <p className="text-red-500">Upload failed. Try again.</p>
      )}
      {image && !uploadMutation.isLoading && (
        <img src={image} className="w-32 h-20 object-cover mt-2" />
      )}
    </div>
  );
}