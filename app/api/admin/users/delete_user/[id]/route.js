import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/middleware/admin";

export async function DELETE(req, context) {
  await connectDB();

  // Admin check
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    // ✅ Await the params promise
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await user.deleteOne();
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}