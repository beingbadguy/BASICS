// /app/api/admin/orders/[id]/status/route.ts
import { databaseConnection } from "@/config/databseConnection";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await databaseConnection();
  try {
    const { id } = await context.params;
    const { status } = await req.json();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
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
