"use client";

import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import axios, { AxiosError } from "axios";

const CartPage = () => {
  const { user, fetchUserCart, userCart } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchUserCart();
    }
  }, [user]);
  console.log(user?.firstPurchase);

  const handleChangeCartQuantity = async (
    productId: string,
    quantity: number
  ) => {
    console.log("Increase/decrease quantity for:", productId);

    try {
      const response = await axios.put(`/api/cart/${productId}`, {
        quantity: quantity,
      });
      console.log(response.data);
      fetchUserCart();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("Failed to add to cart", error);
      }
    }
  };

  const handleDelete = async (productId: string) => {
    console.log("Delete product:", productId);

    try {
      const response = await axios.delete(`/api/cart/${productId}`);
      console.log(response.data);
      fetchUserCart();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("Failed to add to cart", error);
      }
    }
  };

  const subtotal =
    userCart?.products.reduce(
      (acc, item) => acc + item.productId.discountedPrice * item.quantity,
      0
    ) || 0;

  const estimatedTax = 20;

  const firstTimeDiscount = user?.firstPurchase
    ? 0
    : ((subtotal + estimatedTax) * 15) / 100;
  const totalAfterDiscount = subtotal + estimatedTax - firstTimeDiscount;

  // const total = subtotal + estimatedTax + (totalAfterDiscount);

  return (
    <div className="p-4 min-h-[90vh]">
      <div className="text-sm text-gray-500 mb-4">
        <span
          className="cursor-pointer hover:text-purple-600"
          onClick={() => router.push("/")}
        >
          Home
        </span>{" "}
        / <span className="cursor-pointer text-black">Cart</span>{" "}
      </div>

      <h1 className="py-2 font-bold text-purple-700 text-3xl">Your Cart</h1>

      {userCart && userCart.products.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            {userCart.products.map((item) => (
              <div
                key={item.productId._id}
                className="flex gap-4 border-b pb-4"
              >
                <Image
                  src={item.productId.image}
                  alt={item.productId.title}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    {item.productId.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Category: {item.productId.category}
                  </p>
                  {/* <p className="text-sm text-gray-600">
                    Color: {item.productId.color}
                  </p> */}

                  {/* <div className="mt-2 flex items-center gap-4">
                    <p className="text-sm font-medium">Product size</p>
                    <select className="border p-1 rounded">
                      {item.productId.sizes.map((size) => (
                        <option
                          key={size}
                          value={size}
                          selected={item.size === size}
                        >
                          {size}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Quantity</p>
                    <div className="flex items-center ">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            handleChangeCartQuantity(
                              item.productId._id,
                              item.quantity - 1
                            );
                          } else {
                            console.log("Quantity cannot be less than 1");
                          }
                        }}
                        className="p-1 bg-gray-100 active:scale-90 transition-transform duration-200 hover:bg-gray-200 cursor-pointer rounded-full size-10 flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => {
                          if (item.quantity < item.productId.countInStock) {
                            handleChangeCartQuantity(
                              item.productId._id,
                              item.quantity + 1
                            );
                          } else {
                            console.log("Quantity cannot be more than stock");
                          }
                        }}
                        className="p-1 bg-gray-100 hover:bg-gray-200  active:scale-90 transition-transform duration-200  cursor-pointer rounded-full size-10 flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(item.productId._id)}
                      className="ml-4 text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="mt-2 text-purple-500 text-sm font-semibold ">
                    ₹{item.productId.discountedPrice || item.productId.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border p-4 rounded-sm space-y-4 h-fit text-sm">
            <h1 className="text-xl font-bold ">Product Summary</h1>
            <hr className="w-full border border-gray-200 " />
            <div className="flex justify-between">
              <p>Total products</p>
              <p>{userCart?.products.length || 0} Products</p>
            </div>
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>

            <div className="flex justify-between">
              <p>Estimated tax</p>
              <p>₹{estimatedTax.toFixed(2)}</p>
            </div>
            {!user?.firstPurchase && (
              <div className="flex justify-between">
                <p>First time discount</p>
                <p>₹{firstTimeDiscount.toFixed(2)}</p>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg">
              <p>Total payment</p>
              <p>₹{totalAfterDiscount.toFixed(2)}</p>
            </div>

            <button
              className="w-full bg-black hover:bg-black/80 active:scale-90 transition-transform duration-200 cursor-pointer text-white py-3 font-semibold rounded"
              onClick={() => {
                router.push("/checkout");
              }}
            >
              CHECKOUT
            </button>
            <p className="text-xs text-gray-500">
              By selecting a payment method, you agree to our Terms of Use,
              Sale, Return Policy, and Privacy Policy.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 my-2 text-sm">
          You do not have any items in your cart.
        </p>
      )}
    </div>
  );
};

export default CartPage;
