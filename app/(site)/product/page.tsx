"use client";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { FaThLarge, FaList } from "react-icons/fa";
import { IoCloseOutline, IoFilterSharp } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-select";
import { Progress } from "@radix-ui/react-progress";
import { useAuthStore } from "@/store/store";
import { IoMdHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";

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
interface Category {
  _id: string;
  name: string;
  categoryImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ProductsPage = () => {
  const { addToWishlist, user } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [fullProducts, setFullProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxValue, setMaxValue] = useState(100000);
  const [sortBy, setSortBy] = useState<string>("default");

  const router = useRouter();
  const fetchCategories = async () => {
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
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/product");
      setFullProducts(response.data.products);
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
  console.log(selectedCategory);
  useEffect(() => {
    if (selectedCategory) {
      const seletedCategoryItems = fullProducts.filter((product) => {
        if (maxValue) {
          return (
            product.discountedPrice <= maxValue &&
            product.category === selectedCategory
          );
        } else {
          return product.category === selectedCategory;
        }
      });
      console.log(seletedCategoryItems);
      setProducts(seletedCategoryItems);
    } else {
      setProducts(fullProducts);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (maxValue) {
      const productByMaxValue = fullProducts.filter((product) => {
        if (selectedCategory) {
          return (
            product.discountedPrice <= maxValue &&
            product.category === selectedCategory
          );
        } else {
          return product.discountedPrice <= maxValue;
        }
      });
      console.log(productByMaxValue);
      setProducts(productByMaxValue);
    } else {
      setProducts(fullProducts);
    }
  }, [maxValue]);

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const sorted = [...products];

    if (sortBy === "priceLowToHigh") {
      sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === "priceHighToLow") {
      sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sortBy === "ratingHighToLow") {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    setProducts(sorted);
  }, [sortBy]);

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
    if (showFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFilter]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center w-full">
        <VscLoading className="text-3xl animate-spin text-purple-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      {/* breadcrumbs  */}
      <div className="text-sm text-gray-500 mb-4">
        <span
          className="cursor-pointer hover:text-purple-600"
          onClick={() => router.push("/")}
        >
          Home
        </span>{" "}
        / <span className="cursor-pointer hover:text-purple-600">Products</span>{" "}
      </div>
      {/* Header Controls */}
      {showFilter && (
        <div
          className="fixed inset-0 top-22 bg-black/50 bg-opacity-10 z-40"
          onClick={() => {
            setShowFilter(false);
          }}
        />
      )}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilter(true)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
        >
          <IoFilterSharp className="text-xl" />
          <span>Filter</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout("grid")}
            className={`p-2 rounded-md ${
              layout === "grid" ? "bg-purple-600 text-white" : "bg-gray-100"
            } cursor-pointer`}
          >
            <FaThLarge />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={`p-2 rounded-md ${
              layout === "list" ? "bg-purple-600 text-white" : "bg-gray-100"
            } cursor-pointer`}
          >
            <FaList />
          </button>
        </div>
      </div>

      {/* Main layout with optional sidebar */}
      <div
        className={`flex  h-full  ${
          showFilter ? "translate-x-0" : " -translate-x-[200%]"
        } transition-all duration-300 absolute top-[88px] left-0 z-[999] rounded-t-2xl `}
      >
        {/* Filter Sidebar */}
        <div
          onClick={() => {
            setShowFilter(false);
          }}
        >
          <IoCloseOutline className="absolute top-4 right-4 cursor-pointer size-6" />
        </div>
        <aside className="w-[250px] bg-gray-50 border  p-4 ">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          {/* Add actual filter options here */}
          <p className="text-sm text-black my-2">Category</p>
          <select
            name=""
            id=""
            value={selectedCategory!}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1 cursor-pointer border rounded-md w-full"
          >
            {" "}
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-black my-2">Max Price</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>₹0</span>
              <span>₹{maxValue}</span>
              <span>₹100000</span>
            </div>
            <div className="relative w-full">
              <Progress value={(maxValue / 100000) * 100} className="h-3" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white font-semibold">
                ₹{maxValue}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={maxValue}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <p className="text-sm text-black my-2">Sort By</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 cursor-pointer border rounded-md w-full"
          >
            <option value="default">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
          <button
            className="text-sm text-red-600 font-semibold hover:underline my-4 cursor-pointer"
            onClick={() => {
              setSelectedCategory("");
              setMaxValue(100000);
              setSortBy("default");

              setShowFilter(false);
            }}
          >
            Clear Filters
          </button>
        </aside>
      </div>
      <div>
        {/* Product Grid/List */}
        <section
          className={`flex-1 grid gap-6 ${
            layout === "grid"
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className={`p-4 min-h-64 min-w-42 sm:min-w-52 md:min-size-64 border rounded-md shadow-sm hover:shadow-md cursor-pointer transition-all ${
                layout === "list"
                  ? "flex gap-4 items-center justify-evenly w-full "
                  : ""
              }`}
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
                src={product.image || "/placeholder.png"}
                alt={product.title}
                width={layout === "list" ? 150 : 300}
                height={layout === "list" ? 150 : 300}
                onClick={() => router.push(`/product/${product._id}`)}
                className={` ${
                  layout === "list"
                    ? "w-[50%] md:min-size-64 size-64 "
                    : "w-full size-48"
                } object-contain size-24 max-size-36  text-center  p-2 rounded `}
              />
              <div
                className={layout === "list" ? "flex-1" : "w-[50%]"}
                onClick={() => router.push(`/product/${product._id}`)}
              >
                <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                {layout === "list" && (
                  <div>
                    <p className="text-sm text-gray-500 mt-2">
                      {product.description}
                    </p>
                    <Separator className="bg-gray-300 w-full my-2 h-[1px]" />
                  </div>
                )}
                <div className="mt-2">
                  <p className="text-purple-700 font-bold text-lg">
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
          ))}
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;
