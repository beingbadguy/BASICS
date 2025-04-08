import Image from "next/image";
import React from "react";

const BannerWall = () => {
  return (
    <div>
      <Image
        src="https://images.unsplash.com/vector-1741700243977-55dc0f315e1b?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="banner"
        className="w-full object-cover h-[300px] rounded-md"
        width={1000}
        height={200}
      />
    </div>
  );
};

export default BannerWall;
