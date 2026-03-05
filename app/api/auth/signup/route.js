import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  const { name, email, password } = await req.json();

  // 1️⃣ Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "You are already registered" },
      { status: 400 }
    );
  }

  // 2️⃣ Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3️⃣ Create user with default role 'user'
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });

  return NextResponse.json({
    message: "Signup successful",
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}