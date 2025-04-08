"use client";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Separator } from "@radix-ui/react-select";
import { CiHeart } from "react-icons/ci";
import { useAuthStore } from "@/store/store";
import { IoMdHeart } from "react-icons/io";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  countInStock: number;
  image: string;
  rating: number;
  numReviews: number;
  isActive: boolean;
  discountPercentage: number;
};

const ProductPage = () => {
  const { addToWishlist, user } = useAuthStore();

  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

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

  const fetchProductById = async () => {
    if (!id) {
      console.log("You must provide a product id.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`/api/product/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const similarProducts = products.filter((p) => p._id !== id);

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

  useEffect(() => {
    fetchProductById();
    fetchAllProducts();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-purple-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-purple-600" />
      </div>
    );
  }
  if (!id) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-4 py-6">
      {/* Breadcrumb */}
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
          onClick={() => router.push("/product")}
        >
          Products
        </span>{" "}
        / <span className="text-black">{product.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-10 mt-5">
        {/* Product Image */}
        <div className="flex-1 text-center w-full  flex items-center justify-center md:items-start md:justify-start relative">
          <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded">
            {Math.floor(product.discountPercentage)}% Off
          </div>
          <Image
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-xl object-contain size-64 md:size-72 ml-10"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2 text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={
                  i < product.rating ? "text-yellow-500" : "text-gray-300"
                }
              />
            ))}
            <span className="text-sm text-gray-600">
              ({product.numReviews} reviews)
            </span>
          </div>

          <p className="text-gray-700">{product.description}</p>
          <Separator className="my-4 w-full  bg-gray-400 border " />

          <div className="space-y-2">
            <p className="text-lg font-semibold text-green-600">
              ₹{product.discountedPrice.toLocaleString()}
              <span className="line-through text-sm text-gray-500 ml-2">
                ₹{product.price.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              {product.countInStock > 0 ? "In stock" : "Out of stock"}
            </p>
            <p className="text-sm">
              <span
                className={product.isActive ? "text-green-600" : "text-red-500"}
              >
                {product.isActive ? "" : "Out of stock"}
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded disabled:opacity-50 w-[300px] flex items-center justify-center gap-2 cursor-pointer"
              disabled={product.countInStock <= 0}
            >
              <MdShoppingCart className="text-lg" />
              Buy Now
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 cursor-pointer text-black border px-4 py-3 md:py-2 rounded flex items-center gap-2"
              onClick={() => addToWishlist(product._id)}
            >
              <div className="bg-gray-100  rounded-full cursor-pointer">
                {user && alreadyInWishlist(product._id) ? (
                  <IoMdHeart className="text-red-500 text-2xl" />
                ) : (
                  <CiHeart className="text-black text-2xl hover:text-red-500" />
                )}
              </div>
              <p className="hidden xl:block">
                {user && alreadyInWishlist(product._id)
                  ? "Added to wishlist"
                  : "Add to Wishlist"}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <p className="text-gray-700">{product.description}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 mt-10">Recommended Products</h2>
        <div className="my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {similarProducts &&
            similarProducts.map((product) => (
              <div
                key={product._id}
                className=" min-h-64 min-w-42 sm:min-w-52 md:size-64 rounded  bg-gray-100 flex items-start justify-center  border-purple-100 border  overflow-hidden cursor-pointer p-2 flex-col relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="my-2 text-sm bg-purple-700 px-2 py-1 text-white rounded-md">
                    {Math.floor(product.discountPercentage)}% Off
                  </div>
                  <div
                    className="bg-gray-100 p-1 rounded-full cursor-pointer"
                    onClick={() => addToWishlist(product._id)}
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
                  className="object-contain size-36 w-full text-center  p-2 rounded hover:scale-90 transition-all duration-300"
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
                  <p className="text-red-500 line-through">₹{product.price}</p>
                  <p className="text-purple-700">₹{product.discountedPrice}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
