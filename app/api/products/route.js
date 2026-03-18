import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import Collection from "@/models/Collection";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const collectionName = searchParams.get("collection");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("sub_category");
  const brandName = searchParams.get("brand");

  // ✅ Pagination
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const skip = (page - 1) * limit;

  try {
    // ✅ 1. Collection filter
    const collectionQuery = {};

    if (collectionName) {
      collectionQuery.collection_name = {
        $regex: new RegExp(`^${collectionName}$`, "i"),
      };
    }

    if (category) {
      collectionQuery.category = {
        $regex: new RegExp(`^${category}$`, "i"),
      };
    }

    if (subcategory) {
      collectionQuery.sub_category = {
        $regex: new RegExp(`^${subcategory}$`, "i"),
      };
    }

    const collections = await Collection.find(collectionQuery);

    if (!collections.length) {
      return NextResponse.json({
        products: [],
        total: 0,
        page,
        totalPages: 0,
      });
    }

    const collectionIds = collections.map((c) => c._id);

    // ✅ 2. Brands (ONLY from filtered collections → subcategory aware)
    let brandQuery = {
      collection: { $in: collectionIds },
    };

    if (brandName) {
      const brandArray = brandName.split(",");
      brandQuery.brand_name = {
        $in: brandArray.map((b) => new RegExp(`^${b}$`, "i")),
      };
    }

    const brands = await Brand.find(brandQuery);

    if (!brands.length) {
      return NextResponse.json({
        products: [],
        total: 0,
        page,
        totalPages: 0,
      });
    }

    const brandIds = brands.map((b) => b._id);

    // ✅ 3. Product query (final)
    const productQuery = {
      brand: { $in: brandIds },
      isActive: true,
    };

    // ✅ Total count
    const total = await Product.countDocuments(productQuery);

    // ✅ Fetch products with pagination
    let products = await Product.find(productQuery)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "brand",
        populate: { path: "collection" },
      });

    // ✅ Attach sub_category (clean response)
    products = products.map((p) => ({
      ...p.toObject(),
      sub_category: p.brand?.collection?.sub_category || null,
    }));

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}