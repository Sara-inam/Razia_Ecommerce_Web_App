import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/lib/requireAdmin";

// GET all collections
export async function GET() {
  await connectDB();

  const collections = await Collection.find().sort({ createdAt: -1 });

  return NextResponse.json(collections);
}


// ADD collection
export async function POST(req) {
  await connectDB();

  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const body = await req.json();

  const collection = await Collection.create({
    name: body.name,
    slug: body.slug,
    season: body.season
  });

  return NextResponse.json(collection, { status: 201 });
}