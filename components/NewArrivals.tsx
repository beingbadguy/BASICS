"use client";
import { useAuthStore } from "@/store/store";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";

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
type WishlistItemFlexible = {
  productId: string | { _id: string };
};
const NewArrivals = () => {
  const { addToWishlist, user } = useAuthStore();
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/product");
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

  const allProductsOfWishlist = user?.wishlist?.[0]?.products || [];
  const alreadyInWishlist = (id: string) => {
    return allProductsOfWishlist.some((item: WishlistItemFlexible) => {
      if (typeof item.productId === "string") {
        return item.productId === id;
      } else {
        return item.productId._id === id;
      }
    });
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="my-4">
      <h2 className="text-2xl">New Arrivals</h2>
      <ul className="my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {loading && (
          <p className="flex w-full items-center justify-center h-20 col-span-full">
            <AiOutlineLoading3Quarters className="animate-spin text-purple-700 text-2xl" />
          </p>
        )}

        {!loading && products.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No new arrivals found.
          </p>
        )}

        {!loading &&
          products.map((product) => (
            <div
              key={product._id}
              className="min-h-64 min-w-42 sm:min-w-52 md:min-size-64 rounded bg-gray-100 flex flex-col items-start justify-center border border-purple-100 transition-all duration-300 overflow-hidden cursor-pointer p-2 relative"
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className="my-2 text-sm bg-purple-700 px-2 py-1 text-white rounded-md"
                  onClick={() => {
                    alert(product._id);
                  }}
                >
                  {Math.floor(product.discountPercentage)}% Off
                </div>
                <div
                  className="bg-gray-100 p-1 rounded-full cursor-pointer"
                  onClick={() => {
                    if (!user) {
                      return router.push("/login");
                    } else {
                      addToWishlist(product._id);
                    }
                  }}
                >
                  {user && alreadyInWishlist(product._id) ? (
                    <IoMdHeart className="text-red-500 text-3xl" />
                  ) : (
                    <CiHeart className="text-black text-3xl hover:text-red-500" />
                  )}
                </div>
              </div>

              <Image
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
                onClick={() => router.push(`/product/${product._id}`)}
                className="object-contain size-36 hover:scale-90 transition-all duration-300 w-full text-center p-2 rounded"
              />

              <h3
                className="font-bold mt-4"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                {product.title}
              </h3>

              <div
                className="flex items-center gap-4"
                onClick={() => router.push(`/product/${product._id}`)}
              >
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
