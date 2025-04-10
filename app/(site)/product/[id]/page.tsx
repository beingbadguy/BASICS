"use client";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Separator } from "@radix-ui/react-select";
import { CiDiscount1, CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { useAuthStore } from "@/store/store";
import { VscSparkle } from "react-icons/vsc";

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
  info: string;
};

const ProductPage = () => {
  const { addToWishlist, user, fetchUserCart } = useAuthStore();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [addingCart, setAddingCart] = useState<boolean>(false);
  const [expand, setExpand] = useState(false);
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

  const fetchProductById = async () => {
    if (!id) return;
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

  const addToCart = async () => {
    if (!id) return;
    setAddingCart(true);
    try {
      await axios.post(`/api/cart/${id}`);
      fetchUserCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
    } finally {
      setAddingCart(false);
    }
  };

  const similarProducts = products.filter((p) => p._id !== id);
  const allProductsOfWishlist = user?.wishlist?.[0]?.products || [];

  type WishlistItem = {
    productId: Products; // or Products[]
  };

  interface Products {
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
    isActive: boolean;
    category: string;
  }

  const alreadyInWishlist = (id: string) => {
    return allProductsOfWishlist.some((item: WishlistItem) =>
      Array.isArray(item.productId)
        ? item.productId.some((product) => product._id === id)
        : item.productId._id === id
    );
  };

  useEffect(() => {
    fetchProductById();
    fetchAllProducts();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-purple-600" />
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
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative w-64 h-64 md:w-72 md:h-72 bg-white p-4 rounded-xl shadow-sm">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold">{product.title}</h1>
          </div>
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

          <div className="text-gray-700">
            {expand ? (
              <div>
                {product.description}{" "}
                <span
                  className="cursor-pointer text-gray-400 hover:text-purple-800"
                  onClick={() => setExpand(false)}
                >
                  read less
                </span>
              </div>
            ) : (
              <p>
                {product.description.slice(0, 10)}
                <span
                  onClick={() => setExpand(true)}
                  className="cursor-pointer text-gray-400 hover:text-purple-700"
                >
                  {" "}
                  see more...
                </span>{" "}
              </p>
            )}
          </div>
          <Separator className="my-4 w-full bg-gray-400 border" />

          <div className="space-y-2">
            <p className="text-lg font-semibold text-green-600">
              ₹{product.discountedPrice.toLocaleString()}
              <span className="line-through text-sm text-gray-500 ml-2">
                ₹{product.price.toLocaleString()}
              </span>
            </p>
            <div className="  text-purple-500 text-sm rounded z-[999] flex items-center gap-1">
              <CiDiscount1 className="text-xl" />
              {Math.floor(product.discountPercentage)}% Off
            </div>
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
              disabled={!product.isActive}
              onClick={() => (user ? addToCart() : router.push("/login"))}
            >
              {addingCart ? (
                <AiOutlineLoading3Quarters className="animate-spin size-6" />
              ) : (
                <>
                  <MdShoppingCart className="text-lg" />
                  Buy Now
                </>
              )}
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-black border px-4 py-2 md:py-2 rounded flex items-center gap-2"
              onClick={() =>
                user ? addToWishlist(product._id) : router.push("/login")
              }
            >
              {user && alreadyInWishlist(product._id) ? (
                <IoMdHeart className="text-red-500 text-2xl" />
              ) : (
                <CiHeart className="text-black text-2xl hover:text-red-500" />
              )}
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
        <h2 className="text-xl  md:text-2xl font-bold mb-4 flex items-center gap-2">
          Product Details <VscSparkle />
        </h2>
        <pre className="text-gray-700 whitespace-pre-wrap break-words overflow-auto">
          {product?.info || product.description}
        </pre>
      </div>

      {/* Recommended Products */}
      <div>
        <h2 className=" text-xl  md:text-2xl font-bold mb-4 mt-10 ">
          Recommended Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 my-4">
          {similarProducts.map((product) => (
            <div
              key={product._id}
              className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
            >
              <div className="absolute top-2 left-2 bg-purple-700 text-white text-xs px-2 py-1 rounded z-[999] flex items-center gap-1">
                <CiDiscount1 className="text-base" />
                {Math.floor(product.discountPercentage)}% Off
              </div>
              <div
                className="absolute top-2 right-2 bg-white p-1 rounded-full cursor-pointer shadow"
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

              <div
                className="relative w-full h-44 bg-gray-50 rounded-lg overflow-hidden mb-3 cursor-pointer"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3
                className="font-semibold text-sm md:text-base line-clamp-2 cursor-pointer"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                {product.title}
              </h3>
              <div
                className="flex items-center gap-2 text-sm mt-1 cursor-pointer"
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
      </div>
    </div>
  );
};

export default ProductPage;
