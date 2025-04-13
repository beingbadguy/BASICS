// store/dashboardStore.ts
import { create } from "zustand";
import axios from "axios";

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

interface DashboardStore {
  users: User[];
  orders: Order[];
  products: Product[];
  categories: Category[];
  queries: Contact[];
  newsletters: Newsletter[];
  loading: boolean;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  users: [],
  orders: [],
  products: [],
  categories: [],
  queries: [],
  newsletters: [],
  loading: true,
  fetchDashboardData: async () => {
    set({ loading: true });
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

      set({
        users: userRes.data.users || [],
        orders: orderRes.data.orders || [],
        products: productRes.data.products || [],
        categories: categoryRes.data.categories || [],
        queries: contactRes.data.contacts || [],
        newsletters: newsletterRes.data.newsletters || [],
      });
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      set({ loading: false });
    }
  },
}));
