import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";

export async function GET() {
  await connectDB();

  const collections = await Collection.find();

  return NextResponse.json(collections);
}