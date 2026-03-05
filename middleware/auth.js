import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function requireAuth(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  return user; // return decoded user info
}