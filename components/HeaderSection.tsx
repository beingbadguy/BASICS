"use client";

import { useAuthStore } from "@/store/store";
import {
  AlignJustify,
  Heart,
  LayoutDashboard,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const HeaderSection = () => {
  const { user, fetchUser, userCart } = useAuthStore();

  const [totalNumberOfProducts, setTotalNumberOfProducts] = useState(0);

  const [menu, setMenu] = useState<boolean>(false);
  const router = useRouter();

  if (userCart) {
    console.log(userCart.products);
  }

  useEffect(() => {
    if (userCart?.products?.length) {
      setTotalNumberOfProducts(userCart?.products.length);
    } else {
      setTotalNumberOfProducts(0);
    }
  }, [userCart]);

  
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  return (
    <div className="">
      <div className="text-[10px] bg-black text-white w-full text-center sm:text-[12px] py-2 ">
        Special offer: 15% off on the first purchase
      </div>
      <nav className="flex items-center justify-between p-4 border-b border-gray-300 ">
        <div className="font-bold">
          <Link href={"/"}>BASICS</Link>
        </div>
        <div
          className={` ${
            menu ? "translate-x-0" : "-translate-x-[100%]"
          } lg:translate-x-0 duration-300 transition-all absolute top-0 left-0 flex-col w-full h-screen bg-white gap-2 p-4  lg:p-0  flex lg:static lg:bg-transparent  lg:flex-row lg:w-auto lg:h-auto lg:items-center lg:justify-center lg:gap-8 z-[999]`}
        >
          <p
            className=" absolute top-4 right-4  lg:hidden cursor-pointer   rounded text-gray-600"
            onClick={() => {
              setMenu(false);
            }}
          >
            <X />
          </p>
          <p
            className="cursor-pointer hover:text-purple-700"
            onClick={() => {
              setMenu(false);
            }}
          >
            <Link href={"/"}>Home</Link>
          </p>
          <p
            className="cursor-pointer hover:text-purple-700"
            onClick={() => {
              setMenu(false);
            }}
          >
            <Link href={"/category"}>Categories</Link>
          </p>
          <p
            className="cursor-pointer hover:text-purple-700"
            onClick={() => {
              setMenu(false);
            }}
          >
            <Link href={"/newarrivals"}>New Arrivals</Link>
          </p>
          <p
            className="cursor-pointer hover:text-purple-700"
            onClick={() => {
              setMenu(false);
            }}
          >
            Best Sellers
          </p>
          <p
            className="cursor-pointer hover:text-purple-700"
            onClick={() => {
              setMenu(false);
            }}
          >
            Track Order
          </p>
          <p
            className="cursor-pointer hover:text-purple-700"
            onClick={() => {
              setMenu(false);
            }}
          >
            Contact
          </p>
        </div>
        <div className="flex items-center justify-center gap-5">
          <Search
            className="cursor-pointer"
            onClick={() => {
              router.push("/search");
            }}
          />
          <Heart
            className="cursor-pointer"
            onClick={() => {
              if (user) {
                router.push("/wishlist");
              } else {
                router.push("/login");
              }
            }}
          />

          <div
            className="cursor-pointer relative"
            onClick={() => {
              if (user) {
                router.push("/cart");
              } else {
                router.push("/login");
              }
            }}
          >
            <ShoppingBag />
            <p className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full size-6 flex items-center text-sm justify-center">
              {totalNumberOfProducts}
            </p>
          </div>

          <UserRound
            className="cursor-pointer"
            onClick={() => {
              if (user) {
                router.push("/profile");
              } else {
                router.push("/login");
              }
            }}
          />
          {user && user.role === "admin" ? (
            <LayoutDashboard
              className={`${
                user?.role === "admin" ? "" : "hidden"
              } cursor-pointer ${user ? "" : "hidden"}`}
              onClick={() => {
                if (!user) {
                  router.push("/login");
                  console.log("not logged in");
                } else {
                  if (user.role === "admin") {
                    router.push("/dashboard");
                    console.log("admin");
                  }
                }
              }}
            />
          ) : (
            ""
          )}
          <div
            className="block lg:hidden cursor-pointer"
            onClick={() => {
              setMenu(true);
            }}
          >
            <AlignJustify className="cursor-pointer" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HeaderSection;
