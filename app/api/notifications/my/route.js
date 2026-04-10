import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  const user = token ? verifyToken(token) : null;
  const userId = user?.id || null;

  const notifications = await Notification.find({
  $and: [
    {
      $or: [
        { userId: userId },
        { userId: null }
      ]
    },
    { expiresAt: { $gt: new Date() } },
    { dismissedBy: { $ne: userId } }
  ]
})
.sort({ createdAt: -1 })
.lean();

  return new Response(JSON.stringify(notifications), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}