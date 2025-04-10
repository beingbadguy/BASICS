import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      title: String,
      price: Number,
      image: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    required: true,
    default: "cod",
    enum: ["cod", "online"],
  },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: [
      "processing",
      "reviewing",
      "preparing",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
    ],
  },
  deliveryType: {
    type: String,
    required: true,
    default: "normal",
    enum: ["normal", "fast"],
  },
  address: { type: String, required: true },
  phone: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
