"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios, { AxiosError } from "axios";
import { VscLoading } from "react-icons/vsc";

const Newsletter = () => {
  const [email, setEmail] = React.useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleNewsletterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/newsletter", { email });
      // console.log(response.data);
      setError(response.data.message);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message);
        setError(error.response?.data?.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 w-full flex items-center justify-center flex-col gap-1">
      <h2 className=" text-xl text-center md:text-4xl ">
        Subscribe to our newsletter
      </h2>
      <p className="text-center">
        Stay updated with the latest arrivals, discount, and offers.
      </p>
      <form
        onSubmit={handleNewsletterSubmit}
        className="flex items-center gap-4 flex-col w-[90%]  md:w-[50%]"
      >
        <Input
          type="email"
          placeholder="Enter your email address"
          className="py-2 my-2 w-full border-purple-700 accent-purple-700 "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500   text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-700 text-white px-4 rounded-md cursor-pointer"
        >
          {loading ? (
            <VscLoading className="animate-spin text-white " />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
