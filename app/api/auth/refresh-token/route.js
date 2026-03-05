import { NextResponse } from "next/server";
import User from "@/models/User";
import { verifyRefreshToken, generateToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  
  try {
    const token = req.cookies.get("refreshToken")?.value;
    if (!token) return NextResponse.json({ loggedIn: false }, { status: 401 });

    const decoded = verifyRefreshToken(token);
    const user = await User.findOne({ _id: decoded.id, refreshToken: token });
    if (!user) return NextResponse.json({ loggedIn: false }, { status: 401 });

    const newToken = generateToken(user);

    const res = NextResponse.json({ token: newToken });

    // set new access token cookie
    res.cookies.set({
      name: "token",
      value: newToken,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
}