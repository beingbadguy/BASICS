import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
  //   apiVersion: "2025-08-14",
});

export async function POST(req: NextRequest) {
  try {
    // Get origin to redirect after payment
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Parse request body if needed (optional)
    const {
      productName,
      amount,
      phone,
      totalAmount,
      paymentMethod,
      deliveryType,
      address,
      zip,
      _id,
      products,
    } = await req.json();

    console.log("Request body:", { productName, amount });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: productName || "My Product",
            },
            unit_amount: amount || 50000, // ₹500.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/online-success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-error`,
      metadata: {
        _id,
        phone,
        totalAmount: totalAmount.toString(),
        paymentMethod,
        deliveryType,
        address,
        zip,
        products: JSON.stringify(products),
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
