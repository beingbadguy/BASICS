"use client";
import { useDashboardStore } from "@/store/dashboard";
import { useAuthStore } from "@/store/store";
import {
  AlignVerticalJustifyEnd,
  Database,
  LayoutDashboard,
  LogOut,
  ScanBarcode,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardSidebar = () => {
  const { fetchUser, logout } = useAuthStore();
  const {
    fetchUsers,
    fetchOrders,
    fetchProducts,
    fetchCategories,
    fetchQueries,
    fetchNewsletters,
  } = useDashboardStore();
  const pathname = usePathname();
  const router = useRouter();
  const MenuBar = [
    { label: "Dashboard", path: "/dashboard", icons: <LayoutDashboard /> },
    { label: "Products", path: "/products", icons: <ShoppingBag /> },
    {
      label: "Categories",
      path: "/categories",
      icons: <AlignVerticalJustifyEnd />,
    },
    { label: "Orders", path: "/orders", icons: <ShoppingCart /> },
    { label: "Customers", path: "/customers", icons: <User /> },
    { label: "Support", path: "/support", icons: <ScanBarcode /> },
    { label: "Others", path: "/others", icons: <Database /> },
  ];

  useEffect(() => {
    fetchUser();
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

  return (
    <div className="fixed bg-white left-0 top-[93%] w-full  md:static p-2 md:p-4 border shadow-md md:min-h-screen flex items-center justify-between flex-col  md:w-48 z-[50]">
      <div>
        <div className="w-full hidden md:flex  items-center justify-center pt-1">
          <Image
            src="/basiclogo.png"
            alt="logo"
            width={100}
            height={100}
            className=""
          />
        </div>
        <div className="md:mt-8 flex items-start justify-start  md:flex-col gap-3 w-full">
          {MenuBar.map((item, index) => {
            const isActive = item.path === pathname;
            return (
              <Link href={item.path} key={index} className="w-full">
                <div
                  className={` ${
                    isActive
                      ? "bg-purple-700 text-white hover:bg-purple-700"
                      : ""
                  } flex items-start justify-start gap-2 hover:bg-gray-100 w-full  p-2 sm:px-4 sm:py-2 rounded-md cursor-pointer`}
                >
                  <p className=" text-[10px] md:text-auto">{item.icons}</p>
                  <p className="hidden md:block">{item.label}</p>
                  {/* <Link href={item.path}>{item.label}</Link> */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mb-4 hidden md:block">
        <div
          className="flex items-center justify-center gap-2 cursor-pointer border  px-4 py-2 text-black rounded hover:border-none"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <LogOut className="" />
          <p className="hidden md:block">Logout</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
