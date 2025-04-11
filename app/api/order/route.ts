import { databaseConnection } from "@/config/databseConnection";
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";
import Cart from "@/models/cart.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { OrderConfirmationMail } from "@/services/sendMail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await databaseConnection();

  try {
    const decoded = await fetchTokenDetails(request);
    if (!decoded) {
      return NextResponse.json(
        { message: "You must log in to place an order", success: false },
        { status: 401 }
      );
    }

    const {
      totalAmount,
      paymentMethod,
      deliveryType,
      address,
      phone,
      products,
    } = await request.json();
    const user = await User.findOne({ _id: decoded?.userId });
    await Cart.findOneAndDelete({ userId: decoded?.userId.toString() });

    const newOrder = new Order({
      userId: decoded?.userId,
      totalAmount,
      paymentMethod,
      deliveryType,
      address,
      phone,
      status: "processing",
      products,
    });

    await newOrder.save();

    user.order.push(newOrder._id);
    if (user.firstPurchase === false) user.firstPurchase = true;
    user.cart = [];
    await user.save();

    // 🔔 Send confirmation email
    await OrderConfirmationMail(user.email, user.name || "Customer", {
      _id: newOrder._id.toString(),
      totalAmount: newOrder.totalAmount,
      address: newOrder.address,
      paymentMethod: newOrder.paymentMethod,
      deliveryType: newOrder.deliveryType,
      products: newOrder.products,
    });

    return NextResponse.json(
      { message: "Order placed successfully", success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { message: "Error placing order", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await databaseConnection();
  try {
    const decoded = await fetchTokenDetails(request);
    if (!decoded) {
      return NextResponse.json(
        { message: "You must log in to view your orders", success: false },
        { status: 401 }
      );
    }

    const orders = await Order.find({ userId: decoded?.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
      })
      .populate({
        path: "products.productId",
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
