"use client";
import { useEffect } from "react";
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
import Link from "next/link";
import { useDashboardStore } from "@/store/dashboard";
import DashboardCharts from "@/components/OrdersChart";

export default function DashboardHome() {
  const {
    users,
    orders,
    products,
    categories,
    queries,
    newsletters,

    usersLoading,
    ordersLoading,
    productsLoading,
    categoriesLoading,
    queriesLoading,
    newslettersLoading,

    fetchUsers,
    fetchOrders,
    fetchProducts,
    fetchCategories,
    fetchQueries,
    fetchNewsletters,
  } = useDashboardStore();

  // Modify your useEffect to stagger requests
  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchNewsletters();
    fetchProducts();
    fetchCategories();
    fetchQueries();
  }, []);

  // Determine if any data is still loading
  const isAnyLoading =
    usersLoading ||
    ordersLoading ||
    productsLoading ||
    categoriesLoading ||
    queriesLoading ||
    newslettersLoading;

  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0
  );

  if (isAnyLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <VscLoading className="animate-spin text-purple-600 text-3xl" />
      </div>
    );
  }

  return (
    <main className="mt-2 pt-20 pb-20 md:pt-0 md:mb-0 px-2 md:px-6 overflow-y-scroll max-h-[90vh]">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-purple-800">
        Dashboard Overview
      </h2>
      <DashboardCharts />

      <div className="grid mt-6 grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
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

      <div className="flex items-center justify-center gap-2 bg-purple-100 text-purple-700 shadow-md px-4 py-2 rounded-md cursor-pointer w-[200px] ">
        <Link href={"/"}>Go to website</Link>
      </div>
      {/* <OrdersChart /> */}
    </main>
  );
}
