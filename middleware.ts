import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null; // Invalid or expired token
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("basics")?.value || "";

  // Public routes (user shouldn't be redirected if logged in)
  const restrictedForLoggedIn = [
    "/login",
    "/signup",
    "/confirm",
    "/forget",
    "/reset",
  ];

  // Protected routes (only accessible if logged in)
  const protectedRoutes = [
    "/profile",
    "/cart",
    "/checkout",
    "/orders",
    "/wishlist",
    "/successfull",
  ];
  const onlyForAdmins = [
    "/dashboard",
    "/orders",
    "/customers",
    "/settings",
    "/products",
    "/categories",
    "/addproduct",
    "/addcategory",
    "/editproduct",
    "/editcategory",
  ];

  if (!token) {
    // If no token, restrict access to protected routes
    if (protectedRoutes.includes(path)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Verify JWT with `jose`
  const decoded = await verifyJWT(token);

  if (!decoded) {
    // If JWT is invalid or expired, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("basics");
    return response;
  }

  // Redirect already logged-in users away from auth pages
  if (restrictedForLoggedIn.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const isAdmin = decoded.role === "admin";

  if (onlyForAdmins.some((route) => path.startsWith(route)) && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// ✅ Works on Vercel Edge Runtime!
export const config = {
  matcher: [
    "/",
    "/about",
    "/login",
    "/profile",
    "/cart",
    "/checkout",
    "/orders",
    "/wishlist",
    "/successfull",
    "/signup",
    "/confirm",
    "/forget",
    "/reset",
    "/verify",
    "/dashboard",
    "/orders",
    "/customers",
    "/settings",
    "/products",
    "/categories",
    "/addproduct",
    "/addcategory",
    "/editproduct/:id",
    "/editcategory/:id",
    "/product/:id",
    "/category/:id",
  ],
};
