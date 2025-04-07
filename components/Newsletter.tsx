import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Newsletter = () => {
  return (
    <div className="my-4 w-full flex items-center justify-center flex-col gap-4">
      <h2 className=" text-xl text-center md:text-3xl font-bold">
        Subscribe to our newsletter
      </h2>
      <p className="text-center">
        Stay updated with the latest arrivals, discount, and offers.
      </p>
      <form className="flex items-center gap-4 flex-col w-[90%]  md:w-[50%]">
        <Input
          type="email"
          placeholder="Enter your email address"
          className="py-2 w-full border-purple-700 accent-purple-700 "
        />
        <Button
          type="submit"
          className="bg-purple-700 text-white px-4 rounded-md"
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
