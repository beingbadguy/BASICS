"use client";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { IoCloseOutline } from "react-icons/io5";
import { VscCoffee } from "react-icons/vsc";
import { useEffect } from "react";

// interface Product {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   discountedPrice: number;
//   countInStock: number;
//   rating: number;
//   numReviews: number;
//   image: string;
//   discountPercentage: number;
//   isActive: boolean;
//   category: string;
// }

// type WishlistItem = {
//   productId: Product;
//   _id: string;
// };

// type WishlistGroup = {
//   _id: string;
//   products: WishlistItem[];
// };

const WishlistPage = () => {
  const router = useRouter();
  const {  fetchUser, fetchUserWishlist, userWishlist } = useAuthStore();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const res = await axios.delete(`/api/wishlist/${productId}`);
      console.log(res.data);
      fetchUser();
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };
  console.log(userWishlist?.products.length);

   const isWishlistEmpty =
     !userWishlist ||
     !userWishlist.products ||
     userWishlist.products.length < 1;
  useEffect(() => {
    fetchUserWishlist();
  }, []);

  return (
    <div className="p-4 min-h-[70vh]">
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
        / <span className="text-black">Wishlist</span>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-purple-700">Your Wishlist</h1>

      {isWishlistEmpty && (
        <div className="text-gray-600 flex items-center gap-1 flex-wrap break-normal my-2 text-sm">
          <VscCoffee className="animate-pulse" />
          Your wishlist is empty. Add some items to your wishlist!
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userWishlist?.products.map((product) => (
          <div
            key={product.productId._id}
            className="relative border rounded-2xl shadow p-4  transition-all bg-white"
          >
            <IoCloseOutline
              className="absolute z-[99] top-2 right-2 text-black hover:text-red-500 cursor-pointer bg-gray-100 rounded-full size-6"
              onClick={() => handleRemoveFromWishlist(product.productId._id)}
            />

            <div
              className="cursor-pointer"
              onClick={() => router.push(`/product/${product.productId._id}`)}
            >
              <div className="overflow-hidden rounded-md">
                <Image
                  src={product.productId.image}
                  alt={product.productId.title}
                  width={300}
                  height={200}
                  className="w-full h-48 hover:scale-110 duration-300 transition-all rounded-xl object-cover bg-white shadow-sm"
                />
              </div>

              <h2 className="font-semibold text-base md:text-lg mt-3">
                {product.productId.title}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                {product.productId.category}
              </p>

              <div className="flex items-center space-x-2 mt-1">
                <span className="md:text-lg font-bold text-purple-600">
                  ₹{product.productId.discountedPrice}
                </span>
                <span className="line-through text-sm text-gray-400">
                  ₹{product.productId.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
