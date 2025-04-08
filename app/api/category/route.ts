import { cloudinaryConnection } from "@/config/cloudinaryConnection";
import { databaseConnection } from "@/config/databseConnection";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function POST(request: NextRequest) {
  databaseConnection();
  cloudinaryConnection();
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const categoryImage = formData.get("image") as File;

    if (!name || !categoryImage) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    const categoryAlreadyExists = await Category.findOne({ name: name });
    if (categoryAlreadyExists) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 }
      );
    }
    // needed to upload file
    const arrayBuffer = await categoryImage.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const dataURI = `data:${categoryImage.type};base64,${base64String}`;

    const categoryImageResponse = await cloudinary.v2.uploader.upload(dataURI, {
      folder: "basicscategory",
    });

    const category = await Category.create({
      name: name,
      categoryImage: categoryImageResponse.secure_url,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        category: category,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  databaseConnection();
  try {
    const categories = await Category.find();
    return NextResponse.json(
      {
        success: true,
        message: "Categories fetched successfully",
        categories: categories,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get categories",
      },
      {
        status: 500,
      }
    );
  }
}
