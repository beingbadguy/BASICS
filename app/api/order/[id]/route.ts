import { databaseConnection } from "@/config/databseConnection";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await databaseConnection();
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { message: "Product id is required", success: false },
        { status: 400 }
      );
    }
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { order, success: true, message: "Order fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching order", success: false },
      { status: 500 }
    );
  }
}
