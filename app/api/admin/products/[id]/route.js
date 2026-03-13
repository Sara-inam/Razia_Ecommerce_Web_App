import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/middleware/admin";



// ✅ UPDATE PRODUCT
export async function PUT(req, context) {
  await connectDB();

  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const params = await context.params;
  const productId = params?.id;

  if (!productId) {
    return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const price = Number(body.price) || 0;
    const discountPercentage = Number(body.discountPercentage) || 0;
    const isActive = body.isActive ?? true;

    // ✅ calculate discountPrice
    const discountPrice = discountPercentage
      ? price - (price * discountPercentage) / 100
      : price;

    // Upload color images
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

        const stock = (color.stock || []).map((s) => ({
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

    // ✅ Save discountPrice in DB while updating
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: body.name,
        slug: body.slug,
        description: body.description,
        brand: body.brand,
        price,
        discountPercentage,
        discountPrice,
        colors,
        tags: body.tags || [],
        isActive
      },
      { new: true }
    ).populate({
      path: "brand",
      populate: { path: "collection", model: "Collection" }
    });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

// ✅ DELETE PRODUCT

export async function DELETE(req, context) {
  await connectDB();

  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  const params = await context.params;
  const productId = params?.id;

  if (!productId) {
    return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
  }

  try {
    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}