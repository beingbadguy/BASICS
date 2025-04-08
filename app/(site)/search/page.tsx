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
                    className=" min-h-64 min-w-42 sm:min-w-52 md:size-64 rounded  bg-gray-100 flex items-start justify-center  border-purple-100 border hover:scale-90 transition-all duration-300 overflow-hidden cursor-pointer p-2 flex-col relative"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="my-2 text-sm bg-purple-700 px-2 py-1 text-white rounded-md">
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
                      onClick={() => {
                        router.push(`/product/${product._id}`);
                      }}
                      className="object-contain size-36 w-full text-center  p-2 rounded"
                    />

                    <h3
                      className="font-bold mt-4"
                      onClick={() => {
                        router.push(`/product/${product._id}`);
                      }}
                    >
                      {product.title}
                    </h3>
                    <div
                      className="flex items-center gap-4"
                      onClick={() => {
                        router.push(`/product/${product._id}`);
                      }}
                    >
                      <p className="text-red-500 line-through">
                        ₹{product.price}
                      </p>
                      <p className="text-purple-700">
                        ₹{product.discountedPrice}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div>No products found</div>
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
                    className=" min-h-64 min-w-42 sm:min-w-52 md:size-64 rounded  bg-gray-100 flex items-start justify-center  border-purple-100 border hover:scale-90 transition-all duration-300 overflow-hidden cursor-pointer p-2 flex-col relative"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="my-2 text-sm bg-purple-700 px-2 py-1 text-white rounded-md">
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
                      onClick={() => {
                        router.push(`/product/${product._id}`);
                      }}
                      className="object-contain size-36 w-full text-center  p-2 rounded"
                    />

                    <h3
                      className="font-bold mt-4"
                      onClick={() => {
                        router.push(`/product/${product._id}`);
                      }}
                    >
                      {product.title}
                    </h3>
                    <div
                      className="flex items-center gap-4"
                      onClick={() => {
                        router.push(`/product/${product._id}`);
                      }}
                    >
                      <p className="text-red-500 line-through">
                        ₹{product.price}
                      </p>
                      <p className="text-purple-700">
                        ₹{product.discountedPrice}
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
