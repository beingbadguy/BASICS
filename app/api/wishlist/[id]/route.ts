import { databaseConnection } from "@/config/databseConnection";
import Wishlist from "@/models/wishlist.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";

interface WishlistProduct {
  _id: string;
  productId: {
    _id: string;
    title: string;
    description: string;
    price: number;
    discountedPrice: number;
    countInStock: number;
    rating: number;
    numReviews: number;
    image: string;
    discountPercentage: number;
    isActive: boolean;
    category: string;
  };
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  databaseConnection();
  try {
    const decoded = await fetchTokenDetails(request);
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { message: "Product id is required", success: false },
        { status: 400 }
      );
    }
    const user = await User.findOne({ _id: decoded?.userId });
    const wishlist = await Wishlist.findOne({ userId: decoded?.userId });
    if (!wishlist) {
      const newWishlist = new Wishlist({
        userId: decoded?.userId,
        products: {
          productId: id,
        },
      });
      user.wishlist.push(newWishlist);
      await newWishlist.save();
      await user.save();

      return NextResponse.json({ message: "Product added to wishlist" });
    } else {
      const product = wishlist.products.find(
        (product: WishlistProduct) => product.productId.toString() === id
      );
      if (product) {
        return NextResponse.json({ message: "Product already in wishlist" });
      }

      wishlist.products.push({
        productId: id,
      });
      await wishlist.save();

      return NextResponse.json({ message: "Product added to wishlist" });
    }

    // return NextResponse.json(
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching product", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  databaseConnection();
  try {
    const decoded = await fetchTokenDetails(request);
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { message: "Product id is required", success: false },
        { status: 400 }
      );
    }
    // const user = await User.findOne({ _id: userId });
    const wishlist = await Wishlist.findOne({ userId: decoded?.userId });
    if (!wishlist) {
      return NextResponse.json({ message: "Product not found." });
    } else {
      wishlist.products = wishlist.products.filter(
        (product: WishlistProduct) => product.productId.toString() !== id
      );
      await wishlist.save();
      return NextResponse.json({ message: "Product removed from wishlist" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching product", success: false },
      { status: 500 }
    );
  }
}
