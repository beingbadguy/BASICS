// app/api/webhook/route.ts
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";
import Cart from "@/models/cart.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import {
  OrderConfirmationMail,
  orderPlacedMessageToAdmin,
} from "@/services/sendMail";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Raw body ko properly extract karo
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_KEY!
      );
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    console.log("Webhook event received:", event.type);

    // Payment successful case
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Processing successful payment for session:", session.id);

      try {
        // Session metadata se order details retrieve karo
        const metadata = session.metadata;
        console.log("Session metadata:", metadata);

        if (!metadata) {
          console.error("No metadata found in session");
          return NextResponse.json({ received: true });
        }
        const decoded = await fetchTokenDetails(req);
        if (!decoded) {
          console.error("User not authenticated");
          return NextResponse.json({ received: true });
        }

        const user = await User.findOne({ _id: decoded?.userId });
        await Cart.findOneAndDelete({ userId: decoded?.userId.toString() });
        console.log("User found:", user);

        const {
          totalAmount,
          paymentMethod,
          deliveryType,
          address,
          phone,
          products,
          zip,
        } = metadata;

        const newOrder = new Order({
          userId: decoded?.userId,
          totalAmount,
          paymentMethod,
          deliveryType,
          address,
          phone,
          status: "processing",
          products: JSON.parse(products || "[]"),
          paymentId: session.payment_intent as string,
          zip,
        });

        await newOrder.save();

        user.order.push(newOrder._id);
        if (user.firstPurchase === false) user.firstPurchase = true;
        user.cart = [];
        await user.save();
        console.log("Order saved and user updated:", newOrder, user);

        // 🔔 Send confirmation email
        await OrderConfirmationMail(user.email, user.name || "Customer", {
          _id: newOrder._id.toString(),
          totalAmount: newOrder.totalAmount,
          address: newOrder.address,
          paymentMethod: newOrder.paymentMethod,
          deliveryType: newOrder.deliveryType,
          products: newOrder.products,
        });

        await orderPlacedMessageToAdmin(user.email, user.name);
        console.log("Order processing completed");

        return NextResponse.json(
          {
            message: "Order placed successfully",
            success: true,
            order: newOrder,
          },
          { status: 201 }
        );
      } catch (error) {
        console.error("Failed to save order:", error);
      }
    }

    // Payment failed case
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Payment expired for session:", session.id);
      return NextResponse.json(
        {
          message: "Failed to place order",
          success: true,
        },
        { status: 201 }
      );
    }
    console.log("Unhandled event type:", event.type);

    return NextResponse.json(
      {
        message: "Order placed successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
