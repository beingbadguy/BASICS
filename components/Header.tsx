"use client";
import { useAuthStore } from "@/store/store";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const { user, fetchUser } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const unablepath = ["/login", "/signup"];
  const pathname = usePathname();
  console.log(pathname);
  const router = useRouter();

  useEffect(() => {
    fetchUser(); // Fetch user when the component mounts

    if (user && !user.isVerified) {
      router.push("/verify");
    }
  }, [fetchUser]);

  return (
    <div className="p-4 border-b border-gray-400">
      <nav className="flex items-center justify-between">
        <Image
          src={
            "https://img.freepik.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg?t=st=1743651116~exp=1743654716~hmac=4e112787b5e440f31f90c614a91ee63c21796f92444cff23250a30be4654df3d&w=1060"
          }
          alt="logo"
          className="cursor-pointer"
          width={40}
          height={40}
          onClick={() => {
            router.push("/");
          }}
        />
        <ul
          className={` ${
            showMenu ? "translate-x-0" : "-translate-x-[100%]"
          } transition-all duration-300 md:translate-x-0 absolute top-0 left-0 w-full h-screen flex-col bg-white z-[999] items-start p-4 md:static md:bg-transparent md:h-auto md:flex-row md:w-auto md:p-0 flex md:items-center gap-5`}
        >
          <li className="md:hidden">
            <IoMdClose
              className="absolute top-4 right-4 size-5 cursor-pointer"
              onClick={() => {
                setShowMenu(false);
              }}
            />
          </li>
          <li>
            <Link
              href="/"
              onClick={() => {
                setShowMenu(false);
              }}
            >
              Home
            </Link>
          </li>
          <li
            onClick={() => {
              setShowMenu(false);
            }}
          >
            <Link href="/about">About</Link>
          </li>
          <li
            onClick={() => {
              setShowMenu(false);
            }}
          >
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        <div className="flex items-center justify-center gap-2">
          {user ? (
            <Link href={"/profile"}>
              <p className=" flex items-center justify-center cursor-pointer">
                {" "}
                <FaUser className="size-5" />
                {/* {user.name.charAt(0).toUpperCase()} */}
              </p>
            </Link>
          ) : unablepath.includes(pathname) ? (
            ""
          ) : (
            <Link href="/login">
              <Button className="cursor-pointer">Login</Button>
            </Link>
          )}
          <HiOutlineMenuAlt1
            className="size-6 cursor-pointer md:hidden"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          />
        </div>
      </nav>
    </div>
  );
};

export default Header;
