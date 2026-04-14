"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm({ show = false, onClose, switchForm, openForgot }) {
  const router = useRouter();
  const pathname = usePathname();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // simple email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setType("error");
      setMessage("Invalid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // cookies
      });

      const data = await res.json();

      if (!res.ok) {
        setType("error");
        setMessage(data.message || "Login failed");
        return;
      }

      // Save user info in context and localStorage
      const userData = data.user;
      login(userData); // update context
      localStorage.setItem("user", JSON.stringify(userData));

      setType("success");
      setMessage("Login successful 🎉 Redirecting...");

      // Redirect based on role
      setTimeout(() => {
  onClose?.();

  if (userData.role === "admin") {
    router.push("/admin"); // sirf admin redirect hoga
  } else {
    router.refresh(); // user same page par rahe + UI update ho jaye
  }
}, 800);
    } catch (err) {
      console.error(err);
      setType("error");
      setMessage("Something went wrong, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md p-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Welcome Back
        </h2>

        {message && (
          <div
            className={`mb-4 text-center py-2 rounded-lg text-sm font-medium ${
              type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/40 focus:bg-white/30 focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/40 focus:bg-white/30 focus:outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-lg"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 rounded-xl text-white font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white text-xl font-bold"
          >
            ×
          </button>
        )}

        <p className="text-white/70 text-sm text-center mt-5">
          Don't have an account?{" "}
          <span
            className="text-green-500 cursor-pointer"
            onClick={switchForm}
          >
            Sign In
          </span>
        </p>
        <button
  type="button"
  onClick={openForgot}
  className="text-sm text-blue-600 underline mt-2"
>
  Forgot Password?
</button>
      </div>
    </div>
  );
}