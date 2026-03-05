import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/middleware/admin";

export async function GET(req) {
  await connectDB();

  // Check admin
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  // Extract ID from URL
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // get last segment, the [id]

  try {
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}