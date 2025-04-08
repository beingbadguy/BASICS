import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    categoryImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const category =
  mongoose.models.category || mongoose.model("category", categorySchema);
export default category;
