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
  const [activeCollection, setActiveCollection] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState({});
  const [search, setSearch] = useState("");

  const navItems = ["Home", "About", "Collections", "Contact"];

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

  const groupedCollections = collections.reduce((acc, item) => {
    if (!acc[item.collection_name]) {
      acc[item.collection_name] = [];
    }

    if (!acc[item.collection_name].includes(item.category)) {
      acc[item.collection_name].push(item.category);
    }

    return acc;
  }, {});

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;
    window.location.href = `/search?q=${search}`;
  };

  const toggleMobileCollection = (col) => {
    setMobileCollectionsOpen((prev) => ({
      ...prev,
      [col]: !prev[col],
    }));
  };

  const collectionColors = {
    Men: "bg-blue-500 hover:bg-blue-600 text-white",
    Women: "bg-pink-500 hover:bg-pink-600 text-white",
    Kids: "bg-yellow-400 hover:bg-yellow-500 text-white",
    Accessories: "bg-purple-500 hover:bg-purple-600 text-white",
    Default: "bg-green-600 hover:bg-green-700 text-white",
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
                {item !== "Collections" ? (
                  <Link
                    href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className="relative px-3 py-1 rounded-md transition-colors duration-300"
                  >
                    <span className="text-gray-700 hover:text-green-700 font-medium transition-colors duration-300">
                      {item}
                    </span>
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ) : (
                  <div className="relative group">
                    <span className="cursor-pointer text-gray-700 hover:text-green-700 font-medium px-3 py-1 rounded-md transition-colors duration-300">
                      Collections
                      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </span>

                    {/* COLLECTION DROPDOWN */}
                    <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white shadow-2xl rounded-lg z-50 flex">
                      <div className="flex flex-col py-2 min-w-[180px]">
                        {Object.keys(groupedCollections).map((col) => (
                          <div
                            key={col}
                            onMouseEnter={() => setActiveCollection(col)}
                            onMouseLeave={() => setActiveCollection(null)}
                            className="px-5 py-2 font-medium relative cursor-pointer group flex justify-between items-center hover:bg-green-50 transition"
                          >
                            <span className={`transition-colors duration-300 ${activeCollection === col ? "text-green-700 font-semibold" : "text-gray-700"}`}>
                              {col}
                            </span>
                            <FaChevronRight
                              className={`ml-2 text-gray-500 transition-transform duration-300 ${activeCollection === col ? "rotate-90 text-green-700" : ""}`}
                              size={12}
                            />
                            {activeCollection === col && (
                              <div className="absolute top-0 left-full ml-1 flex flex-col bg-white shadow-lg rounded-md min-w-[180px] z-50 animate-slide-in">
                                {groupedCollections[col].map((cat) => (
                                  <Link
                                    key={cat}
                                    href={`/products/${makeSlug(col)}/${makeSlug(cat)}`}
                                    className="px-4 py-2 hover:bg-green-50 hover:text-green-700 block"
                                  >
                                    {cat}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center space-x-3 md:space-x-6 ml-auto">

            {/* SEARCH */}
            <div className="hidden md:flex items-center relative">
              <form
                onSubmit={handleSearch}
                className={`flex items-center border rounded-lg overflow-hidden bg-white transition-all duration-300
                  ${searchOpen ? "w-64 ml-2 opacity-100" : "w-0 opacity-0 pointer-events-none"}
                `}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-3 py-1.5 outline-none text-sm w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                className="text-gray-700 hover:text-green-700 transition ml-1"
              >
                <FaSearch size={18} />
              </button>
            </div>

            {/* LOGIN / SIGNUP DESKTOP */}
            {isLoggedIn ? (
              <button onClick={() => logoutMutation.mutate()} className="hidden md:block px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                Logout
              </button>
            ) : (
              <>
                <button onClick={onLoginClick} className="hidden md:block px-3 py-1 border border-green-600 text-green-700 rounded-md hover:bg-green-600 hover:text-white transition">
                  Login
                </button>
                <button onClick={onSignUpClick} className="hidden md:block px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                  SignUp
                </button>
              </>
            )}

            {/* CART */}
            <Link href="/cart" className="relative">
              <FaShoppingCart className="text-xl text-gray-700 hover:text-green-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-xl">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg px-4 py-3 flex flex-col space-y-2 animate-fade-in">

            {/* SEARCH MOBILE */}
            <div className="flex items-center w-full mb-2">
              <form
                onSubmit={handleSearch}
                className="flex items-center w-full border rounded-lg overflow-hidden bg-white"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-3 py-1.5 outline-none text-sm w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="px-3 text-gray-600 hover:text-green-700">
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* NAV LINKS MOBILE */}
            <div className="flex flex-col space-y-2">
              {navItems.filter(i => i !== "Collections").map(item => (
                <Link
                  key={item}
                  href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                  className="flex justify-between items-center px-4 py-2 rounded-md bg-gray-50 text-gray-800 hover:bg-green-50 transition shadow-sm"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* COLLECTIONS MOBILE */}
            {mobileCollectionsOpen.root && (
              <div className="ml-4 flex flex-col mt-2 space-y-1 animate-slide-in">
                {Object.keys(groupedCollections).map((col) => {
                  const isOpen = mobileCollectionsOpen[col];

                  return (
                    <div key={col} className="flex flex-col">

                      {/* COLLECTION */}
                      <button
                        onClick={() => toggleMobileCollection(col)}
                        className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-md"
                      >
                        <span>{col}</span>
                        <FaChevronRight
                          size={12}
                          className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                        />
                      </button>

                      {/* CATEGORY + SUBCATEGORY */}
                      {isOpen && (
                        <div className="ml-4 mt-1 flex flex-col space-y-1">
                          {groupedCollections[col].map((cat) => (
                            <Link
                              key={cat}
                              href={`/products/${makeSlug(col)}/${makeSlug(cat)}`}
                              className="ml-4 px-3 py-1 hover:bg-green-50 rounded-md block"
                            >
                              {cat}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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