"use client";
import { useAuthStore } from "@/store/store";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { VscLoading } from "react-icons/vsc";

type Product = {
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
  category: string;
};
type WishlistItemFlexible = {
  productId: string | { _id: string };
};

const Page = () => {
  const { addToWishlist, user } = useAuthStore();

  const { name } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [fullProducts, setFullProducts] = React.useState<Product[]>([]);
  const router = useRouter();

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/product");
      setFullProducts(response.data.products);
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

  const filteredProducts = fullProducts.filter(
    (product) => product.category === name
  );

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
    window.scrollTo(0, 0);
  }, [name]);

  if (loading) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center">
        <VscLoading className="animate-spin text-purple-700 text-2xl" />
      </div>
    );
  }

  return (
    <div className=" p-4 min-h-[75vh]">
      <div className="text-sm text-gray-500 mb-4">
        <span
          className="cursor-pointer hover:text-purple-600"
          onClick={() => router.push("/")}
        >
          Home
        </span>{" "}
        /{" "}
        <span
          className="cursor-pointer hover:text-purple-600"
          onClick={() => router.push("/category")}
        >
          Categories
        </span>{" "}
        <span>/</span>
        <span className="text-black">
          {" "}
          {decodeURIComponent(name as string)}
        </span>
      </div>
      <div className="text-sm"> {filteredProducts?.length} Products found.</div>
      <div className="my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredProducts &&
          filteredProducts.map((product) => (
            <div key={product._id}>
              <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-4 items-center justify-between w-full cursor-pointer">
                {/* Top: Discount & Wishlist */}
                <div className="flex items-center justify-between w-full">
                  <div className="text-xs bg-purple-700 px-2 py-1 text-white rounded-md">
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
                      <IoMdHeart className="text-red-500 text-2xl" />
                    ) : (
                      <CiHeart className="text-black text-2xl hover:text-red-500" />
                    )}
                  </div>
                </div>

                {/* Image */}
                <div
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="w-full flex items-center justify-center h-40 rounded-md overflow-hidden"
                >
                  <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.title}
                    width={160}
                    height={160}
                    className="object-cover h-full w-full rounded-md hover:scale-110 duration-300 transition-all ease-in-out"
                  />
                </div>

                {/* Title & Price */}
                <div
                  className="w-full text-center"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  <h2 className="text-md font-semibold truncate">
                    {product.title}
                  </h2>

                  <div className="mt-1">
                    <p className="text-purple-700 font-bold text-md">
                      ₹{product.discountedPrice}
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.price}
                      </span>
                    </p>
                    <p className="text-xs text-green-600">
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;
