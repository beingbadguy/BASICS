import { NextRequest, NextResponse } from "next/server";
import { databaseConnection } from "@/config/databseConnection";
import User from "@/models/user.model";
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";

export async function PUT(request: NextRequest) {
  await databaseConnection();
  try {
    const decoded = await fetchTokenDetails(request);
    const { address, phone } = await request.json();
    const user = await User.findOne({ _id: decoded?.userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    user.address = address;
    user.phone = phone;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Users updated successfully", user: user },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
