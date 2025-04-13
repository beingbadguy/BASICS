import { databaseConnection } from "@/config/databseConnection";
import Coupon from "@/models/coupon.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await databaseConnection();

  try {
    const { code, totalAmount } = await req.json();
    if (!code || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Coupon code and amount are required" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired coupon" },
        { status: 404 }
      );
    }

    // Assuming coupon.discount is a flat amount (e.g., ₹100 off)
    const discountAmount = coupon.discount;
    const finalAmount = Math.max(totalAmount - discountAmount, 0); // prevent negative total

    return NextResponse.json({
      success: true,
      message: "Coupon applied",
      discount: discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error applying coupon" },
      { status: 500 }
    );
  }
}
