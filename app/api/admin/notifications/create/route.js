import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const user = verifyToken(token);
  if (!user || user.role !== "admin") return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

  const { title, message, userId, expiresAt } = await req.json();
  if (!title || !message) return new Response(JSON.stringify({ error: "Missing title or message" }), { status: 400 });

  const notif = await Notification.create({
    title,
    message,
    userId: userId || null,
    expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 7*24*60*60*1000),
  });

  return new Response(JSON.stringify(notif), { status: 201 });
}