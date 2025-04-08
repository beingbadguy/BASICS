"use client";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
type Products = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  image: string;
  discountPercentage: number;
};

const NewArrivals = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/product");
      console.log(response.data);

      setProducts(response.data.products);
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

  useEffect(() => {
    fetchAllProducts();
  }, []);
  return (
    <div className="my-4">
      <h2 className="text-2xl">New Arrivals</h2>
      <ul className="my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {loading && (
          <p className="flex w-full items-center justify-center h-20">
            <AiOutlineLoading3Quarters className="animate-spin text-purple-700" />
          </p>
        )}
        {products &&
          products.map((product) => (
            <div
              key={product._id}
              className=" h-64 w-42 sm:w-52 md:size-64 rounded  bg-gray-100 flex items-start justify-center  border-purple-100 border hover:scale-90 transition-all duration-300 overflow-hidden cursor-pointer p-2 flex-col relative"
            >
              <div className="flex items-center justify-between w-full">
                <div className="my-2 text-sm bg-purple-700 px-2 py-1 text-white rounded-md">
                  {Math.floor(product.discountPercentage)}% Off
                </div>
                <div className="bg-gray-100 p-1 rounded-full ">
                  <CiHeart className="text-black text-3xl" />
                </div>
              </div>
              <Image
                src={product.image}
                alt={product.title}
                className="object-contain size-36 w-full text-center  p-2 rounded"
              />

              <h3 className="font-bold mt-4">{product.title}</h3>
              <div className="flex items-center gap-4">
                <p className="text-red-500 line-through">₹{product.price}</p>
                <p className="text-purple-700">₹{product.discountedPrice}</p>
              </div>
            </div>
          ))}
      </ul>
    </div>
  );
};

export default NewArrivals;
