// store/dashboardStore.ts
import { create } from "zustand";
import axios, { AxiosError } from "axios";

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
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Contact {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
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

  usersLoading: boolean;
  ordersLoading: boolean;
  productsLoading: boolean;
  categoriesLoading: boolean;
  queriesLoading: boolean;
  newslettersLoading: boolean;

  fetchUsers: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchQueries: () => Promise<void>;
  fetchNewsletters: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  users: [],
  orders: [],
  products: [],
  categories: [],
  queries: [],
  newsletters: [],

  usersLoading: false,
  ordersLoading: false,
  productsLoading: false,
  categoriesLoading: false,
  queriesLoading: false,
  newslettersLoading: false,

  fetchUsers: async () => {
    set({ usersLoading: true });
    try {
      const res = await axios.get("/api/users");
      console.log("Fetched Users:", res.data);
      set({ users: res.data.users || [] });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Error fetching users:", err.response?.data);
      } else {
        console.error("Error fetching users:", err);
      }
    } finally {
      set({ usersLoading: false });
    }
  },

  fetchOrders: async () => {
    set({ ordersLoading: true });
    try {
      const res = await axios.get("/api/order");
      console.log("Fetched Orders:", res.data);
      set({ orders: res.data.orders || [] });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Error fetching orders:", err.response?.data);
      } else {
        console.error("Error fetching orders:", err);
      }
    } finally {
      set({ ordersLoading: false });
    }
  },

  fetchProducts: async () => {
    set({ productsLoading: true });
    try {
      const res = await axios.get("/api/product");
      console.log("Fetched Products:", res.data);
      set({ products: res.data.products || [] });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Error fetching products:", err.response?.data);
      } else {
        console.error("Error fetching products:", err);
      }
    } finally {
      set({ productsLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ categoriesLoading: true });
    try {
      const res = await axios.get("/api/category");
      console.log("Fetched Categories:", res.data);
      set({ categories: res.data.categories || [] });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Error fetching categories:", err.response?.data);
      } else {
        console.error("Error fetching categories:", err);
      }
    } finally {
      set({ categoriesLoading: false });
    }
  },

  fetchQueries: async () => {
    set({ queriesLoading: true });
    try {
      const res = await axios.get("/api/contact");
      console.log("Fetched Queries:", res.data);
      set({ queries: res.data.contacts || [] });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Error fetching queries:", err.response?.data);
      } else {
        console.error("Error fetching queries:", err);
      }
    } finally {
      set({ queriesLoading: false });
    }
  },

  fetchNewsletters: async () => {
    set({ newslettersLoading: true });
    try {
      const res = await axios.get("/api/newsletter");
      console.log("Fetched Newsletters:", res.data);
      set({ newsletters: res.data.newsletters || [] });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Error fetching newsletters:", err.response?.data);
      } else {
        console.error("Error fetching newsletters:", err);
      }
    } finally {
      set({ newslettersLoading: false });
    }
  },
}));
