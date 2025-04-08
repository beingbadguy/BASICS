import Banner from "@/components/Banner";
import BannerWall from "@/components/BannerWall";
import Faqs from "@/components/Faqs";
import NewArrivals from "@/components/NewArrivals";
import Newsletter from "@/components/Newsletter";
import OverlapCards from "@/components/OverlapCards";
import ShopByCategory from "@/components/ShopByCategory";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-4">
      <div className="min-h-[80vh] flex items-center justify-center  text-center mx-4 flex-col gap-4">
        <h1 className="text-3xl">A Place where you can buy anything.</h1>
        <OverlapCards />
        <p>Welcome to the world of e-commerce!</p>
        <div className="flex items-center justify-center gap-4">
          <Button className="px-4 py-2 text-white bg-purple-700 rounded-md hover:bg-purple-600 cursor-pointer">
            Start Shopping
          </Button>
          <Button className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700 cursor-pointer">
            Learn More
          </Button>
        </div>
      </div>
      <ShopByCategory />
      <NewArrivals />
      <Banner />
      <BannerWall />
      <Newsletter />
      <Faqs />
    </div>
  );
}
