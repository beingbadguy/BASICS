import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const OverlapCards = () => {
  const images = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2599&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1522273400909-fd1a8f77637e?q=80&w=2612&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1612188842101-f976582906fc?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1640890959827-6307611b34a1?q=80&w=2727&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <div className="flex relative my-5">
      {images.map((image, index) => {
        return (
          <div
            key={index}
            style={{
              width: "25%",
              height: "auto",
              transform: `rotate(${index * 3 - 7}deg)`,
            }}
            className={`rotate-[${index}deg] transform size-10   lg:-ml-10 relative`}
          >
            <Button
              className={`${index == 0 || index == 4 ? "" : "hidden"} ${
                index == 0 ? "bg-red-500" : ""
              } absolute -top-7 rounded-2xl `}
            >
              {index == 0 ? "Shoes" : "Desktop"}
            </Button>
            <Image
              src={image}
              alt={index.toString()}
              width="300"
              height="300"
              className="size-32  md:size-48 object-cover rounded-xl mt-7"
            />
          </div>
        );
      })}
    </div>
  );
};

export default OverlapCards;
