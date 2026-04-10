import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    slides: [
      {
        img: String,
        title: String,
        desc: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Slider ||
  mongoose.model("Slider", sliderSchema);