import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// UPDATE PRODUCT
export async function PUT(req, context) {
  await connectDB();

  // Unwrap params
  const params = await context.params;
  const productId = params.id;

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      body,
      { new: true }
    ).populate({
      path: "brand",
      populate: { path: "collection" }
    });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  await connectDB();

  // Unwrap params
  const params = await context.params;
  const productId = params.id;

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}