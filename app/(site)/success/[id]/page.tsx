"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VscPass } from "react-icons/vsc";
import { useAuthStore } from "@/store/store";

export default function Page() {
  const { user } = useAuthStore();
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) router.push("/");
  }, [id, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-white text-center px-4">
      <div className="bg-purple-50 p-10 rounded-2xl  w-full max-w-xl">
        <div className="flex justify-center mb-6">
          <VscPass className="text-purple-600 text-6xl" />
        </div>
        <p className="text-sm md:text-base my-2">Order ID: {id}</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-2">
          Thanks {user?.name}, Your Order was Placed Successfully.
        </h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          We will send latest information and updates about your order to @
          {user?.email}
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm cursor-pointer"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => router.push(`/profile`)}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full text-sm cursor-pointer"
          >
            Check Details
          </Button>
        </div>
      </div>
    </div>
  );
}
