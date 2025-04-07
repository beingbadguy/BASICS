import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoIosCheckmarkCircle } from "react-icons/io";

export default async function page() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center mx-2">
      <div className="flex items-center justify-center gap-2 flex-col">
        <span>
          {" "}
          <IoIosCheckmarkCircle className="size-20 text-green-500" />
        </span>
        <p className="text-center">Your Password has changed sucessfully.</p>
        <Link href="/login" className="cursor-pointer">
          <Button className="cursor-pointer">Login Now</Button>
        </Link>
      </div>
    </div>
  );
}
