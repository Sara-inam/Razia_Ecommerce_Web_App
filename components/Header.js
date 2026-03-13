"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Header({ onLoginClick, onSignUpClick }) {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const navItems = ["Home", "About", "Contact", "Products"];
  const productSubmenu = [
    { name: "Clothes", link: "/products/clothes" },
    { name: "Bags", link: "/products/bags" },
    { name: "Makeup", link: "/products/makeup" },
  ];

  // ✅ TanStack Auth Query (replaces useEffect)
  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) return { loggedIn: false };

      const data = await res.json();

      // If not logged in, try refresh
      if (!data.loggedIn) {
        const refreshRes = await fetch("/api/auth/refresh-token", {
          credentials: "include",
        });

        if (refreshRes.ok) {
          const newRes = await fetch("/api/auth/me", {
            credentials: "include",
          });
          return newRes.json();
        }
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const isLoggedIn = data?.loggedIn || false;

  // ✅ Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      window.location.href = "/";
    },
  });

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/30 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 tracking-wide">
          My Store
        </h1>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-4 md:space-x-6 text-green-700 font-medium">
          {navItems.map((item) => (
            <div key={item} className="relative group">
              <Link
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="px-1"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-700 transition-all group-hover:w-full"></span>
              </Link>

              {item === "Products" && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible
                                transition-all duration-300 ease-in-out transform -translate-y-2 group-hover:translate-y-0 z-50">
                  {productSubmenu.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.link}
                      className="block px-4 py-2 text-green-700 hover:bg-green-100 hover:text-green-900 rounded-md transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="border-l border-green-200 h-6 mx-2"></div>

          {/* Conditional Buttons */}
          {isLoggedIn ? (
            <button
              onClick={() => logoutMutation.mutate()}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="px-3 py-1.5 bg-white/30 text-green-700 font-semibold rounded-md hover:bg-green-700 hover:text-white transition"
              >
                Login
              </button>
              <button
                onClick={onSignUpClick}
                className="px-3 py-1.5 bg-green-600 text-white rounded-md"
              >
                SignUp
              </button>
            </>
          )}

          <Link href="/cart" className="relative flex items-center ml-3">
            <FaShoppingCart className="text-xl md:text-2xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full px-2 py-0.5 animate-pulse">
                {cart.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center space-x-3">
          <Link href="/cart" className="relative flex items-center">
            <FaShoppingCart className="text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 animate-pulse">
                {cart.length}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => logoutMutation.mutate()}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-3 py-1.5 bg-white/30 text-green-700 font-semibold rounded-md hover:bg-green-700 hover:text-white transition"
            >
              Login
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-green-700 text-2xl focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile menu remains EXACTLY SAME */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md w-full absolute top-full left-0 shadow-lg">
          <nav className="flex flex-col items-center py-4 space-y-3 text-green-700 font-medium">
            {navItems.map((item) => (
              <div key={item} className="w-full text-center">
                <Link
                  href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                  className="px-3 py-2 rounded-md hover:bg-green-100 w-full block"
                  onClick={() => item !== "Products" && setMenuOpen(false)}
                >
                  {item}
                </Link>

                {item === "Products" && (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setProductsSubmenuOpen(!productsSubmenuOpen)}
                      className="text-green-700 font-semibold mt-1 mb-2"
                    >
                      {productsSubmenuOpen ? "▲" : "▼"}
                    </button>

                    {productsSubmenuOpen && (
                      <div className="flex flex-col space-y-1 mb-2">
                        {productSubmenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.link}
                            className="px-3 py-2 rounded-md hover:bg-green-100 w-full block"
                            onClick={() => setMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex space-x-2 mt-2">
              {isLoggedIn ? (
                <button
                  onClick={() => { logoutMutation.mutate(); setMenuOpen(false); }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { onLoginClick(); setMenuOpen(false); }}
                    className="px-3 py-1.5 bg-white/30 text-green-700 font-semibold rounded-md hover:bg-green-700 hover:text-white transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { onSignUpClick(); setMenuOpen(false); }}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md"
                  >
                    SignUp
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}