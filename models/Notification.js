import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null = everyone
   seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30*24*60*60*1000) }, // 1 month
    dismissedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // user IDs
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);