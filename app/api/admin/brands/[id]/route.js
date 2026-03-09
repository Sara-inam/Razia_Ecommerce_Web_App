import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";
import Collection from "@/models/Collection";
import cloudinary from "@/lib/cloudinary";

// ✅ GET SINGLE BRAND
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  const brand = await Brand.findById(id).populate("collection");

  if (!brand)
    return NextResponse.json(
      { message: "Brand not found" },
      { status: 404 }
    );

  return NextResponse.json(brand);
}

// ✅ UPDATE BRAND
export async function PUT(req, context) {
  await connectDB();

  const { id } = await context.params; // ✅ FIX

  const formData = await req.formData();
  const brand_name = formData.get("brand_name");
  const description = formData.get("description");
  const collection = formData.get("collection");
  const file = formData.get("image");

  let updatedData = {
    brand_name,
    description,
    collection,
  };

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;

    const dataUri = `data:${mimeType};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "brands",
    });

    updatedData.image = uploadResult.secure_url;
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    id,
    updatedData,
    { returnDocument: "after" }
  );

  if (!updatedBrand) {
    return NextResponse.json(
      { message: "Brand not found" },
      { status: 404 }
    );
  }

  const populatedBrand = await Brand.findById(id)
    .populate("collection");

  return NextResponse.json(populatedBrand);
}

// ✅ DELETE BRAND
export async function DELETE(req, context) {
  await connectDB();

  // Unwrap async params
  const { id } = await context.params;

  const deleted = await Brand.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Brand not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Brand deleted successfully",
  });
}