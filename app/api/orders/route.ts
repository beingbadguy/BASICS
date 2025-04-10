import { databaseConnection } from "@/config/databseConnection";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
  await databaseConnection();
  try {
    const orders = await Order.find()
      .populate({
        path: "userId",
        model: "User",
      })
      .populate({
        path: "products.productId",
        model: "Product",
      });

    return NextResponse.json(
      { orders, success: true, message: "Orders fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching orders", success: false },
      { status: 500 }
    );
  }
}


