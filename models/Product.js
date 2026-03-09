import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  sku: String,

  // Brand as foreign key
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },

  // Colors with multiple images and size-specific stock
  colors: [
    {
      name: { type: String, required: true },
      hex: String,
      images: [String],
      stock: [
        { size: String, quantity: Number }
      ]
    }
  ],

  featuredImage: String, 
  tags: [String],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);