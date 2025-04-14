import { databaseConnection } from "@/config/databseConnection";
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  await databaseConnection();
  try {
    const decodedToken = await fetchTokenDetails(request);
    if (!decodedToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }
    // const user = await User.findById(decodedToken.userId)
    const user = await User.findById(decodedToken.userId)
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
      })
      .populate({
        path: "order",
        populate: {
          path: "products.productId",
          model: "Product",
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    user.password = undefined;
    user.pass = undefined;
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch me",
      },
      { status: 500 }
    );
  }
}
