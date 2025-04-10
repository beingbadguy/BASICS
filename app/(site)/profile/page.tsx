"use client";
import OrderDetailsCard from "@/components/OrderDetailsCart";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/store";
import { Separator } from "@radix-ui/react-select";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import { User, Package } from "lucide-react";

type Order = {
  _id: string;
  userId: User;
  products: Product[];
  totalAmount: number;
  paymentMethod: "cod" | "credit/debit";
  deliveryType: "normal" | "fast";
  address: string;
  phone: string;
  status:
    | "processing"
    | "cancelled"
    | "completed"
    | "reviewing"
    | "preparing"
    | "shipped"
    | "delivered";
  createdAt: string;
  updatedAt: string;
};

type Product = {
  productId: {
    _id: string;
    title: string;
    price: number;
    category: string;
    image: string;
  };
  quantity: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  address?: string;
  createdAt?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoggingOut, fetchUser, userWishlist } =
    useAuthStore();
  const [menu, setMenu] = useState<string>("account");

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>("");

  const [orders, setOrders] = useState([]);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get("/api/order");
      setOrders(response.data.orders);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("Error fetching orders:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return alert("No file selected");

    try {
      const formData = new FormData();
      formData.append("image", file);
      await axios.put("/api/profileupload", formData);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("Error updating profile image:", error);
      }
    } finally {
      fetchUser();
    }
  };

  const menuItems = [
    { label: "My Account", key: "account", icon: <User className="size-4" /> },
    { label: "My Orders", key: "order", icon: <Package className="size-4" /> },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row">
      {/* Sidebar / Top Menu */}
      <div className="bg-white pt-4 border-r-2 md:min-w-[20%] lg:min-w-[15%] xl:min-w-[15%] md:h-screen px-4 space-y-3 flex md:flex-col flex-row justify-evenly md:justify-start border-b md:border-b-0 pb-2 md:pb-0 w-full md:w-auto">
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setMenu(item.key)}
            className={`flex items-center gap-2 transition-all px-3 py-2 text-sm rounded cursor-pointer font-medium
              ${
                menu === item.key
                  ? "bg-purple-700 text-white hover:bg-purple-600"
                  : "hover:bg-gray-100 hover:text-black text-gray-700"
              }`}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>

      {/* Content Section */}
      {menu === "account" ? (
        <div className="flex items-start justify-between gap-4 px-4 w-full flex-col md:flex-row">
          <div className="w-full flex flex-col gap-4 pt-4">
            <h1>Complete your data</h1>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-center size-24 rounded-full border border-black overflow-hidden">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="user"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <p className="text-3xl">{user?.name?.charAt(0)}</p>
                )}
              </div>
              <div className="border cursor-pointer overflow-hidden w-20 h-10 relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute top-0 left-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  onChange={handleImageChange}
                />
                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                  Upload
                </p>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <div>
                <p>Full Name</p>
                <p className="bg-gray-100 text-gray-400 px-4 py-2 w-full">
                  {user?.name}
                </p>
              </div>
              <div>
                <p>Address</p>
                <p className="bg-gray-100 text-gray-400 px-4 py-2 w-full">
                  {user?.address || "Address Unavailable"}
                </p>
              </div>
              <div>
                <p>Phone</p>
                <p className="bg-gray-100 text-gray-400 px-4 py-2 w-full">
                  {user?.phone || "Phone Unavailable"}
                </p>
              </div>
              <div
                className="bg-black px-4 py-2 text-white text-center w-full rounded my-6 cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                Edit Profile
              </div>
            </div>
          </div>

          <Separator className="w-full bg-gray-100 h-0.5 md:hidden" />

          <div className="md:border-l-2 md:h-screen md:px-4 md:pt-4 lg:min-w-[600px] w-full">
            <h1>Overview</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-gray-400">
              <div>
                <p>Joined Basics on</p>
                <p className="text-black">
                  {new Date(user?.createdAt as string).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
              <div>
                <p>Orders Purchased</p>
                <p className="text-black">{orders?.length || 0} Orders</p>
              </div>
              <div>
                <p>Total Wishlist</p>
                <p className="text-black">
                  {userWishlist?.products.length || 0} Products
                </p>
              </div>
            </div>

            <Separator className="w-full bg-gray-100 h-0.5 my-4" />

            <div>
              <h1>Login Information</h1>
              <p className="text-sm my-2 ">Email</p>
              <p className="bg-gray-100 px-4 py-2 text-gray-400">
                {user?.email}
              </p>
              <Button
                className="my-4 text-white bg-black hover:bg-gray-700 w-full cursor-pointer"
                disabled={isLoggingOut}
                onClick={logout}
              >
                {isLoggingOut ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-white" />
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <CiLogout />
                    Logout
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
                <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Address</label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Enter phone"
                    />
                  </div>
                  {error && <p className="text-red-500 my-1">{error}</p>}
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-purple-600 text-white"
                    onClick={async () => {
                      if (!/^\d{10}$/.test(phone.toString())) {
                        setError("Please enter a valid phone number.");
                        return;
                      }
                      if (address && address.length < 10) {
                        setError("Please enter a valid address.");
                        return;
                      }
                      setIsUpdating(true);
                      try {
                        await axios.put("/api/user", {
                          address,
                          phone,
                        });
                        await fetchUser();
                        setError("");
                        setShowModal(false);
                      } catch (error: unknown) {
                        if (error instanceof AxiosError) {
                          console.error(error.response?.data);
                        } else {
                          console.error("Error updating profile:", error);
                        }
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
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
          )}
        </div>
      ) : (
        <div className="max-h-[90vh] bg-white overflow-y-scroll p-4 w-full">
          <h1 className="text-xl md:text-2xl font-semibold">
            My Orders ({orders?.length || 0})
          </h1>
          <div className="w-full select-text">
            {orders?.map((order: Order) => (
              <OrderDetailsCard
                order={order}
                key={order._id}
                fetchUserOrders={fetchUserOrders}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
