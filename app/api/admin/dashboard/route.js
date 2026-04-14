import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
 
 const monthlyRevenue = await Order.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" },
      revenue: { $sum: "$total" }
    }
  },
  { $sort: { "_id": 1 } }
]);
  // ✅ FIXED REVENUE (use correct field: total)
  const revenueData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" }
      }
    }
  ]);

  const revenue = revenueData[0]?.totalRevenue || 0;

  // ✅ FIXED RECENT ORDERS (populate user)
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name")
    .lean();

 return NextResponse.json({
  stats: {
    totalProducts,
    totalOrders,
    totalUsers,
    revenue,
  },
  recentOrders,
  monthlyRevenue,
});
}