"use client";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineEdit, AiOutlineLoading3Quarters } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import axios, { AxiosError } from "axios";
import { VscLoading } from "react-icons/vsc";

export default function CheckoutPage() {
  const { user, fetchUserCart, userCart, fetchUser } = useAuthStore();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [zip, setZip] = useState(user?.zip || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [deliveryType, setDeliveryType] = useState<"normal" | "fast">("normal");
  const [promoCode, setPromoCode] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [promoCodeLoading, setPromoCodeLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
    else fetchUserCart();
  }, [user]);

  useEffect(() => {
    if (!userCart) {
      router.push("/");
    }
  }, []);

  const handleUpdate = async () => {
    if (!/^\d{10}$/.test(phone.toString())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!address || address.length < 5) {
      setError("Please enter a valid address.");
      return;
    }
    if (!zip || zip.toString().length != 6) {
      setError("Please enter a valid zip code.");
      return;
    }
    setIsUpdating(true);
    try {
      await axios.put("/api/user", { address, phone, zip });
      await fetchUser();
      setError("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
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

  const baseTotal = subtotal + estimatedTax - firstTimeDiscount;

  useEffect(() => {
    setFinalAmount(baseTotal);
  }, [subtotal, user?.firstPurchase]);

  const placeOrder = async () => {
    if (!userCart?.products.length) {
      setOrderError("Your cart is empty");
      return;
    }
    if (!address || address.length < 5) {
      setOrderError("Please enter a valid address.");
      return;
    }
    if (!zip || zip.toString().length != 6) {
      setOrderError("Please enter a valid zip code.");
      return;
    }
    if (!phone || phone.toString().length != 10) {
      setOrderError("Please enter a valid phone number.");
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await axios.post("/api/order", {
        totalAmount: finalAmount,
        paymentMethod: "cod",
        deliveryType,
        address,
        zip,
        phone,
        products: userCart?.products.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          title: item.productId.title,
          price: item.productId.discountedPrice,
          image: item.productId.image,
        })),
      });

      useAuthStore.setState({ userCart: null });
      router.push(`/success/${response.data.order._id}`);
      setOrderError("");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        setOrderError(error.response?.data.message);
      } else {
        console.log(error);
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const applyCoupon = async () => {
    if (couponApplied) {
      setPromoCodeError("Coupon already applied.");
      return;
    }

    if (!promoCode) {
      setPromoCodeError("Please enter a valid coupon code.");
      return;
    }

    if (!userCart?.products.length || !baseTotal) {
      setPromoCodeError("Your cart is empty.");
      return;
    }

    setPromoCodeLoading(true);
    try {
      const response = await axios.post("/api/coupon/apply", {
        code: promoCode,
        totalAmount: baseTotal,
      });

      setFinalAmount(response.data.finalAmount);
      setPromoCodeError(response.data.message || "Coupon applied!");
      setCouponApplied(true);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setPromoCodeError(error.response?.data.message);
      } else {
        console.log(error);
      }
    } finally {
      setPromoCodeLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-[80vh]">
      <div className="text-sm text-gray-500 mb-4">
        <span
          className="cursor-pointer hover:text-purple-600"
          onClick={() => router.push("/")}
        >
          Home
        </span>{" "}
        / <span className="text-black">Checkout</span>
      </div>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-6">
          {/* Delivery Details */}
          <div className="border p-4 rounded shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Delivery Details</h2>
              <AiOutlineEdit
                onClick={() => setShowModal(true)}
                className="cursor-pointer text-xl text-gray-500 hover:text-purple-600"
              />
            </div>
            <p className="mt-2 text-gray-700">
              <strong>Address:</strong> {user?.address || "Not provided"}
            </p>
            <p className=" text-gray-700">
              <strong>Pincode:</strong> {user?.zip || "Not provided"}
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> {user?.phone || "Not provided"}
            </p>
          </div>

          {/* Delivery Type */}
          <div className="border p-4 rounded shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <TbTruckDelivery /> Delivery Type
            </h2>
            <div className="flex gap-4 mt-2">
              <Button
                variant={deliveryType === "normal" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setDeliveryType("normal")}
              >
                Normal Delivery
              </Button>
              <Button
                variant={deliveryType === "fast" ? "default" : "outline"}
                onClick={() => setDeliveryType("fast")}
                className="cursor-pointer"
              >
                Fast Delivery
              </Button>
            </div>
          </div>

          {/* Payment Option */}
          <div className="border p-4 rounded shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-2">Payment Mode</h2>
            <p className="text-sm text-gray-700">Cash on Delivery only.</p>
            <p className="text-sm text-green-500 hidden">
              Working on online payments.
            </p>
          </div>
        </div>

        {/* Right Section - Cart Summary & Promo */}
        <div className="space-y-4">
          <div className="border p-4 rounded shadow-sm bg-white text-sm">
            <h1 className="text-xl font-bold">Product Summary</h1>
            <hr className="my-2 border-gray-200" />
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
                <p>-₹{firstTimeDiscount.toFixed(2)}</p>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <p>Total payment</p>
              <p>₹{finalAmount.toFixed(2)}</p>
            </div>

            {orderError && (
              <p className="text-red-500 text-sm mt-2">{orderError}</p>
            )}

            <Button
              disabled={placingOrder}
              className="px-4 w-full py-2 bg-black hover:bg-black/80 active:scale-90 transition-transform duration-200 text-white text-center rounded cursor-pointer my-2"
              onClick={placeOrder}
            >
              {placingOrder ? (
                <VscLoading className="animate-spin text-xl" />
              ) : (
                "Place Order"
              )}
            </Button>
          </div>

          <div className=" border p-4 rounded shadow-sm bg-white">
            <label htmlFor="promo" className="text-sm font-medium">
              Do you have a promo code?
            </label>
            <div className="flex mt-2">
              <input
                id="promo"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="border rounded-l px-3 py-1 w-full"
                disabled={couponApplied}
              />
              <Button
                disabled={promoCodeLoading || couponApplied}
                onClick={applyCoupon}
                className="rounded-l-none bg-black text-white cursor-pointer"
              >
                {promoCodeLoading ? (
                  <VscLoading className="animate-spin text-xl" />
                ) : couponApplied ? (
                  "Applied"
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            {promoCodeError && (
              <p className="text-red-500 text-sm mt-2">{promoCodeError}</p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            We share promo codes on our socials monthly.
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Delivery Info</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Pincode
                </label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="Enter Pincode"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-purple-600 text-white"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
