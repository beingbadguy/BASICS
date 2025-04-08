"use client";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { IoCloseOutline } from "react-icons/io5";
import { VscCoffee } from "react-icons/vsc";

interface Product {
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

interface WishlistProductItem {
  _id: string;
  productId: Product;
}

interface Wishlist {
  _id: string;
  products: WishlistProductItem[];
}

const WishlistPage = () => {
  const router = useRouter();
  const { user, fetchUser } = useAuthStore();
  const allWishlistProducts =
    user?.wishlist?.flatMap((w: Wishlist) => w.products) || [];

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const res = await axios.delete(`/api/wishlist/${productId}`);
      console.log(res.data);
      fetchUser();
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

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

      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>

      {allWishlistProducts.length === 0 && (
        <div className="text-gray-600 flex items-center gap-1 flex-wrap break-normal my-2">
          <VscCoffee className="animate-pulse" />
          Your wishlist is empty. Add some items to your wishlist!
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user?.wishlist?.map((wishlistItem: Wishlist) =>
          wishlistItem.products.map((productObj: WishlistProductItem) => {
            const product: Product = productObj.productId;

            return (
              <div
                key={product._id}
                className="relative border rounded-2xl shadow p-4 hover:shadow-lg transition-all"
              >
                {/* Remove icon */}
                <IoCloseOutline
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer bg-gray-100 rounded-full size-6"
                  onClick={() => handleRemoveFromWishlist(product._id)}
                />

                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-contain rounded-lg mb-3"
                  />
                  <h2 className="font-semibold text-lg">{product.title}</h2>
                  <p className="text-gray-600 text-sm mb-1">
                    {product.category}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-purple-600">
                      ₹{product.discountedPrice}
                    </span>
                    <span className="line-through text-sm text-gray-400">
                      ₹{product.price}
                    </span>
                    <span className="text-sm  rounded absolute top-4 left-4 bg-red-500 text-white px-2 py-1">
                      {Math.floor(product.discountPercentage)}% Off
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
