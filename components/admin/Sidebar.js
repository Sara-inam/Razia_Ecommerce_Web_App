"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaBox, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <FaHome />, link: "/admin" },
      { name: "Collections", icon: <FaBox />, link: "/admin/collections" },
       { name: "Brands", icon: <FaBox />, link: "/admin/brands" },
    { name: "Products", icon: <FaBox />, link: "/admin/products" },
    { name: "Users", icon: <FaUser />, link: "/admin/users" },
   
    // Add more admin pages here
  ];

  // ✅ Check login & admin role
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn && data.user.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/"); // Redirect non-admins
        }
      } catch (err) {
        router.push("/"); // Redirect if error
      }
    };
    checkAdmin();
  }, [router]);

  // ✅ Optional: Refresh access token on mount
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        await fetch("/api/auth/refresh-token", { credentials: "include" });
      } catch {
        handleLogout(); // Force logout if refresh fails
      }
    };
    refreshAccessToken();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setIsAdmin(false);
        router.push("/"); // redirect to homepage
      } else {
        console.error(data.message || "Logout failed");
      }
    } catch (err) {
      console.error("Something went wrong during logout", err);
    }
  };

  if (!isAdmin) return null; // Prevent render for non-admin

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-green-700 to-green-800 text-white shadow-lg flex-col justify-between">
        <div>
          <div className="p-6 font-bold text-2xl border-b border-green-600 text-center">
            Admin Panel
          </div>

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
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
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

            {/* Logout Button */}
            <button
              onClick={() => { handleLogout(); setOpen(false); }}
              className="flex items-center gap-2 px-6 py-3 mt-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </nav>
        )}
      </div>
    </>
  );
}