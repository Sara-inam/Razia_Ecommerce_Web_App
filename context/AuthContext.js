"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 

  // page load pe current user fetch karo
  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      return;
    }

   const fetchUser = async () => {
  try {
    let res = await fetch("/api/auth/me", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.loggedIn) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser(null);
      }
    } else if (res.status === 401) {
      // Try refresh token
      const refresh = await fetch("/api/auth/refresh-token", { credentials: "include" });
      if (refresh.ok) {
        res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  } catch (err) {
    setUser(null);
  } finally {
    setLoading(false);
  }
};
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // save in localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // remove from localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("otpPending");
    localStorage.removeItem("otpEmail");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);