import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Ensure model is imported
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) return new Response(JSON.stringify({ orders: [], totalOrders: 0 }), { status: 401 });

  const user = verifyToken(token);
  if (!user) return new Response(JSON.stringify({ orders: [], totalOrders: 0 }), { status: 401 });

  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 15;
    const skip = (page - 1) * limit;

    // Count total orders for the user
    const totalOrders = await Order.countDocuments({ user: user.id });

    // Fetch orders with pagination
    const orders = await Order.find({ user: user.id })
      .populate({
        path: "items.product",
        select: "name colors price images",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return new Response(
      JSON.stringify({ orders, totalOrders }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Orders fetch error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch orders" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}