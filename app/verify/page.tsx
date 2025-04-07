"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/store";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function VerificationPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, logout } = useAuthStore();

  // console.log(user?.email);

  useEffect(() => {
    if (user) {
      if (user.isVerified) {
        router.push("/");
      }
    } else {
      router.push("/login");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user?.email) {
      setError("You need to sign in first");
      return;
    }
    if (!token) {
      setError("Please enter your verification code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/verify", { token });
      // console.log(response.data);
      setError(response.data.message);

      router.push("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        setError(error.response?.data.message);
      } else {
        console.log("Error: " + error);
        setError("An error occurred, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTokenRequest = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user?.email) {
      setError("You need to sign in first");
      return;
    }
    setTokenLoading(true);
    try {
      const response = await axios.post("/api/verification", {
        email: user?.email,
      });
      // console.log(response.data);
      setError(response.data.message);
      //   redirect to the home page
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        setError(error.response?.data.message);
      } else {
        console.log("Error: " + error);
        setError("An error occurred, please try again later.");
      }
    } finally {
      setTokenLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 flex-col min-h-[70vh]">
      <h1 className="font-bold">Verification Page</h1>
      <p>
        Code send to <span className="italic">{user?.email}</span>
      </p>

      <form className="w-[90%] md:w-[50%] ">
        <Input
          type="number"
          placeholder="Verification Code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border-gray-400"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="w-full flex items-center justify-between my-2">
          <Button
            disabled={loading}
            className="cursor-pointer w-full"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-gray-400" />
            ) : (
              "Verify"
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between ">
          <Button
            disabled={tokenLoading}
            className="cursor-pointer text-right "
            variant="link"
            onClick={(e) => {
              handleTokenRequest(e);
            }}
          >
            {tokenLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-gray-400" />
            ) : (
              "Resend Code"
            )}
          </Button>
          <Button className="cursor-pointer" variant="link" onClick={logout}>
            Another email
          </Button>
        </div>
      </form>
    </div>
  );
}
