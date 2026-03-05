"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading user...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        User not found
      </div>
    );

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-10 px-4">

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5">

        {/* Avatar */}
        <div className="flex flex-col items-center">

          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 text-white text-xl font-bold shadow">
            {initials}
          </div>

          <h2 className="mt-2 text-lg font-semibold text-gray-800">
            {user.name}
          </h2>

          <span
            className={`mt-1 px-3 py-0.5 text-xs rounded-full ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {user.role}
          </span>
        </div>

        {/* Info Section */}
        <div className="mt-5 space-y-2 text-sm">

          <div className="flex justify-between border-b pb-1.5">
            <span className="font-medium text-gray-500">Name</span>
            <span className="text-gray-800">{user.name}</span>
          </div>

          <div className="flex justify-between border-b pb-1.5">
            <span className="font-medium text-gray-500">Email</span>
            <span className="text-gray-800">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-500">Role</span>
            <span className="text-gray-800 capitalize">{user.role}</span>
          </div>

        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Back to Users
        </button>

      </div>
    </div>
  );
}