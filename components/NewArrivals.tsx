"use client";
import { useAuthStore } from "@/store/store";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiDiscount1, CiHeart } from "react-icons/ci";
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
    <div className="my-6">
      <h2 className="text-2xl  mb-4">New Arrivals</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-purple-600" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No new arrivals found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 flex flex-col justify-between"
            >
              {/* Badge & Wishlist */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                  <CiDiscount1 className="text-base" />
                  {Math.floor(product.discountPercentage)}% Off
                </div>

                <div
                  className="cursor-pointer p-1 rounded-full bg-white shadow"
                  onClick={() =>
                    user ? addToWishlist(product._id) : router.push("/login")
                  }
                >
                  {user && alreadyInWishlist(product._id) ? (
                    <IoMdHeart className="text-red-500 text-xl" />
                  ) : (
                    <CiHeart className="text-black text-xl hover:text-red-500" />
                  )}
                </div>
              </div>

              {/* Product Image */}
              <div
                className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-3 cursor-pointer"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform hover:scale-110"
                />
              </div>

              {/* Product Title */}
              <h3
                className="font-semibold text-sm md:text-base line-clamp-2 cursor-pointer mb-1"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                {product.title}
              </h3>

              {/* Pricing */}
              <div
                className="flex items-center gap-2 text-sm"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                <span className="text-red-500 line-through">
                  ₹{product.price}
                </span>
                <span className="text-purple-700 font-semibold">
                  ₹{product.discountedPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
