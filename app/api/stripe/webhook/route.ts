// app/api/webhook/route.ts
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

        if (!metadata) {
          console.error("No metadata found in session");
          return NextResponse.json({ received: true });
        }

        // Order create karo with all details
        // const orderData = {
        //   sessionId: session.id,
        //   totalAmount: session.amount_total! / 100, // Convert from cents to rupees
        //   paymentMethod: "online",
        //   paymentStatus: "paid",
        //   deliveryType: metadata.deliveryType,
        //   address: metadata.address,
        //   zip: metadata.zip,
        //   phone: metadata.phone,
        //   products: JSON.parse(metadata.products || "[]"),
        //   stripePaymentIntentId: session.payment_intent,
        // };

        // Direct database operation karo instead of fetch
        // Ya phir internal function call karo
        // const order = await createOrderInDatabase(orderData);

        // console.log("Order saved successfully:", order._id);
      } catch (error) {
        console.error("Failed to save order:", error);
        // Stripe ko success return karo even if order save failed
        // Later you can handle this with retry logic
      }
    }

    // Payment failed case
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Payment expired for session:", session.id);
      // Handle expired payment logic
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Database operation function
// async function createOrderInDatabase(orderData: any) {
//   // Replace this with your actual database logic
//   // Example with MongoDB/Mongoose:
//   /*
//   const Order = require('../../models/Order');
//   const order = new Order(orderData);
//   return await order.save();
//   */

//   // For now, return mock data
//   return { _id: "temp_order_id", ...orderData };
// }
