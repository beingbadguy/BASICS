"use client";
import {
  AlignVerticalJustifyEnd,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DashboardSidebar = () => {
  const pathname = usePathname();
  console.log(pathname);
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
    { label: "Settings", path: "/settings", icons: <Settings /> },
    // { label: "Logout", path: "/logout", icons: <LogOut /> },
  ];
  return (
    <div className="fixed bg-white left-0 top-[93%] w-full  md:static p-2 md:p-4 border shadow-md md:min-h-screen flex items-center justify-between flex-col  md:w-48 ">
      <div>
        <h1 className="font-bold w-full text-center text-lg hidden md:block">
          BASIC
        </h1>
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
        <Link href="/logout" className="flex items-center justify-center gap-2">
          <LogOut className="text-purple-700" />
          <p className="hidden md:block">Logout</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
