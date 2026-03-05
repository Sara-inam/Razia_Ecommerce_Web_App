import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";

export async function GET(req) {
  const user = requireAuth(req);
  if (user instanceof NextResponse) return user; // unauthorized

  return NextResponse.json({
    message: "You accessed a protected route",
    user,
  });
}