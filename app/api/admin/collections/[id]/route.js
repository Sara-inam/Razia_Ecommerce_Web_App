import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/lib/requireAdmin";

// GET single collection
export async function GET(req, { params }) {
  await connectDB();

  const collection = await Collection.findById(params.id);

  if (!collection) {
    return NextResponse.json(
      { message: "Collection not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(collection);
}


// UPDATE collection
export async function PATCH(req, { params }) {
  await connectDB();

  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const body = await req.json();

  // 🔴 check duplicate name
  if (body.name) {
    const existing = await Collection.findOne({
      name: body.name,
      _id: { $ne: params.id } // ignore current collection
    });

    if (existing) {
      return NextResponse.json(
        { message: "Collection name already exists" },
        { status: 400 }
      );
    }
  }

  const updated = await Collection.findByIdAndUpdate(
    params.id,
    body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return NextResponse.json(
      { message: "Collection not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Collection updated successfully",
    updated
  });
}


// DELETE collection
export async function DELETE(req, { params }) {
  await connectDB();

  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const deleted = await Collection.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Collection not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Collection deleted successfully"
  });
}