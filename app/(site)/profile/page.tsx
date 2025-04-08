"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoggingOut } = useAuthStore();
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  });

  return (
    <div className="p-4 flex md:items-center justify-between gap-2 flex-col md:flex-row">
      <div>
        <h1>Profile Page</h1>
        <p>
          Welcome, <span className="font-bold">{user?.name}</span>
        </p>
      </div>
      <Button
        className="cursor-pointer"
        disabled={isLoggingOut}
        onClick={logout}
      >
        {isLoggingOut ? (
          <AiOutlineLoading3Quarters className=" animate-spin text-white" />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <CiLogout />
            Logout
          </div>
        )}
      </Button>
    </div>
  );
}
