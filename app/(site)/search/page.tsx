"use client";
import { useAuthStore } from "@/store/store";
import axios, { AxiosError } from "axios";
import { Search } from "lucide-react";
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

const Page = () => {
  const { user, addToWishlist } = useAuthStore();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/product");
      // console.log(response.data);

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

  type WishlistItemFlexible = {
    productId: string | { _id: string };
  };
  const alreadyInWishlist = (id: string) => {
    return allProductsOfWishlist.some((item: WishlistItemFlexible) => {
      if (typeof item.productId === "string") {
        return item.productId === id;
      } else {
        return item.productId._id === id;
      }
    });
  };

  const searchedProducts = products.filter((product) => {
    return product.title.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div
        className={` flex items-center justify-center flex-col transition-all duration-300 ${
          query.length > 0 ? "" : "h-[50vh]"
        } `}
      >
        <h1
          className={`${
            query.length > 0 ? "hidden" : "block"
          }  my-2 text-3xl text-center w-full mx-4 md:text-4xl`}
        >
          What do you want today?
        </h1>
        <div className="flex items-center gap-2 border border-black my-6 w-[90%] md:w-[50%] rounded">
          <input
            type="text"
            className="w-full  py-2 border-none outline-none ml-2"
            placeholder="search anything..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Search className="mr-2" />
        </div>
      </div>
      {/* //all the products */}

      <div>
        {query.length > 0 ? (
          <div className="p-4  w-full">
            <h1 className="font-bold md:text-2xl">
              Searched Products for &quot;{query}&quot;
            </h1>
            <ul className="my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 w-full">
              {loading && (
                <p className="flex w-full items-center justify-center h-20">
                  <AiOutlineLoading3Quarters className="animate-spin text-purple-700" />
                </p>
              )}
              {searchedProducts.length > 0 ? (
                searchedProducts &&
                searchedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-purple-100 rounded-xl shadow-sm p-4 cursor-pointer flex flex-col relative"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs bg-purple-700 text-white px-2 py-1 rounded">
                        {Math.floor(product.discountPercentage)}% Off
                      </span>
                      <div
                        className="bg-gray-100 p-1 rounded-full"
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

                    <div className="overflow-hidden rounded-md">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="w-full h-40 object-cover rounded mb-2  transform transition-transform duration-300 hover:scale-110"
                        onClick={() => router.push(`/product/${product._id}`)}
                      />
                    </div>

                    <h3
                      className="font-semibold text-sm md:text-base mt-2"
                      onClick={() => router.push(`/product/${product._id}`)}
                    >
                      {product.title}
                    </h3>

                    <div
                      className="flex items-center justify-between mt-2"
                      onClick={() => router.push(`/product/${product._id}`)}
                    >
                      <p className="text-purple-700 font-semibold text-sm">
                        ₹{product.discountedPrice}
                      </p>
                      <p className="text-xs line-through text-red-500">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div>No products found.</div>
              )}
            </ul>
          </div>
        ) : (
          <div className="p-4 w-full">
            <h1 className="font-bold md:text-2xl">All Products</h1>
            <ul className="my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 w-full">
              {loading && (
                <p className="flex w-full items-center justify-center h-20">
                  <AiOutlineLoading3Quarters className="animate-spin text-purple-700" />
                </p>
              )}
              {products &&
                products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-purple-100 rounded-xl shadow-sm p-4 cursor-pointer  flex flex-col relative"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs bg-purple-700 text-white px-2 py-1 rounded">
                        {Math.floor(product.discountPercentage)}% Off
                      </span>
                      <div
                        className="bg-gray-100 p-1 rounded-full"
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

                    <div className="overflow-hidden rounded-md">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="w-full h-40 object-cover rounded mb-2  transform transition-transform duration-300 hover:scale-110"
                        onClick={() => router.push(`/product/${product._id}`)}
                      />
                    </div>

                    <h3
                      className="font-semibold text-sm md:text-base mt-2"
                      onClick={() => router.push(`/product/${product._id}`)}
                    >
                      {product.title}
                    </h3>

                    <div
                      className="flex items-center justify-between mt-2"
                      onClick={() => router.push(`/product/${product._id}`)}
                    >
                      <p className="text-purple-700 font-semibold text-sm">
                        ₹{product.discountedPrice}
                      </p>
                      <p className="text-xs line-through text-red-500">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
