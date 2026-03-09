"use client";

export default function ImageUpload({ image, onChange }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reader.result }),
      });
      const data = await res.json();
      onChange(data.url);
    };
  };

  return (
    <div className="mb-2">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {image && <img src={image} className="w-32 h-20 object-cover mt-2" />}
    </div>
  );
}