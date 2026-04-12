"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPasswordForm({
  onClose,
  backToLogin,
  goToReset,
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error sending OTP");
        return;
      }

      // ✅ THIS WILL SHOW
     toast.success("OTP sent to your email 📩");

setTimeout(() => {
  goToReset(email);
}, 1200);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 px-4"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-5">
            Forgot Password
          </h2>

          <form onSubmit={sendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          <div className="flex justify-between mt-5 text-sm text-white/80">
            <button onClick={backToLogin} className="hover:text-green-400">
              ← Back to Login
            </button>

            <button onClick={onClose} className="hover:text-red-400">
              Close ✕
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 IMPORTANT PART */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}