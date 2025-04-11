// /app/api/admin/orders/[id]/status/route.ts
import { databaseConnection } from "@/config/databseConnection";
import Order from "@/models/order.model";
import { OrderStatusMail } from "@/services/sendMail";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await databaseConnection();
  try {
    const { id } = await context.params;
    const { status } = await req.json();
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("userId");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    try {
      if (order.userId?.email) {
        await OrderStatusMail(order.userId.email, order._id, status);
      }
    } catch (mailErr) {
      console.error("Failed to send order status mail:", mailErr);
    }

    return NextResponse.json(
      { message: "Status updated", order },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}
