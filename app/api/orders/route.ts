import { databaseConnection } from "@/config/databseConnection";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";
import "@/models/wishlist.model";
import "@/models/product.model";
import "@/models/category.model";
import "@/models/cart.model";
import "@/models/order.model";
import "@/models/coupon.model";
import "@/models/contact.model";
import "@/models/newsletter.model";
import "@/models/user.model";
import "@/models/promo.model";

export async function GET() {
  await databaseConnection();
  try {
    const orders = await Order.find()
      .populate("userId", "-password")
      .populate("products.productId");

    return NextResponse.json(
      { orders, success: true, message: "Orders fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching orders" },
      { status: 500 }
    );
  }
}
