"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronRight,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export default function Header({ onLoginClick, onSignUpClick }) {
  const makeSlug = (text = "") =>
    text.toLowerCase().trim().replace(/\s+/g, "-");

  const { cart } = useCart();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState({});
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const showProfileIcon = isLoggedIn && user?.role !== "admin";

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsState, setNotificationsState] = useState([]);
  const notificationsStateRef = useRef([]);
  notificationsStateRef.current = notificationsState;
  // ✅ Browser notification permission
  useEffect(() => {
    if (user?.role === "admin") return;

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, [user]);

  // Fetch notifications
  const { data: notifData = [] } = useQuery({
    queryKey: ["myNotifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications/my", {
        credentials: "include",
      });
      return res.json();
    },
    enabled: !!user,
    staleTime: 1000 * 10,
    refetchInterval: 5000, // ✅ every 5 sec auto refresh
  });

  // Sync notifications safely
  useEffect(() => {
    if (!Array.isArray(notifData)) return;

    setNotificationsState((prev) => {
      const newState = [...notifData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((n) => {
          const existing = prev.find((p) => p._id === n._id);
          return {
            ...n,
            seen: existing?.seen || false,
            dismissed: existing?.dismissed || false,
          };
        });

      // 🔥 Only update if state actually changed
      const isEqual =
        prev.length === newState.length &&
        prev.every((p, i) => p._id === newState[i]._id && p.seen === newState[i].seen && p.dismissed === newState[i].dismissed);

      return isEqual ? prev : newState;
    });
  }, [notifData]);

  // Real-time notification push
  const addNotification = (notif) => {
    setNotificationsState((prev) => {
      if (prev.some((n) => n._id === notif._id)) return prev;
      return [{ ...notif, seen: false, dismissed: false }, ...prev];
    });

    // Browser push
    if (
      user?.role !== "admin" && // ❗ admin ko block karo
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(notif.title, {
        body: notif.message,
        icon: "/logo.png",
      });
    }
  };

  // Dismiss notification
  const dismissNotification = async (id) => {
    setNotificationsState((prev) =>
      prev.map((n) => (n._id === id ? { ...n, dismissed: true } : n))
    );

    await fetch("/api/notifications/dismiss", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });

    queryClient.setQueryData(["myNotifications"], (old) =>
      old?.map((n) =>
        n._id === id ? { ...n, dismissedBy: [...(n.dismissedBy || []), user.id] } : n
      ) || []
    );
  };

  // Open notifications panel
  const handleNotificationsOpen = async () => {
    setNotificationsOpen((prev) => !prev);

    if (!notificationsOpen) {
      const unseenIds = notificationsStateRef.current
        .filter((n) => !n.seen)
        .map((n) => n._id);

      setNotificationsState((prev) =>
        prev.map((n) => ({ ...n, seen: true }))
      );

      queryClient.setQueryData(["myNotifications"], (old) =>
        old?.map((n) => ({ ...n, seen: true })) || []
      );

      if (unseenIds.length > 0) {
        await fetch("/api/notifications/seen", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationIds: unseenIds }),
        });
      }
    }
  };

  // Logout mutation
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
      logout();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      window.location.href = "/";
    },
  });

  // Collections
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      return res.json();
    },
  });

  const groupedCategories = collections.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    if (item.sub_category && !acc[item.category].includes(item.sub_category)) {
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
    setMobileCollectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems = ["Home", "About", "Categories", "Contact"];
  const unreadCount = notificationsState.filter(
    (n) => !n.seen && !n.dismissed
  ).length;
  const visibleNotifications = notificationsState.filter((n) => !n.dismissed);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* HEADER CONTENT */}
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
                    className="px-3 py-1"
                  >
                    <span className="text-gray-700 hover:text-green-700">{item}</span>
                  </Link>
                ) : (
                  <div className="relative group">
                    <span className="cursor-pointer text-gray-700 hover:text-green-700 px-3 py-1">
                      Categories
                    </span>
                    <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white shadow-xl rounded-lg z-50">
                      <div className="flex flex-col py-2 min-w-[180px]">
                        {Object.keys(groupedCategories).map((cat) => (
                          <div key={cat} className="relative group">
                            <span className="px-4 py-2 block hover:bg-green-50 cursor-pointer">{cat}</span>
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
              <form
                onSubmit={handleSearch}
                className={`flex items-center border rounded-lg overflow-hidden bg-white transition-all ${searchOpen ? "w-64" : "w-0 opacity-0 pointer-events-none"
                  }`}
              >
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

            {/* PROFILE */}
            {showProfileIcon ? (
              <div className="relative">
                <button
                  onClick={() => toggleMobileCollection("profile")}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-700"
                >
                  <FaUserCircle size={24} />
                </button>
                <div
                  className={`absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 z-50 ${mobileCollectionsOpen.profile ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                >
                  <Link
                    href="/my-account"
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/my-orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="hidden md:block px-3 py-1 border border-green-600 text-green-700 rounded-md"
                >
                  Login
                </button>
                <button
                  onClick={onSignUpClick}
                  className="hidden md:block px-3 py-1 bg-green-600 text-white rounded-md"
                >
                  SignUp
                </button>
              </>
            )}

            {/* NOTIFICATIONS */}
            {isLoggedIn && (
              <div className="relative">
                <button onClick={handleNotificationsOpen} className="relative z-50">
                  <FaBell size={24} className="text-gray-700 hover:text-green-700" />
                  {unreadCount > 0 && !notificationsOpen && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* NOTIFICATIONS PANEL */}
                {/* NOTIFICATIONS PANEL */}
                {notificationsOpen && (
                  <div
                    className="fixed top-0 right-0 z-50 transform transition-transform duration-300 flex flex-col
      bg-white shadow-xl w-full sm:w-80 h-screen
    "
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b bg-green-100">
                      <h2 className="font-bold text-lg">Notifications</h2>
                      <button onClick={() => setNotificationsOpen(false)}>
                        <FaTimes />
                      </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2">
                      {visibleNotifications.length === 0 ? (
                        <p className="p-4 text-gray-500">No notifications</p>
                      ) : (
                        visibleNotifications.map((n) => (
                          <div
                            key={n._id}
                            className={`group relative p-4 mb-3 rounded-2xl border transition-all duration-300 cursor-pointer
              ${!n.seen ? "bg-gradient-to-r from-green-50 to-white border-green-200 shadow-md" : "bg-white border-gray-200 hover:shadow-lg"}`}
                          >
                            {!n.seen && (
                              <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-2xl"></div>
                            )}
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-900 text-sm tracking-wide">{n.title}</h3>
                              {!n.seen && (
                                <span className="inline-block text-[10px] px-2 py-0.5 bg-green-600 text-white rounded-full mb-1">
                                  NEW
                                </span>
                              )}
                              <button
                                onClick={() => dismissNotification(n._id)}
                                className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{n.message}</p>
                            <span className="text-xs text-gray-400 italic">{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
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

            {/* MOBILE MENU TOGGLE */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg px-4 py-3 flex flex-col space-y-2">
            <form onSubmit={handleSearch} className="flex border rounded-lg">
              <input
                type="text"
                className="w-full px-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button>
                <FaSearch />
              </button>
            </form>

            {navItems.filter((i) => i !== "Categories").map((item) => (
              <Link
                key={item}
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                {item}
              </Link>
            ))}

            <div className="mt-2">
              <button
                onClick={() => toggleMobileCollection("root")}
                className="w-full flex justify-between items-center px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
              >
                <span>Categories</span>
                <FaChevronRight
                  className={`transition-transform duration-300 ${mobileCollectionsOpen.root ? "rotate-90" : ""
                    }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${mobileCollectionsOpen.root ? "max-h-[1000px] mt-1" : "max-h-0"
                  }`}
              >
                {Object.keys(groupedCategories).map((cat) => (
                  <div key={cat} className="ml-2 mt-1">
                    <button
                      onClick={() => toggleMobileCollection(cat)}
                      className="w-full flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                      <span>{cat}</span>
                      <FaChevronRight
                        className={`transition-transform duration-300 ${mobileCollectionsOpen[cat] ? "rotate-90" : ""
                          }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ml-4 ${mobileCollectionsOpen[cat] ? "max-h-[1000px] mt-1" : "max-h-0"
                        }`}
                    >
                      {groupedCategories[cat].map((sub) => (
                        <Link
                          key={sub}
                          href={`/products/${makeSlug(cat)}?sub_category=${makeSlug(sub)}`}
                          className="block px-4 py-2 rounded-md hover:bg-gray-50 transition"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isLoggedIn ? (
              <div className="flex flex-col space-y-2 mt-2">
                <button
                  onClick={onLoginClick}
                  className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={onSignUpClick}
                  className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                >
                  SignUp
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoutMutation.mutate()}
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition mt-2"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}