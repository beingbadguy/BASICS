import Link from "next/link";
import React from "react";
import { TbWorldShare } from "react-icons/tb";

const DashboardNavbar = () => {
  return (
    <div className="fixed top-0 left-0 md:static w-full  py-2 px-4 border-b-1 border-gray-300 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <p className="size-14 rounded-full border border-gray-500 flex items-center justify-center text-purple-700">
            A
          </p>
          <div>
            <p className="text-black text-sm md:text-md">Aman Kumar</p>
            <p className="text-black italic text-sm md:text-md">
              authorisedaman@gmail.com
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
