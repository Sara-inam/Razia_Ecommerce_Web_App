import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  // 1️⃣ Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "You are not registered! please sign up first" }, { status: 404 });
  }

  // 2️⃣ Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: "Invalid password" }, { status: 400 });
  }

  // 3️⃣ Generate tokens
  const token = generateToken(user);
const refreshToken = generateRefreshToken(user);

// ✅ Save refresh token in user document
user.refreshToken = refreshToken;
await user.save();

  // 4️⃣ Set cookies
  const res = NextResponse.json({
  message: "Login successful",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token,
  refreshToken,
  redirect: user.role === "admin" ? "/admin" : "/",
});
  // Access token cookie
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Refresh token cookie
  res.cookies.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    path: "/api/refresh-token",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res;
}