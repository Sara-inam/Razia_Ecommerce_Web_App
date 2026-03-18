import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/middleware/admin";

// ✅ GET SINGLE BRAND
export async function GET(req, { params }) {
  await connectDB();

  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const id = params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid brand ID" }, { status: 400 });
  }

  const brand = await Brand.findById(id).populate("collectionRef"); // renamed field

  if (!brand) return NextResponse.json({ message: "Brand not found" }, { status: 404 });

  return NextResponse.json(brand);
}

// ✅ UPDATE BRAND
export async function PUT(req, context) {
  try {
    await connectDB();

    const adminCheck = await requireAdmin(req);
    if (adminCheck instanceof NextResponse) return adminCheck;

    const { params } = context;
    const resolvedParams = await params; // ⚡ unwrap
    const id = resolvedParams.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid brand ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const brand_name = formData.get("brand_name")?.trim();
    const description = formData.get("description")?.trim();
    const collection = formData.get("collection"); // keep it 'collection' for schema
    const file = formData.get("image");

    if (!brand_name || !collection) {
      return NextResponse.json(
        { message: "Brand name and collection are required" },
        { status: 400 }
      );
    }

    // Duplicate check
    const existing = await Brand.findOne({
      brand_name,
      collection,
      _id: { $ne: id },
    });
    if (existing) {
      return NextResponse.json(
        { message: `Brand "${brand_name}" already exists in this collection.` },
        { status: 400 }
      );
    }

    const updatedData = { brand_name, description, collection };

    // Image upload
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "brands" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }).end(buffer);
      });

      updatedData.image = uploadResult.secure_url;
    }

    // ⚡ Use returnDocument instead of 'new'
    const updatedBrand = await Brand.findByIdAndUpdate(id, updatedData, {
      returnDocument: "after",
      runValidators: true,
    }).populate("collection"); // populate works now

    if (!updatedBrand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBrand);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
// ✅ DELETE BRAND
export async function DELETE(req, context) {
  await connectDB();

  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  // ⚡ unwrap params
  const params = await context.params;
  const id = params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid brand ID" }, { status: 400 });
  }

  const deleted = await Brand.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ message: "Brand not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Brand deleted successfully" });
}