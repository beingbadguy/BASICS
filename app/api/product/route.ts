import { databaseConnection } from "@/config/databseConnection";
import Product from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";
import { cloudinaryConnection } from "@/config/cloudinaryConnection";
import cloudinary from "cloudinary";

export async function GET() {
  await databaseConnection();
  cloudinaryConnection();
  try {
    const products = await Product.find();
    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error fetching products",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await databaseConnection();
  cloudinaryConnection();
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as File;
    const category = formData.get("category") as string;
    const countInStock = formData.get("countInStock") as string;
    const discountedPrice = formData.get("discountedPrice") as string;

    if (
      !title ||
      !description ||
      !price ||
      !image ||
      !category ||
      !countInStock ||
      !discountedPrice
    ) {
      return NextResponse.json(
        { message: "All fields are required", sucess: false },
        { status: 200 }
      );
    }

    const discountPercentage =
      ((Number(price) - Number(discountedPrice)) / Number(price)) * 100;

    // needed to upload file
    const arrayBuffer = await image.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const dataURI = `data:${image.type};base64,${base64String}`;

    const productImageResponse = await cloudinary.v2.uploader.upload(dataURI, {
      folder: "basicsproduct",
    });

    const product = new Product({
      title,
      description,
      price,
      image: productImageResponse.secure_url,
      category,
      countInStock,
      discountedPrice,
      discountPercentage,
      isActive: true,
    });

    await product.save();

    return NextResponse.json(
      {
        message: "Product created successfully",
        success: true,
        product: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating product", success: false },
      { status: 500 }
    );
  }
}
