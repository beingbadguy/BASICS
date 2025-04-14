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
    // .populate({
    //   path: "cart",
    //   populate: {
    //     path: "products.productId",
    //     model: "Product",
    //   },
    // });
    return NextResponse.json(
      { success: true, message: "Users fetched successfully", users },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching users:", error.message);
    } else {
      console.error("Unknown error fetching users:", error);
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
