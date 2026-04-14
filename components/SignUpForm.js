"use client";
import { useState } from "react";
import Link from "next/link"; 

export default function SignUpForm({ show = false, onClose, switchForm }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setType("error");
      setMessage("Invalid email address");
      return;
    }

    // password match check
    if (password !== confirmPassword) {
      setType("error");
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setType("error");
        setMessage(data.message || "Signup failed");
      } else {
        setType("success");
        setMessage("You are registered successfully 🎉");

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setType("error");
      setMessage("Something went wrong");
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
          Create Account
        </h2>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 text-center py-2 rounded-lg text-sm font-medium ${
              type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/40 focus:bg-white/30 focus:outline-none"
          />

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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/40 focus:bg-white/30 focus:outline-none"
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 rounded-xl text-white font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Creating account..." : "Sign In"}
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
  Already have an account?{" "}
  <span
    className="text-green-500 cursor-pointer"
    onClick={switchForm} // use prop from AuthPage
  >
    Login
  </span>
</p>
      </div>
    </div>
  );
}