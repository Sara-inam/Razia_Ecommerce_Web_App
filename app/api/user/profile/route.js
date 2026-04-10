import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      profileImage: user.profileImage || "/default-user.png",
    });

  } catch (err) {
    console.error("Profile Fetch Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}