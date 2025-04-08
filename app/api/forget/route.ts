import { NextRequest, NextResponse } from "next/server";
import { databaseConnection } from "@/config/databseConnection";
import User from "@/models/user.model";
import crypto from "crypto";
import { forgetPasswordMail } from "@/services/sendMail";

export async function POST(request: NextRequest) {
  await databaseConnection();
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Rate Limiting Logic
    const now = new Date();
    const lastRequest = user.lastResetRequest
      ? new Date(user.lastResetRequest)
      : null;

    if (lastRequest) {
      const diffInHours =
        (now.getTime() - lastRequest.getTime()) / (1000 * 60 * 60); // Convert ms to hours
      if (diffInHours >= 24) {
        user.resetRequestCount = 0; // Reset count if 24 hours have passed
      }
    }

    if (user.resetRequestCount >= 3) {
      return NextResponse.json(
        { success: false, message: "You can only request 3 times per day." },
        { status: 429 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = Date.now() + 60 * 60 * 24 * 1000;
    user.forgetToken = verificationToken;
    user.forgetTokenExpiry = verificationTokenExpiry;
    user.lastResetRequest = now;
    user.resetRequestCount += 1;
    await user.save();

    // Send reset email
    forgetPasswordMail(user.email, verificationToken);

    return NextResponse.json({
      success: true,
      message: "Reset link sent to your email.",
    });
  } catch (error) {
    console.error("Error in password reset request:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
