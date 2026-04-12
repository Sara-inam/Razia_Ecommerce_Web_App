import { NextResponse } from "next/server";
import Product from "@/models/Product";
import "@/models/Brand";
import "@/models/Collection";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 2) {
      return NextResponse.json([]);
    }

    const keyword = q.toLowerCase().trim();

    const products = await Product.find()
      .populate({
        path: "brand",
        populate: { path: "collection" },
      })
      .limit(100);

    const filtered = products.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const brand = p.brand?.brand_name?.toLowerCase() || "";
      const category = p.brand?.collection?.category?.toLowerCase() || "";
      const sub = p.brand?.collection?.sub_category?.toLowerCase() || "";

      return (
        name.includes(keyword) ||
        brand.includes(keyword) ||
        category.includes(keyword) ||
        sub.includes(keyword)
      );
    });

    return NextResponse.json(
      filtered.map((p) => ({
        _id: p._id,
        name: p.name,
        price: p.discountPrice || p.price,
        slug: p.slug,
        discountPercentage: p.discountPercentage,
        discountPrice: p.discountPrice,


        // ✅ IMPORTANT: full colors send karo (HomeSection style)
        colors: p.colors || [],
        description: p.description,

        brand: {
          brand_name: p.brand?.brand_name,
          description: p.brand?.description,
          collection: p.brand?.collection,
        },
      }))
    );
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}