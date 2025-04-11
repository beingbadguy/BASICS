"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { VscLoading } from "react-icons/vsc";
import {
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaEnvelope,
  FaClipboardList,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { BsCartCheckFill } from "react-icons/bs";
import CountCard from "@/components/CountCard";

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
  firstPurchase: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  createdAt: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
}

interface Category {
  _id: string;
  name: string;
}

interface Contact {
  _id: string;
  name: string;
  message: string;
}

interface Newsletter {
  _id: string;
  email: string;
}

export default function DashboardHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [queries, setQueries] = useState<Contact[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllData = async () => {
    try {
      const [
        userRes,
        orderRes,
        productRes,
        categoryRes,
        contactRes,
        newsletterRes,
      ] = await Promise.all([
        axios.get("/api/users"),
        axios.get("/api/order"),
        axios.get("/api/product"),
        axios.get("/api/category"),
        axios.get("/api/contact"),
        axios.get("/api/newsletter"),
      ]);

      setUsers(userRes.data.users || []);
      setOrders(orderRes.data.orders || []);
      setProducts(productRes.data.products || []);
      setCategories(categoryRes.data.categories || []);
      setQueries(contactRes.data.contacts || []);
      setNewsletters(newsletterRes.data.newsletters || []);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <VscLoading className="animate-spin text-purple-600 text-3xl" />
      </div>
    );
  }

  return (
    <main className="mt-2 pt-20 pb-20 md:pt-0 md:mb-0 px-2 md:px-6 overflow-y-scroll max-h-[90vh]">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-purple-800">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <CountCard
          icon={<FaUsers />}
          label="Users"
          count={users.length}
          color="bg-purple-100"
        />
        <CountCard
          icon={<BsCartCheckFill />}
          label="Orders"
          count={orders.length}
          color="bg-pink-100"
        />
        <CountCard
          icon={<FaBoxOpen />}
          label="Products"
          count={products.length}
          color="bg-orange-100"
        />
        <CountCard
          icon={<MdCategory />}
          label="Categories"
          count={categories.length}
          color="bg-yellow-100"
        />
        <CountCard
          icon={<FaEnvelope />}
          label="Newsletter"
          count={newsletters.length}
          color="bg-teal-100"
        />
        <CountCard
          icon={<FaClipboardList />}
          label="Queries"
          count={queries.length}
          color="bg-blue-100"
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all duration-300 my-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl text-purple-600">
            <FaChartLine />
          </div>
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <h3 className="lg:text-xl font-semibold text-gray-800">
              ₹{totalRevenue.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
    </main>
  );
}
