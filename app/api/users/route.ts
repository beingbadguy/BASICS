import { NextResponse } from "next/server";
import { databaseConnection } from "@/config/databseConnection";
import User from "@/models/user.model";
import "@/models/wishlist.model";
import "@/models/product.model";
import "@/models/category.model";
import "@/models/cart.model";
import "@/models/order.model";
import "@/models/coupon.model";
import "@/models/contact.model";
import "@/models/newsletter.model";
import "@/models/user.model";
import "@/models/promo.model";

export async function GET() {
  await databaseConnection();

  try {
    const users = await User.find({})
      .sort({ createdAt: -1 }) // optional: most recent users first
      .populate({
        path: "wishlist",
        populate: {
          path: "products.productId",
          model: "Product",
        },
      })
      .populate({
        path: "cart",
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
    console.error("Error fetching users:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
