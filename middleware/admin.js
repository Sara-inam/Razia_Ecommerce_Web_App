import { NextResponse } from "next/server";
import { requireAuth } from "./auth";

export function requireAdmin(req) {
  const user = requireAuth(req);

  if (user instanceof NextResponse) return user;

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Access denied. Admin only." },
      { status: 403 }
    );
  }

  return user;
}