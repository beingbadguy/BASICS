import { databaseConnection } from "@/config/databseConnection";
import Coupon from "@/models/coupon.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await databaseConnection();
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { coupons, success: true, message: "Coupons fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching coupons", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await databaseConnection();
  try {
    const { name, code, discount } = await req.json();

    if (!name || !code || !discount) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return NextResponse.json(
        { message: "Coupon already exists", success: false },
        { status: 400 }
      );
    }

    const newCoupon = new Coupon({ name:name.toUpperCase(), code, discount });
    await newCoupon.save();
    return NextResponse.json(
      { newCoupon, success: true, message: "Coupon created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating coupon", success: false },
      { status: 500 }
    );
  }
}
