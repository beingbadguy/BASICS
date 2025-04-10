"use client";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { FaThLarge, FaList } from "react-icons/fa";
import { IoCloseOutline, IoFilterSharp } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Progress } from "@radix-ui/react-progress";
import { useAuthStore } from "@/store/store";
import { IoMdHeart } from "react-icons/io";
import { CiDiscount1, CiHeart } from "react-icons/ci";

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
  isActive: boolean;
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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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
              ? " grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1"
          }`}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className={`border rounded-2xl shadow-sm p-4 transition-all hover:shadow-md cursor-pointer group bg-white ${
                layout === "list"
                  ? "flex gap-6 items-start relative"
                  : "flex flex-col items-center text-center"
              }`}
            >
              {/* Discount badge and wishlist */}
              <div
                className={`w-full flex justify-between items-start mb-2 z-[99] ${
                  layout === "list" ? "absolute top-2 left-2" : "px-1"
                }`}
              >
                <div className="flex items-center gap-1 bg-purple-600 text-white text-xs px-2 py-1 rounded-full ">
                  <CiDiscount1 className="text-base" />
                  {Math.floor(product.discountPercentage)}% Off
                </div>
                <div
                  className={`bg-gray-100 p-1 rounded-full cursor-pointer hover:bg-gray-200  ${
                    layout === "list" ? "mr-3" : ""
                  } `}
                  onClick={() => {
                    if (!user) {
                      return router.push("/login");
                    } else {
                      addToWishlist(product._id);
                    }
                  }}
                >
                  {user && alreadyInWishlist(product._id) ? (
                    <IoMdHeart className="text-red-500 text-xl" />
                  ) : (
                    <CiHeart className="text-black text-xl group-hover:text-red-500" />
                  )}
                </div>
              </div>

              {/* Product Image */}

              <div className="overflow-hidden rounded-md w-full">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.title}
                  width={layout === "list" ? 140 : 220}
                  height={layout === "list" ? 140 : 220}
                  onClick={() => router.push(`/product/${product._id}`)}
                  className={`object-cover rounded-lg hover:scale-110 duration-300 transition-all ${
                    layout === "list"
                      ? "w-[140px] h-[140px]"
                      : "w-full h-[200px]"
                  }`}
                />
              </div>

              {/* Product Details */}
              <div
                className={`mt-3 ${
                  layout === "list" ? "flex-1 pl-4" : "w-full"
                }`}
                onClick={() => router.push(`/product/${product._id}`)}
              >
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                  {product.title}
                </h2>
                <div className="text-purple-700 font-bold text-sm sm:text-lg">
                  ₹{product.discountedPrice}
                  <span className="text-gray-400 text-xs line-through ml-2">
                    ₹{product.price}
                  </span>
                </div>
                <p
                  className={`text-xs text-green-600 mt-1 ${
                    product.isActive === true
                      ? "text-green-600 "
                      : "text-red-600"
                  }  `}
                >
                  {product.isActive === true ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;
