"use client";
import UserBarChart from "@/components/UserBarChart";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
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
}

export default function Page() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

  if (loading) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center">
        <VscLoading className="animate-spin text-purple-700 text-3xl" />
      </div>
    );
  }
  return (
    <h1 className="mt-2 overflow-x-auto max-h-[90vh] pt-20 pb-20 md:pt-0 md:mb-0 px-4">
      <UserBarChart users={customers} />
    </h1>
  );
}
