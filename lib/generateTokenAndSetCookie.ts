import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const generateTokenAndSetCookie = async (
  userId: string,
  isVerified: boolean,
  response: NextResponse
) => {
  const token = jwt.sign({ userId, isVerified }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  response.cookies.set("nextToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });
};
