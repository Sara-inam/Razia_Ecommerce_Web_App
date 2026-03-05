// api/auth/logout/route.js
import { NextResponse } from "next/server"; 
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();

  // Remove refresh token from DB if exists
  const token = req.cookies.get("refreshToken")?.value;
  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { $unset: { refreshToken: "" } });
  }

  const res = NextResponse.json({ message: "Logout successful" });

  // delete access token
  res.cookies.set({ name: "token", value: "", path: "/", maxAge: 0 });
  // delete refresh token
  res.cookies.set({ name: "refreshToken", value: "", path: "/", maxAge: 0 });

  return res;
}