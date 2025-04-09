"use client";
import { useAuthStore } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TbWorldShare } from "react-icons/tb";
import { VscLoading } from "react-icons/vsc";

const DashboardNavbar = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-20 w-full mt-6 flex ictems-center justify-center">
        <VscLoading className="animate-spin text-purple-700 text-xl" />
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 md:static w-full  py-2 px-4 border-b-1 border-gray-300 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <div className="size-14 rounded-full border border-gray-500 flex items-center justify-center text-purple-700 overflow-hidden">
            <Image
              src={user?.image || ""}
              alt="user"
              width={40}
              height={40}
              className="rounded-full size-full object-cover"
            />
          </div>
          <div>
            <p className="text-black text-sm md:text-md">{user?.name}</p>
            <p className="text-black italic text-sm md:text-md">
              {user?.email}
            </p>
          </div>
        </div>
        <div>
          <Link href="/">
            <TbWorldShare className="text-3xl cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
