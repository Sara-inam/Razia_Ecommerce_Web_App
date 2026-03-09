import { NextResponse } from "next/server";
import  {connectDB}from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();

  const products = await Product.find()
    .populate({
      path: "brand",
      populate: {
        path: "collection",
        model: "Collection",
      },
    });

  return NextResponse.json(products);
}

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    // Validation: brand required
    if (!body.brand) {
      return NextResponse.json({ message: "Brand is required" }, { status: 400 });
    }

    // Upload featured image if provided as base64 or URL
    let featuredImageUrl = body.featuredImage || "";
    if (body.featuredImage?.startsWith("data:")) {
      const uploadRes = await cloudinary.uploader.upload(body.featuredImage, {
        folder: "products",
      });
      featuredImageUrl = uploadRes.secure_url;
    }

    // Upload color images
    const colors = await Promise.all(
      (body.colors || []).map(async (color) => {
        const images = await Promise.all(
          (color.images || []).map(async (img) => {
            if (img.startsWith("data:")) {
              const res = await cloudinary.uploader.upload(img, { folder: "products/colors" });
              return res.secure_url;
            }
            return img;
          })
        );
        return { ...color, images };
      })
    );

    const product = await Product.create({
      ...body,
      featuredImage: featuredImageUrl,
      colors,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}