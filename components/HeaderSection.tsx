"use client";

import {
  AlignJustify,
  Heart,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const HeaderSection = () => {
  const [menu, setMenu] = useState<boolean>(false);
  return (
    <div className="">
      <div className="text-[10px] bg-black text-white w-full text-center sm:text-[12px] py-2 ">
        Special offer: 15% off on the first purchase
      </div>
      <nav className="flex items-center justify-between p-4 border-b border-gray-300 ">
        <div className="font-bold">BASICS</div>
        <div
          className={` ${
            menu ? "translate-x-0" : "-translate-x-[100%]"
          } lg:translate-x-0 duration-300 transition-all absolute top-0 left-0 flex-col w-full h-screen bg-white gap-2 p-4  lg:p-0  flex lg:static lg:bg-transparent  lg:flex-row lg:w-auto lg:h-auto lg:items-center lg:justify-center lg:gap-8 z-[999]`}
        >
          <p
            className=" absolute top-4 right-4  lg:hidden border border-gray-300 rounded text-gray-600"
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
            Categories
          </p>
          <p
            className="cursor-pointer hover:text-purple-700"
            onClick={() => {
              setMenu(false);
            }}
          >
            New Arrivals
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
          <Search />
          <Heart />
          <ShoppingBag />
          <UserRound />
          <div
            className="block lg:hidden"
            onClick={() => {
              setMenu(true);
            }}
          >
            <AlignJustify />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HeaderSection;
