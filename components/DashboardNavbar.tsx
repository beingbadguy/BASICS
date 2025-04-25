"use client";
import { useDashboardStore } from "@/store/dashboard";
import { useAuthStore } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { TbWorldShare } from "react-icons/tb";
import { Skeleton } from "./ui/skeleton";

const DashboardNavbar = () => {
  const { user } = useAuthStore();
  const {
    fetchUsers,
    fetchOrders,
    fetchProducts,
    fetchCategories,
    fetchQueries,
    fetchNewsletters,
  } = useDashboardStore();

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchProducts();
    fetchCategories();
    fetchQueries();
    fetchNewsletters();
    // if (!user) {
    //   router.push("/login");
    // }
  }, []);

  if (!user) {
    return (
      <div className="min-h-8 w-full py-2 flex items-center justify-between gap-2 px-4 border-b">
        <div className="flex items-center gap-2 ">
          <Skeleton className="size-14 rounded-full" />
          <div>
            <Skeleton className="w-40 h-4 rounded" />
            <Skeleton className="w-40 h-4 rounded mt-2" />
          </div>
        </div>
        <div>
          <Skeleton className="size-14 rounded-full" />
        </div>
        {/* <VscLoading className="animate-spin text-purple-700 text-xl" /> */}
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 md:static w-full  py-2 px-4 border-b-1 border-gray-300 bg-white z-[99999]">
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
