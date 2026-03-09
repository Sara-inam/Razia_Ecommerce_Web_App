import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Collection from "@/models/Collection";

// ✅ GET ALL
export async function GET() {
  await connectDB();

  const collections = await Collection.find().sort({ createdAt: -1 });

  return NextResponse.json(collections);
}

// ✅ CREATE
export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const newCollection = await Collection.create(body);

  return NextResponse.json(newCollection, { status: 201 });
}