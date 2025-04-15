import Banner from "@/components/Banner";
import Faqs from "@/components/Faqs";
import NewArrivals from "@/components/NewArrivals";
import Newsletter from "@/components/Newsletter";
import OverlapCards from "@/components/OverlapCards";
import ShopByCategory from "@/components/ShopByCategory";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";
import { VscWand } from "react-icons/vsc";

export default function Home() {
  return (
    <div className="px-4">
      <div className="min-h-[80vh] flex items-center justify-center  text-center px-4 flex-col gap-4 ">
        <h1 className="text-3xl">A Place where you can buy anything.</h1>
        <OverlapCards />
        <p>Welcome to the world of e-commerce!</p>
        <div className="flex items-center justify-center gap-4 ">
          <Button className="px-3 sm:px-4 py-2 text-white bg-purple-700 rounded-md hover:bg-purple-600 cursor-pointer">
            <Link
              href={"/product"}
              className="flex items-center justify-center gap-2"
            >
              Start Shopping
              <VscWand />
            </Link>
          </Button>
          <Button className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700 cursor-pointer">
            <Link
              href={"/about"}
              className="flex items-center justify-center gap-2"
            >
              Learn More
              <MdArrowRightAlt />
            </Link>
          </Button>
        </div>
      </div>
      <div className="">
        <ShopByCategory />
        <div className="cursor-pointer my-10 ">
          <Link href="/product">
            <img src="/day2.png" alt="" className="rounded-xl" />
          </Link>
        </div>
        <NewArrivals />

        {/* <BannerWall /> */}

        <div className="aspect-video w-full mx-auto my-12 ">
          <video
            src="/ad.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full rounded-lg"
          />
        </div>
        <Newsletter />
        <Faqs />
        <Banner />
      </div>
    </div>
  );
}
