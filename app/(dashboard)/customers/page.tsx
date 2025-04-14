"use client";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
  firstPurchase: boolean;
  resetRequestCount: number;
  createdAt: string;
  updatedAt: string;
  pass: string;
  order: string[];
}

const Page = () => {
  const { user } = useAuthStore();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users");
      setCustomers(response.data.users);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    if (!user) {
      router.push("/login");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center">
        <VscLoading className="animate-spin text-purple-700 text-3xl" />
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-y-scroll max-h-[90vh] pt-20 pb-20 md:pt-0 md:mb-0 px-4">
      <h2 className="text-xl font-semibold mb-4 my-2 text-purple-700">
        All User Details
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>First Purchase</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user?.pass}</TableCell>
              <TableCell>{user.firstPurchase ? "Yes" : "No"}</TableCell>
              <TableCell>{user.order.length}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
