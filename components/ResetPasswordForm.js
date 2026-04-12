"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordForm({
  email,
  backToLogin,
  onClose,
}) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FIX: missing state added
  const [showPassword, setShowPassword] = useState(false);

  // ⏳ OTP TIMER (10 min)
  const [timer, setTimer] = useState(600);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (timer <= 0) {
      toast.error("OTP expired. Please request again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid OTP ❌");
        setTimer((prev) => Math.max(prev - 30, 0));
        return;
      }

      toast.success("Password reset successful 🎉");

      setTimeout(() => {
        backToLogin();
      }, 1200);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
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
            Reset Password
          </h2>

          {/* TIMER */}
          <p className="text-center text-yellow-300 mb-3 text-sm">
            ⏳ OTP expires in {formatTime(timer)}
          </p>

          <form onSubmit={resetPassword} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30"
            />

            {/* PASSWORD FIELD WITH TOGGLE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white border border-white/30"
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
              disabled={loading || timer <= 0}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl disabled:opacity-50"
            >
              {timer <= 0
                ? "OTP Expired"
                : loading
                ? "Resetting..."
                : "Reset Password"}
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

      {/* TOAST */}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}