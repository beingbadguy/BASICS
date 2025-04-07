import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

interface DecodeType {
  userId: string;
}

export async function fetchTokenDetails(request: NextRequest) {
  try {
    const token = request.cookies.get("nextToken")?.value;
    if (!token) return null; // No token found

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodeType;

    return decoded || null;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null; // Return null instead of a response
  }
}
