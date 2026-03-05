import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/middleware/requireAdmin";

export async function POST(req) {
  await connectDB();

  // admin check
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const body = await req.json();

    // check if collection already exists
    const existing = await Collection.findOne({ name: body.name });

    if (existing) {
      return NextResponse.json(
        { message: "Collection already exists" },
        { status: 400 }
      );
    }

    const collection = await Collection.create({
      name: body.name,
      slug: body.slug,
      season: body.season
    });

    return NextResponse.json(
      { message: "Collection added successfully", collection },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error adding collection", error: error.message },
      { status: 500 }
    );
  }
}