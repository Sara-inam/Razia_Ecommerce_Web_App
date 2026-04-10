// app/api/notifications/dismiss/route.js
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

  const user = verifyToken(token);
  if (!user?.id) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

  const body = await req.json();
  const { notificationId } = body;

  if (!notificationId) {
    return new Response(JSON.stringify({ message: "Notification ID required" }), { status: 400 });
  }

  // Update notification: add this user to dismissedBy array
  await Notification.updateOne(
    { _id: notificationId },
    { $addToSet: { dismissedBy: user.id } }
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}