import { databaseConnection } from "@/config/databseConnection";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cloudinaryConnection } from "@/config/cloudinaryConnection";
import cloudinary from "cloudinary";
import { fetchTokenDetails } from "@/lib/fetchTokenDetails";

export async function PUT(request: NextRequest) {
  await databaseConnection();
  cloudinaryConnection();
  try {
    const decoded = await fetchTokenDetails(request);

    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { message: "Profile is required", sucess: false },
        { status: 200 }
      );
    }
    const user = await User.findById(decoded?.userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // needed to upload file
    const arrayBuffer = await image.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const dataURI = `data:${image.type};base64,${base64String}`;

    const profilePicture = await cloudinary.v2.uploader.upload(dataURI, {
      folder: "profilePicture",
    });

    user.image = profilePicture.secure_url;

    await user.save();

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        success: true,
        user: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error Changing Profile", success: false },
      { status: 500 }
    );
  }
}
