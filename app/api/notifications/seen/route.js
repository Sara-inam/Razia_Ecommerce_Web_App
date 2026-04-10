import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  await connectDB();
  const { notificationIds } = await req.json();
  const token = req.cookies.get("token")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) return new Response("Unauthorized", { status: 401 });

  await Notification.updateMany(
    { _id: { $in: notificationIds }, seenBy: { $ne: user.id } },
    { $addToSet: { seenBy: user.id } }
  );

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}