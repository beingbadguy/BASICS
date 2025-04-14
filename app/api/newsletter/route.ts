import { databaseConnection } from "@/config/databseConnection";
import Newsletter from "@/models/newsletter.mode";
import { newsletterSubscriptionMail } from "@/services/sendMail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await databaseConnection();
  try {
    const { email } = await request.json();
    console.log(email);
    if (!email) {
      return NextResponse.json(
        { message: "Email is required", success: false },
        { status: 400 }
      );
    }
    const newsletter = await Newsletter.findOne({ email });
    if (newsletter) {
      return NextResponse.json(
        { message: "Email already subscribed", success: false },
        { status: 404 }
      );
    }
    const newNewsletter = new Newsletter({ email });
    await newNewsletter.save();

    await newsletterSubscriptionMail(email);
    return NextResponse.json(
      {
        message: "Subscribed successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error subscribing to newsletter", success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  await databaseConnection();
  try {
    const newsletters = await Newsletter.find();
    return NextResponse.json(
      {
        success: true,
        message: "Newsletters fetched successfully",
        newsletters,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get newsletters",
      },
      { status: 500 }
    );
  }
}
