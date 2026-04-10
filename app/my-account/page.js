"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera } from "react-icons/fa";

export default function MyAccount() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ phone: "", address: "", image: null });
  const [isSaved, setIsSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        phone: data.phone || "",
        address: data.address || "",
        image: null,
      });
      setIsSaved(Boolean(data.phone || data.address));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (form.image) formData.append("image", form.image);

      const res = await fetch("/api/user/update", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myProfile"]);
      toast.success("Profile Updated ✅", { position: "top-right", autoClose: 2000 });
      setForm(prev => ({ ...prev, image: null }));
      setIsSaved(true);
    },
    onError: () => {
      toast.error("Failed to update profile ❌", { position: "top-right", autoClose: 3000 });
    },
  });

  if (isLoading)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  const avatar = form.image ? URL.createObjectURL(form.image) : data?.profileImage || null;
  const initials = data?.name ? data.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="max-w-4xl mx-auto mt-16 p-4 sm:p-6">
      <ToastContainer />
      <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 border border-green-100 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        
        {/* Avatar Section */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-green-400 to-green-600 overflow-hidden flex items-center justify-center text-4xl sm:text-5xl font-bold text-white uppercase shadow-lg cursor-pointer group flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="select-none">{initials}</span>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <FaCamera className="text-white text-xl sm:text-2xl" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={e => setForm({ ...form, image: e.target.files[0] })}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Details Section */}
        <div className="flex-1 w-full">
          {/* Name & Email */}
          <div className="mb-4 sm:mb-6 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-green-700">{data?.name}</h1>
            <p className="text-gray-500 text-sm sm:text-base">{data?.email}</p>
          </div>

          {/* Editable fields */}
          <div className="grid gap-3 sm:gap-4 mb-4 sm:mb-6">
            <input
              type="text"
              value={form.phone}
              placeholder="Phone"
              className="border p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition shadow-sm w-full"
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="text"
              value={form.address}
              placeholder="Address"
              className="border p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition shadow-sm w-full"
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {/* Save / Update Button */}
          <button
            onClick={() => mutation.mutate()}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-shadow shadow-md hover:shadow-lg"
          >
            {isSaved ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}