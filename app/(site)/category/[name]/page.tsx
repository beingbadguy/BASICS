"use client";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
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

const Page = () => {
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
        <span> {name}</span>
      </div>
      <div className="text-sm">
        {" "}
        {filteredProducts?.length} Products found for the {name} Category.
      </div>
      <div className="my-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts &&
          filteredProducts.map((product) => (
            <div key={product._id}>
              <div
                key={product._id}
                className={`p-4 min-h-64 min-w-42 sm:min-w-52 md:min-size-64 border rounded-md shadow-sm hover:shadow-md cursor-pointer transition-all 
                 flex gap-4 items-center justify-evenly w-full  flex-col
                 
                }`}
              >
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.title}
                  width={300}
                  height={300}
                  onClick={() => router.push(`/product/${product._id}`)}
                  className={`
                       md:min-size-64 size-64 
                     
                object-contain max-size-36  text-center  p-2 rounded `}
                />
                <div
                  className={"w-full "}
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  <h2 className="text-lg font-semibold mt-2">
                    {product.title}
                  </h2>

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
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;
