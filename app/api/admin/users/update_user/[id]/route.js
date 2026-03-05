import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/middleware/auth";

export async function PATCH(req, { params }) {
  await connectDB();

  const { id } = await params;   // ⭐ correct fix

  const currentUser = requireAuth(req);
  if (currentUser instanceof NextResponse) return currentUser;

  const { name, email, password, role } = await req.json();

  if (role && currentUser.role !== "admin") {
    return NextResponse.json(
      { message: "Only admin can change role" },
      { status: 403 }
    );
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role && currentUser.role === "admin") user.role = role;

    await user.save();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}