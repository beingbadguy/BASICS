import { replyToUser } from "@/services/sendMail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, name, response } = await request.json();
    if (!email || !name || !response) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }
    await replyToUser(email, name, response);

    return NextResponse.json(
      { message: "Response sent successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error sending response", success: false },
      { status: 500 }
    );
  }
}
