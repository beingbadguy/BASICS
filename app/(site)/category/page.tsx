"use client";
import ShopByCategory from "@/components/ShopByCategory";

import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  return (
    <div className="m-4 min-h-[70vh]">
      <div className="text-sm text-gray-500 mb-4">
        <span
          className="cursor-pointer hover:text-purple-600"
          onClick={() => router.push("/")}
        >
          Home
        </span>{" "}
        /{" "}
        <span className="cursor-pointer hover:text-purple-600">Categories</span>{" "}
      </div>
      <div>
        <ShopByCategory />
      </div>
    </div>
  );
};

export default Page;
