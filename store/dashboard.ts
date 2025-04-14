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
  createdAt: string;
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
      if (res.data.success) {
        set({ users: res.data.users });
      }
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      set({ usersLoading: false });
    }
  },

  fetchOrders: async () => {
    set({ ordersLoading: true });
    try {
      const res = await axios.get("/api/orders");

      set({ orders: res.data.orders });
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      set({ ordersLoading: false });
    }
  },

  fetchProducts: async () => {
    set({ productsLoading: true });
    try {
      const res = await axios.get("/api/product");
      if (res.data.success) {
        set({ products: res.data.products });
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      set({ productsLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ categoriesLoading: true });
    try {
      const res = await axios.get("/api/category");
      if (res.data.success) {
        set({ categories: res.data.categories });
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
    } finally {
      set({ categoriesLoading: false });
    }
  },

  fetchQueries: async () => {
    set({ queriesLoading: true });
    try {
      const res = await axios.get("/api/contact");
      if (res.data.success) {
        set({ queries: res.data.contacts });
      }
    } catch (err) {
      console.error("Fetch queries error:", err);
    } finally {
      set({ queriesLoading: false });
    }
  },

  fetchNewsletters: async () => {
    set({ newslettersLoading: true });
    try {
      const res = await axios.get("/api/newsletter");
      set({ newsletters: res.data.newsletters });
    } catch (err) {
      console.error("Fetch newsletters error:", err);
    } finally {
      set({ newslettersLoading: false });
    }
  },
}));
