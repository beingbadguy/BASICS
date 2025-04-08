import { NextResponse, NextRequest } from "next/server";
import { databaseConnection } from "@/config/databseConnection";
import User from "@/models/user.model";
import crypto from "crypto";
import { sendEmailVerificationMail } from "@/services/sendMail";

export async function POST(request: NextRequest) {
  await databaseConnection();
  try {
    const { email } = await request.json();
    console.log(email);
    if (!email) {
      return NextResponse.json(
        {
          message: "Please provide an email address",
          success: false,
        },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found with the given email address",
          success: false,
        },
        { status: 404 }
      );
    }
    const verificationToken = crypto.randomInt(100000, 999999).toString();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendEmailVerificationMail(user.email, verificationToken);
    return NextResponse.json(
      {
        message: "Verification email sent successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred", error);
    }
    return NextResponse.json(
      {
        message: "An error occurred while sending verification token",
        success: false,
      },
      { status: 500 }
    );
  }
}
