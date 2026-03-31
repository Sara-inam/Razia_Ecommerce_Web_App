import Product from "@/models/Product";
import "@/models/Brand"; // 👈 FIX
import "@/models/Collection"; // 👈 agar collection bhi separate model hai to ye bhi

export async function GET() {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .populate({
      path: "brand",
      populate: {
        path: "collection",
      },
    });

  let sectionsMap = {};

  products.forEach((p) => {
    const collection = p.brand?.collection?.collection_name;
    const category = p.brand?.collection?.category;
    const subCategory = p.brand?.collection?.sub_category;

    if (!collection || !category) return;

    const key = `${collection}-${category}-${subCategory || "all"}`;

    if (!sectionsMap[key]) {
      sectionsMap[key] = {
        title: `${collection} - ${category}${subCategory ? ` - ${subCategory}` : ""}`,
        collection,
        category,
        subCategory,
        image: p.brand?.image,
        products: [],
      };
    }

    if (sectionsMap[key].products.length < 12) {
      sectionsMap[key].products.push(p);
    }
  });

  return Response.json({
    sections: Object.values(sectionsMap),
  });
}