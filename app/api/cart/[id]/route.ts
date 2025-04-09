import { databaseConnection } from "@/config/databseConnection";
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";
import Cart from "@/models/cart.model";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

type Product = {
  productId: string;
  quantity: number;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await databaseConnection();
  try {
    const { id } = await context.params;
    const decoded = await fetchTokenDetails(request);
    if (!id) {
      return NextResponse.json(
        { message: "Product id is required", success: false },
        { status: 400 }
      );
    }
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }
    const user = await User.findById(decoded?.userId);
    const cart = await Cart.findOne({ userId: decoded?.userId });
    if (!cart) {
      const newCart = new Cart({
        userId: decoded?.userId,
        products: [
          {
            productId: id,
            quantity: 1,
          },
        ],
      });
      await newCart.save();
      user.cart.push(newCart._id);
      await user.save();

      return NextResponse.json({ message: "Product added to cart" });
    } else {
      const productAlreadyExists = cart.products.find((product: Product) => {
        return product.productId.toString() === id;
      });

      if (productAlreadyExists) {
        productAlreadyExists.quantity++;
        await cart.save();

        return NextResponse.json({ message: "Product already in cart" });
      } else {
        cart.products.push({ productId: id, quantity: 1 });
        await cart.save();
        return NextResponse.json({ message: "Product added to cart" });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching product", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await databaseConnection();
  try {
    const decoded = await fetchTokenDetails(request);
    const { id } = await context.params;
    const { quantity } = await request.json();
    const cart = await Cart.findOne({ userId: decoded?.userId });
    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found", success: false },
        { status: 404 }
      );
    }
    const product = cart.products.find((product: Product) => {
      return product.productId.toString() === id;
    });
    product.quantity = quantity;
    await cart.save();
    return NextResponse.json({ cart, success: true, message: "Cart updated" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching cart", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await databaseConnection();
  try {
    const decoded = await fetchTokenDetails(request);
    const { id } = await context.params;
    const cart = await Cart.findOne({ userId: decoded?.userId });
    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found", success: false },
        { status: 404 }
      );
    }
    cart.products = cart.products.filter((product: Product) => {
      return product.productId.toString() !== id;
    });
    await cart.save();
    return NextResponse.json({ cart, success: true, message: "Cart updated" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching cart", success: false },
      { status: 500 }
    );
  }
}
