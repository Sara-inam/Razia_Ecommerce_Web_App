import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/middleware/admin"; // ✅ import admin middleware

export async function PUT(req, context) {
  await connectDB();

  // Admin check
  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const { id } = await context.params;   // ✅ IMPORTANT
  const body = await req.json();

  const updated = await Collection.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(req, context) {
  await connectDB();

  // Admin check
  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const { id } = await context.params;   // ✅ IMPORTANT

  await Collection.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted successfully" });
}

export async function GET(req, context) {
  await connectDB();

  // Admin check
  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const { id } = await context.params;   // ✅ IMPORTANT

  const collection = await Collection.findById(id);

  if (!collection) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(collection);
}