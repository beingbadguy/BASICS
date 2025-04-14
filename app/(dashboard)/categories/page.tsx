"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/store";
import axios, { AxiosError } from "axios";
import { Eraser, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Category {
  _id: string;
  name: string;
  categoryImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const Page = () => {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const router = useRouter();
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/category");
      // console.log(response.data);
      setCategories(response.data.categories);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  const searchedProducts = categories.filter((cat) => {
    return cat.name.toLowerCase().includes(query.toLowerCase());
  });
  const deleteHandler = async (id: string) => {
    // console.log(id);
    try {
      await axios.delete(`/api/category/${id}`);
      // console.log(response.data);
      fetchCategories();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };
  // console.log(searchedProducts);
  useEffect(() => {
    fetchCategories();
    if (!user) {
      router.push("/login");
    }
  }, []);
  return (
    <div className="mt-2 overflow-y-scroll max-h-[90vh] pt-20 pb-20 md:pt-0 md:mb-0">
      <div className="flex items-start justify-start flex-col md:items-center md:justify-between md:flex-row gap-2">
        <h1 className="font-bold text-2xl text-purple-700">Categories</h1>
        <div className="flex items-center  justify-between md:justify-center w-full md:w-auto gap-2 my-2 md:my-0">
          <div className="flex items-center  gap-2 px-3 py-[6px] rounded border border-purple-700">
            <Search className="text-purple-700" />
            <input
              type="text"
              placeholder="Shoes"
              className="outline-none w-full"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
          <Link href={"/addcategory"}>
            {" "}
            <Button className="cursor-pointer">
              <Plus /> Add Category
            </Button>
          </Link>
        </div>
      </div>
      <div
        className={` mt-4 ${
          loading ? "flex items-center justify-center h-screen" : ""
        } `}
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-purple-700" />
        ) : query.length > 1 ? (
          searchedProducts.map((category, index) => (
            <div
              key={index}
              className={` ${
                index % 2 == 0 ? "bg-gray-100" : ""
              } flex items-center justify-between gap-1 mt-2 px-2 rounded py-2`}
            >
              <p>{index + 1}.</p>
              <h1>{category.name}</h1>
              <Image
                src={category.categoryImage}
                alt={category.name}
                width={100}
                height={100}
                className="rounded size-32 object-contain"
              />
              <div className="flex items-center gap-2">
                <Trash2 className="text-red-500" />
                <Eraser className="text-purple-700" />
              </div>
            </div>
          ))
        ) : categories?.length == 0 ? (
          "No Categories found"
        ) : (
          categories.map((category, index) => (
            <div
              key={index}
              className={` ${
                index % 2 == 0 ? "bg-gray-100" : ""
              } flex items-center justify-between gap-1 mt-2 px-2 rounded py-2`}
            >
              <p>{index + 1}.</p>
              <h1>{category.name}</h1>
              <Image
                src={category.categoryImage}
                alt={category.name}
                width={100}
                height={100}
                className="rounded size-32 object-contain"
              />
              <div className="flex items-center gap-4 mr-4">
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    deleteHandler(category._id);
                  }}
                />
                <Eraser className="text-purple-700 cursor-pointer" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
