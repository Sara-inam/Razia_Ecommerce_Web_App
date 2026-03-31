"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Header({ onLoginClick, onSignUpClick }) {

  const makeSlug = (text = "") =>
    text.toLowerCase().trim().replace(/\s+/g, "-");

  const { cart } = useCart();
  const queryClient = useQueryClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState({});
  const [search, setSearch] = useState("");

  const navItems = ["Home", "About", "Categories", "Contact"];

  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return { loggedIn: false };
      const data = await res.json();
      if (!data.loggedIn) {
        const refresh = await fetch("/api/auth/refresh-token", { credentials: "include" });
        if (refresh.ok) {
          const newRes = await fetch("/api/auth/me", { credentials: "include" });
          return newRes.json();
        }
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const isLoggedIn = data?.loggedIn || false;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      window.location.href = "/";
    },
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      return res.json();
    },
  });

  // ✅ CATEGORY BASED GROUPING
  const groupedCategories = collections.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    if (
      item.sub_category &&
      !acc[item.category].includes(item.sub_category)
    ) {
      acc[item.category].push(item.sub_category);
    }

    return acc;
  }, {});

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;
    window.location.href = `/search?q=${search}`;
  };

  const toggleMobileCollection = (key) => {
    setMobileCollectionsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4 relative">

          {/* LOGO */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-green-700 tracking-wide">MyStore</h1>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-6 font-medium justify-center flex-1">
            {navItems.map((item) => (
              <div key={item} className="relative group">
                {item !== "Categories" ? (
                  <Link
                    href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className="relative px-3 py-1 rounded-md"
                  >
                    <span className="text-gray-700 hover:text-green-700">
                      {item}
                    </span>
                  </Link>
                ) : (
                  <div className="relative group">
                    <span className="cursor-pointer text-gray-700 hover:text-green-700 px-3 py-1">
                      Categories
                    </span>

                    {/* ✅ CATEGORY DROPDOWN */}
                    <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white shadow-xl rounded-lg z-50">
                      <div className="flex flex-col py-2 min-w-[180px]">

                        {Object.keys(groupedCategories).map((cat) => (
                          <div key={cat} className="relative group">

                            {/* CATEGORY */}
                            <span className="px-4 py-2 block hover:bg-green-50 cursor-pointer">
                              {cat}
                            </span>

                            {/* SUBCATEGORY */}
                            <div className="absolute left-full top-0 bg-white shadow-md hidden group-hover:block min-w-[180px]">
                              {groupedCategories[cat].map((sub) => (
                                <Link
                                  key={sub}
                                  href={`/products/${makeSlug(cat)}?sub_category=${makeSlug(sub)}`}
                                  className="block px-4 py-2 hover:bg-green-50"
                                >
                                  {sub}
                                </Link>
                              ))}
                            </div>

                          </div>
                        ))}

                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-3 md:space-x-6 ml-auto">

            {/* SEARCH */}
            <div className="hidden md:flex items-center relative">
              <form onSubmit={handleSearch}
                className={`flex items-center border rounded-lg overflow-hidden bg-white ${searchOpen ? "w-64" : "w-0 opacity-0 pointer-events-none"}`}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-3 py-1.5 outline-none text-sm w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              <button onClick={() => setSearchOpen(!searchOpen)}>
                <FaSearch />
              </button>
            </div>

            {/* LOGIN */}
            {isLoggedIn ? (
              <button onClick={() => logoutMutation.mutate()} className="hidden md:block px-3 py-1 bg-red-600 text-white rounded-md">
                Logout
              </button>
            ) : (
              <>
                <button onClick={onLoginClick} className="hidden md:block px-3 py-1 border border-green-600 text-green-700 rounded-md">
                  Login
                </button>
                <button onClick={onSignUpClick} className="hidden md:block px-3 py-1 bg-green-600 text-white rounded-md">
                  SignUp
                </button>
              </>
            )}

            {/* CART */}
            <Link href="/cart" className="relative">
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* MOBILE TOGGLE */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg px-4 py-3 flex flex-col space-y-2">

            {/* SEARCH */}
            <form onSubmit={handleSearch} className="flex border rounded-lg">
              <input
                type="text"
                className="w-full px-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button><FaSearch /></button>
            </form>

            {/* LINKS */}
            {navItems.filter(i => i !== "Categories").map(item => (
              <Link key={item} href={`/${item === "Home" ? "" : item.toLowerCase()}`}>
                {item}
              </Link>
            ))}

            {/* MOBILE CATEGORIES */}
            <button onClick={() => toggleMobileCollection("root")}>
              Categories
            </button>

            {mobileCollectionsOpen.root && (
              <div>
                {Object.keys(groupedCategories).map((cat) => (
                  <div key={cat}>
                    <button onClick={() => toggleMobileCollection(cat)}>
                      {cat}
                    </button>

                    {mobileCollectionsOpen[cat] && (
                      <div>
                        {groupedCategories[cat].map((sub) => (
                          <Link
                            key={sub}
                            href={`/products/${makeSlug(cat)}?sub_category=${makeSlug(sub)}`}
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

         
    

            {/* LOGIN / SIGNUP MOBILE */}
            {!isLoggedIn ? (
              <div className="flex flex-col space-y-2 mt-2">
                <button onClick={onLoginClick} className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
                  Login
                </button>
                <button onClick={onSignUpClick} className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
                  SignUp
                </button>
              </div>
            ) : (
              <button onClick={() => logoutMutation.mutate()} className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition mt-2">
                Logout
              </button>
            )}

          </div>
        )}
      </div>
    </header>
  );
}