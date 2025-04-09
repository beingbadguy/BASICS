import { databaseConnection } from "@/config/databseConnection";
import Wishlist from "@/models/wishlist.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";

export async function GET(request: NextRequest) {
  await databaseConnection();
  try {
    const decoded = await fetchTokenDetails(request);
    const user = await User.findOne({ _id: decoded?.userId });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    const wishlist = await Wishlist.findOne({
      userId: decoded?.userId,
    }).populate("products.productId");
    if (!wishlist) {
      return NextResponse.json(
        { message: "Wishlist not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        wishlist: wishlist,
        success: true,
        message: "Wishlist fetched Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching wishlist" },
      { status: 500 }
    );
  }
}
