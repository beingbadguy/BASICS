import { databaseConnection } from "@/config/databseConnection";
import Category from "@/models/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  databaseConnection();
  try {
    const { id } = await context.params;
    console.log(id);
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Category id is required",
        },
        {
          status: 400,
        }
      );
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
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
        message: "Failed to delete category",
      },
      {
        status: 500,
      }
    );
  }
}

// FIXME: single category update
