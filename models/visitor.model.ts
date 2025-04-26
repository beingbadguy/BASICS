import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: String,
    userAgent: String,
    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite during hot reload
const Visitor =
  mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);

export default Visitor;
