import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/middleware/admin"; 

// ✅ GET ALL WITH PAGINATION
export async function GET(req) {
  await connectDB();

  // Check admin access
  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;
  
  try {
    

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const total = await Collection.countDocuments();

    const collections = await Collection.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: collections,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ✅ CREATE
// ---------------- CREATE NEW COLLECTION ----------------
export async function POST(req) {
  await connectDB();

  // Check admin access
  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const body = await req.json();
    const newCollection = await Collection.create(body);

    return NextResponse.json(newCollection, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}