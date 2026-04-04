import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
  },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      color: String,
      size: String,
    }
  ],

  subtotal: Number,
  deliveryCharge: Number,
  total: Number,

  // ✅ Only COD
  paymentMethod: {
    type: String,
    default: "cash_on_delivery"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending"
  },

  trackingId: {
    type: String,
    unique: true
  }

}, { timestamps: true });

// 🔥 AUTO GENERATE TRACKING ID
OrderSchema.pre("save", function () {
  if (!this.trackingId) {
    this.trackingId = "ORD-" + Date.now();
  }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);