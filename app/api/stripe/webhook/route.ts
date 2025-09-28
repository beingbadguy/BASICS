// app/api/webhook/route.ts
import Cart from "@/models/cart.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import {
  OrderConfirmationMail,
  orderPlacedMessageToAdmin,
} from "@/services/sendMail";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe client ko initialize karo
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);

/**
 * Ye function checkout session complete hone par saara business logic handle karta hai.
 * Jaise: Order banana, user details update karna, aur email bhejna.
 */
const handleCheckoutSession = async (session: Stripe.Checkout.Session) => {
  console.log("Processing successful payment for session:", session.id);

  const metadata = session.metadata;
  // Check karo ki metadata aur user ID hai ya nahi
  if (!metadata || !metadata._id) {
    console.error("No metadata or user ID found in session:", session.id);
    return; // Agar nahi hai, to aage mat badho
  }

  const {
    totalAmount,
    paymentMethod,
    deliveryType,
    address,
    phone,
    // products,
    _id,
    zip,
  } = metadata;

  // User ko database mein dhoondo
  const user = await User.findById(_id);
  if (!user) {
    console.error("User not found for ID:", _id);
    return; // Agar user nahi mila, to aage mat badho
  }

  // IDEMPOTENCY CHECK: Check karo ki is payment ke liye order pehle se to nahi bana hai
  const existingOrder = await Order.findOne({
    paymentId: session.payment_intent as string,
  });
  if (existingOrder) {
    console.log(
      "Order already exists for this payment intent:",
      session.payment_intent
    );
    return; // Agar order hai, to duplicate mat banao
  }

  // ----- Start: Database Operations -----

  const products = await Cart.find({ userId: _id });

  if (!products || products.length === 0) {
    console.error("No cart found for user ID:", _id);
    return; // Agar cart nahi mila, to aage mat badho
  }
  console.log("Cart items found for user ID:", _id, products);
  const productsInCart = products[0]?.products;
  console.log("Products in cart:", productsInCart);

  // Naya order banao
  const newOrder = new Order({
    userId: _id,
    totalAmount,
    paymentMethod,
    deliveryType,
    address,
    phone,
    status: "processing",
    products: productsInCart || "[]",
    paymentId: session.payment_intent as string,
    zip,
  });
  await newOrder.save();

  // User ka cart khali karo
  await Cart.findOneAndDelete({ userId: _id });

  // User ke profile mein order ID add karo
  user.order.push(newOrder._id);
  user.firstPurchase = true; // Agar zaroori ho
  user.cart = []; // User object mein bhi cart khali karo
  await user.save();

  console.log("Order saved and user updated for user ID:", _id);

  // ----- End: Database Operations -----

  // ----- Start: Email Notifications -----
  // Ye kaam background mein bhejna behtar rehta hai production mein
  try {
    await Promise.all([
      OrderConfirmationMail(user.email, user.name || "Customer", {
        _id: newOrder._id.toString(),
        totalAmount: newOrder.totalAmount,
        address: newOrder.address,
        paymentMethod: newOrder.paymentMethod,
        deliveryType: newOrder.deliveryType,
        products: newOrder.products,
      }),
      orderPlacedMessageToAdmin(user.email, user.name),
    ]);
    console.log("Order confirmation emails sent for order:", newOrder._id);
  } catch (emailError) {
    console.error("Failed to send emails:", emailError);
    // Email fail hone par bhi humne Stripe ko 200 OK bhej diya hai, jo sahi hai.
  }
  // ----- End: Email Notifications -----
};

/**
 * Ye main webhook handler hai. Ye Stripe se request receive karta hai.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  // Step 1: Signature verify karo (sabse zaroori security step)
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY!
    );
    // Step 2: Event type ke basis par action lo
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        try {
          // Business logic ko handle karne ke liye helper function call karo
          await handleCheckoutSession(session);
        } catch (error) {
          console.error("Critical error processing checkout session:", error);
        }
        break;

      // In events ko hume handle nahi karna, bas acknowledge karna hai
      case "payment_intent.succeeded":
      case "charge.succeeded":
      case "charge.updated":
        console.log(`Acknowledged (but not processing) event: ${event.type}`);
        // Kuch nahi karna, bas ignore karo
        break;

      default:
        // Agar koi anjaan event aaye to log karo
        console.warn(`Unhandled event type: ${event.type}`);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Webhook signature verification failed:`, err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }
  }
  // Step 3: Stripe ko hamesha 200 OK response bhejo
  // Isse Stripe ko pata chal jaata hai ki event receive ho gaya.
  return NextResponse.json({ received: true }, { status: 200 });
}
