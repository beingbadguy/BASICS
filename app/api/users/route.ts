import { NextResponse } from "next/server";
import { databaseConnection } from "@/config/databseConnection";
import User from "@/models/user.model";

export async function GET() {
  await databaseConnection();
  try {
    const users = await User.find({}).populate({
      path: "wishlist",
      populate: {
        path: "products.productId",
        model: "Product",
      },
    });
    return NextResponse.json(
      { success: true, message: "Users fetched successfully", users },
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
