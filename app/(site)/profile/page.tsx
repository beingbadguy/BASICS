"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/store";
import { Separator } from "@radix-ui/react-select";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";

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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("No file selected");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.put("/api/profileupload", formData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      fetchUser();
    }
  };
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  });

  return (
    <div className=" min-h-[80vh] flex md:items-start justify-start gap-2 flex-col md:flex-row">
      <div className=" pt-4 border-r-2 md:min-w-[20%] lg:min-w-[15%] xl:min-w-[15%]   md:h-screen px-4 md:space-y-3 flex  items-center justify-evenly md:justify-start flex-row md:flex-col border-b pb-2 md:pb-0 md:border-b-0">
        <div
          className={` ${
            menu === "account"
              ? "bg-purple-700 text-white hover:bg-purple-600 "
              : "hover:text-black"
          } cursor-pointer hover:bg-gray-100  px-2 py-1`}
          onClick={() => {
            setMenu("account");
          }}
        >
          My Account
        </div>
        <div
          onClick={() => {
            setMenu("order");
          }}
          className={` ${
            menu === "order"
              ? "bg-purple-700 text-white hover:bg-purple-600 "
              : "hover:text-black"
          } cursor-pointer hover:bg-gray-100  px-2  py-1 `}
        >
          My Orders
        </div>
      </div>
      {menu === "account" ? (
        <div className="flex items-start  justify-between gap-4 px-4 w-full flex-col md:flex-row">
          <div className="w-full flex items-start justify-start flex-col gap-4 pt-4">
            <h1>Complete your data</h1>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-center size-24 rounded-full  border border-black">
                {user?.image ? (
                  <Image
                    src={user?.image}
                    alt="user"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <p>{user?.name?.charAt(0)}</p>
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
              <div className="w-full">
                <p>Full Name</p>
                <p className="bg-gray-100 px-4 py-2 w-full">{user?.name}</p>
              </div>

              <div className="w-full">
                <p>Address</p>
                <p className="bg-gray-100 px-4 py-2 w-full">
                  {user?.address || "Address Unavailable"}
                </p>
              </div>
              <div className="w-full">
                <p>Phone</p>
                <p className="bg-gray-100 px-4 py-2 w-full">
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
          <Separator className="w-full bg-gray-100 h-0.5 md:hidden " />
          <div className="md:border-l-2 md:h-screen md:px-4  md:pt-4 lg:min-w-[600px] w-full">
            <div className=" ">
              <h1>Overview</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  text-sm text-gray-400">
                <div>
                  <p>Joined Basics on</p>
                  <p className="text-black">
                    {new Date(user?.createdAt as string).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p>Product Purchased</p>
                  <p className="text-black">80 Products</p>
                </div>
                <div>
                  <p>Total Wishlist </p>
                  <p className="text-black">
                    {userWishlist?.products.length || 0} Products
                  </p>
                </div>
              </div>
            </div>
            <Separator className="w-full bg-gray-100 h-0.5 my-4 " />
            <div>
              <h1 className="">Login Information</h1>
              <p className="text-sm my-2">Email</p>
              <p className="bg-gray-100 px-4 py-2 ">{user?.email}</p>
              <Button
                className="cursor-pointer my-4 text-white bg-black rounded-md hover:bg-gray-700 w-full"
                disabled={isLoggingOut}
                onClick={logout}
              >
                {isLoggingOut ? (
                  <AiOutlineLoading3Quarters className=" animate-spin text-white" />
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <CiLogout />
                    Logout
                  </div>
                )}
              </Button>
            </div>
            {showModal && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
                  <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Address
                      </label>
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
                  </div>
                  {error && <p className="text-red-500 my-1">{error}</p>}

                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-purple-600 text-white cursor-pointer"
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
                        } catch (error) {
                          console.error(error);
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
        </div>
      ) : (
        <div className="p-4">
          <h1>My Orders</h1>
        </div>
      )}
    </div>
  );
}
