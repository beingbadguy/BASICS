"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Category {
  _id: string;
  name: string;
  categoryImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ShopByCategory = () => {
  const [catLoading, setCatLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const response = await axios.get("/api/category");
      console.log(response.data);
      setCategories(response.data.categories);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setCatLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div>
      <h2 className="text-2xl">Shop By Category</h2>
      {catLoading && (
        <p className="flex w-full items-center justify-center h-20">
          <AiOutlineLoading3Quarters className="animate-spin text-purple-700" />
        </p>
      )}
      <ul className="my-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-center gap-4 flex-col mt-2"
          >
            <div className="size-32 md:size-42 rounded-full bg-gray-300 flex items-center justify-center   border-purple-100 border hover:scale-90 transition-all duration-300 overflow-hidden cursor-pointer p-2">
              <Image
                src={category.categoryImage}
                alt={category.name}
                className="object-cover "
              />
            </div>
            <li className="hover:underline cursor-pointer">{category.name}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ShopByCategory;
