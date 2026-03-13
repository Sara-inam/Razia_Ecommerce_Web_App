import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";
import Collection from "@/models/Collection";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/middleware/admin"; // ✅ import admin middleware

// ✅ GET ALL BRANDS WITH PAGINATION
export async function GET(req) {
  await connectDB();

  // Admin check
  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 5;

  const skip = (page - 1) * limit;

  const total = await Brand.countDocuments();

  const brands = await Brand.find()
    .populate("collection")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // optional sorting

  return NextResponse.json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
    data: brands,
  });
}

// ✅ CREATE BRAND
export async function POST(req) {
  await connectDB();

  // Admin check
  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const formData = await req.formData();

  const brand_name = formData.get("brand_name");
  const description = formData.get("description");
  const collection = formData.get("collection");
  const file = formData.get("image");

  let imageUrl = "";

  // Upload image only if exists
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "brands" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    imageUrl = uploadResult.secure_url;
  }

  const newBrand = await Brand.create({
    brand_name,
    description,
    collection, // foreign key
    image: imageUrl,
  });

  // populate before sending to frontend
  const populatedBrand = await Brand.findById(newBrand._id)
    .populate("collection");

  return NextResponse.json(populatedBrand, { status: 201 });
}