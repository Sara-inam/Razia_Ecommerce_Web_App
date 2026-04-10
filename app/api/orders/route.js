import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product"; 
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose"; // ✅ ADD

export async function POST(req) {
  const session = await mongoose.startSession(); // ✅ START SESSION
  session.startTransaction();

  try {
    await connectDB();

    // ✅ TOKEN
    const token = req.cookies.get("token")?.value;

    if (!token) {
      throw new Error("Please login first");
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    // ✅ BODY
    const body = await req.json();

    if (!body.customer?.name || !body.customer?.phone || !body.items?.length) {
      throw new Error("Missing required fields");
    }

    // 🔥 STEP 1: UPDATE STOCK ATOMICALLY
   // 🔥 STEP 1: UPDATE STOCK ATOMICALLY
for (const item of body.items) {
  const updated = await Product.findOneAndUpdate(
    {
      _id: item.product,
      "colors.name": item.color,
      "colors.stock": {
        $elemMatch: {
          size: item.size,
          quantity: { $gte: item.quantity } // ✅ enough stock check
        }
      }
    },
    {
      $inc: {
        "colors.$[colorElem].stock.$[stockElem].quantity": -item.quantity
      }
    },
    {
      arrayFilters: [
        { "colorElem.name": item.color },
        { "stockElem.size": item.size }
      ],
      new: true,
      session // ✅ IMPORTANT
    }
  );

  if (!updated) {
    // If update fails, get the available stock
    const product = await Product.findById(item.product);
    const color = product?.colors.find(c => c.name === item.color);
    const stockItem = color?.stock.find(s => s.size === item.size);
    const availableQty = stockItem?.quantity || 0;

    throw new Error(
      `❌ ${item.name} is out of stock. Available quantity: ${availableQty}`
    );
  }
}

    // 🔥 STEP 2: ADD IMAGES
    const itemsWithImages = await Promise.all(
      body.items.map(async (item) => {
        const product = await Product.findById(item.product);

        return {
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          image:
            item.image ||
            (product?.colors?.find(c => c.name === item.color)?.images?.[0] || ""),
        };
      })
    );

    // 🔥 STEP 3: CREATE ORDER
    const order = await Order.create(
      [
        {
          user: decoded.id,
          customer: body.customer,
          items: itemsWithImages,
          subtotal: body.subtotal,
          deliveryCharge: body.deliveryCharge,
          total: body.total,
          paymentMethod: "cash_on_delivery",
          paymentStatus: "pending",
          status: "pending",
        }
      ],
      { session }
    );

    // ✅ COMMIT
    await session.commitTransaction();
    session.endSession();

    return new Response(
      JSON.stringify({ success: true, order: order[0] }),
      { status: 201 }
    );

  } catch (error) {
    // ❌ ROLLBACK
    await session.abortTransaction();
    session.endSession();

    console.error("API error:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}