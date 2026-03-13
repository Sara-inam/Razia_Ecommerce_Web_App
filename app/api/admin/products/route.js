import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/middleware/admin"; // Admin middleware

// ✅ GET PRODUCTS WITH PAGINATION
export async function GET(req) {
  await connectDB();

  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .populate({
        path: "brand",
        populate: { path: "collection", model: "Collection" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // plain JS objects

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      items: products,
      totalPages,
      totalItems: totalProducts,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ CREATE PRODUCT
export async function POST(req) {
  await connectDB();

  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const body = await req.json();

    if (!body.brand) {
      return NextResponse.json({ message: "Brand is required" }, { status: 400 });
    }

    // numeric fields
    const price = Number(body.price) || 0;
    const discountPercentage = Number(body.discountPercentage) || 0;

    // ✅ calculate discountPrice correctly
    const discountPrice = discountPercentage
      ? price - (price * discountPercentage) / 100
      : price;

    // upload color images
    const colors = await Promise.all(
      (body.colors || []).map(async (color) => {

        const images = await Promise.all(
          (color.images || []).map(async (img) => {
            if (img.startsWith("data:")) {
              const res = await cloudinary.uploader.upload(img, {
                folder: "products/colors"
              });
              return res.secure_url;
            }
            return img;
          })
        );

        const stock = (color.stock || []).map(s => ({
          size: s.size || "",
          quantity: Number(s.quantity) || 0
        }));

        return {
          name: color.name,
          hex: color.hex,
          images,
          stock
        };
      })
    );

    // ✅ Save discountPrice in DB
    const product = await Product.create({
      name: body.name,
      slug: body.slug,
      description: body.description,
      brand: body.brand,
      price,
      discountPercentage,
      discountPrice,
      colors,
      tags: body.tags || [],
      isActive: body.isActive ?? true
    });

    return NextResponse.json(product, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}