import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,

  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },

  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  discountPrice: { type: Number },

  colors: [
    {
      name: String,
      hex: String,
      images: [String],
      stock: [
        {
          size: String,
          quantity: Number
        }
      ]
    }
  ],

  tags: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 }
},
{ timestamps: true }
);

// ✅ Always calculate discount price before save
ProductSchema.pre("save", function () {
  this.discountPrice = this.discountPercentage
    ? this.price - (this.price * this.discountPercentage) / 100
    : this.price;
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);