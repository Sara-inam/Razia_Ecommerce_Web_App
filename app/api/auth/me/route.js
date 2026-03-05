// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ loggedIn: false });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return NextResponse.json({ loggedIn: false });

    return NextResponse.json({
      loggedIn: true,
      user: { name: user.name, role: user.role }
    });
  } catch (err) {
    return NextResponse.json({ loggedIn: false });
  }
}