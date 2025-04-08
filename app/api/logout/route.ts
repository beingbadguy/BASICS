import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true,
    });

    // Properly setting an expired cookie to remove it
    response.cookies.set("basics", "", {
      httpOnly: true,
      expires: new Date(0), // Expire the cookie
      path: "/", // Ensure it covers the whole app
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Unable to logout",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
