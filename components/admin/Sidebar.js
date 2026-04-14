"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaBoxOpen,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaLayerGroup,
  FaTags,
  FaShoppingCart,
  FaBell,
  FaEnvelope,
  FaImages
} from "react-icons/fa";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext"; // ✅ import AuthContext

// Fetch admin info
const fetchAdmin = async () => {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch admin info");
  return res.json();
};

// Refresh token
const refreshToken = async () => {
  const res = await fetch("/api/auth/refresh-token", { credentials: "include" });
  if (!res.ok) throw new Error("Token refresh failed");
  return res.json();
};

// Logout API
const logoutFn = async () => {
  const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
};

export default function Sidebar() {
  const { logout } = useAuth(); // ✅ get logout from AuthContext
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const navItems = [
  { name: "Dashboard", icon: <FaHome />, link: "/admin" },
  { name: "Collections", icon: <FaLayerGroup />, link: "/admin/collections" },
  { name: "Brands", icon: <FaTags />, link: "/admin/brands" },
  { name: "Products", icon: <FaBoxOpen />, link: "/admin/products" },
  { name: "Orders", icon: <FaShoppingCart />, link: "/admin/orders" },
  { name: "Users", icon: <FaUsers />, link: "/admin/users" },
  { name: "Notifications", icon: <FaBell />, link: "/admin/notifications" },
  { name: "Contact Messages", icon: <FaEnvelope />, link: "/admin/messages" },
  { name: "Home Slider", icon: <FaImages />, link: "/admin/slider" },
];

  // Fetch admin info
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminInfo"],
    queryFn: fetchAdmin,
    retry: 1,
    onError: async () => {
      try {
        await refreshToken();
        refetch();
      } catch {
        router.push("/"); // redirect if refresh fails
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      logout(); // ✅ now works
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      queryClient.clear();
      router.push("/"); // redirect after logout
    },
    onError: (err) => console.error(err),
  });

  const isAdmin = data?.loggedIn && data.user?.role === "admin";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-green-700 to-green-800 text-white shadow-lg flex-col justify-between">
        <div>
          <div className="p-6 font-bold text-2xl border-b border-green-600 text-center">
            Admin Panel
          </div>

          {!isLoading && !isAdmin && (
            <div className="p-4 text-center text-yellow-200 font-semibold">
              Not authorized
            </div>
          )}

          <nav className="mt-6 flex flex-col">
            {navItems.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  className={`flex items-center gap-4 px-6 py-3 rounded-r-lg mb-1 transition-all duration-300 ${
                    isActive ? "bg-green-900 font-semibold" : "hover:bg-green-600"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        {isAdmin && (
          <div className="p-6">
            <button
              onClick={() => logoutMutation.mutate()}
              className="flex items-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-green-700 text-white shadow-md z-50">
        <div className="flex justify-between items-center p-4">
          <h1 className="font-bold text-lg">Admin Panel</h1>
          <button onClick={() => setOpen(!open)}>
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {open && (
          <nav className="flex flex-col border-t border-green-600 bg-green-800">
            {navItems.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3 transition-all ${
                    isActive ? "bg-green-900 font-semibold" : "hover:bg-green-600"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}

            {isAdmin && (
              <button
                onClick={() => {
                  logoutMutation.mutate();
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-6 py-3 mt-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            )}
          </nav>
        )}
      </div>
    </>
  );
}