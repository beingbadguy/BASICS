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
  // fetchDashboardData: () => Promise<void>;
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
  loading: true,
  // fetchDashboardData: async () => {
  //   set({ loading: true });
  //   try {
  //     const [
  //       userRes,
  //       orderRes,
  //       productRes,
  //       categoryRes,
  //       contactRes,
  //       newsletterRes,
  //     ] = await Promise.all([
  //       axios.get("/api/users"),
  //       axios.get("/api/order"),
  //       axios.get("/api/product"),
  //       axios.get("/api/category"),
  //       axios.get("/api/contact"),
  //       axios.get("/api/newsletter"),
  //     ]);

  //     set({
  //       users: userRes.data.users || [],
  //       orders: orderRes.data.orders || [],
  //       products: productRes.data.products || [],
  //       categories: categoryRes.data.categories || [],
  //       queries: contactRes.data.contacts || [],
  //       newsletters: newsletterRes.data.newsletters || [],
  //     });
  //   } catch (err) {
  //     console.error("Error fetching dashboard data", err);
  //   } finally {
  //     set({ loading: false });
  //   }
  // },
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/users");
      console.log(response);

      set({
        users: response.data.users || [],
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
      } else {
        console.error("Error fetching users data", err);
      }
    } finally {
      set({ loading: false });
    }
  },
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/order");
      console.log(response);

      set({
        orders: response.data.orders || [],
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
      } else {
        console.error("Error fetching orders data", err);
      }
    } finally {
      set({ loading: false });
    }
  },
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/product");
      console.log(response);

      set({
        products: response.data.products || [],
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
      } else {
        console.error("Error fetching products data", err);
      }
    } finally {
      set({ loading: false });
    }
  },
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/category");
      console.log(response);

      set({
        categories: response.data.categories || [],
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
      } else {
        console.error("Error fetching categories data", err);
      }
    } finally {
      set({ loading: false });
    }
  },
  fetchQueries: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/contact");
      console.log(response);

      set({
        queries: response.data.contacts || [],
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
      } else {
        console.error("Error fetching queries data", err);
      }
    } finally {
      set({ loading: false });
    }
  },
  fetchNewsletters: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/newsletter");
      console.log(response);

      set({
        newsletters: response.data.newsletters || [],
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
      } else {
        console.error("Error fetching newsletters data", err);
      }
    } finally {
      set({ loading: false });
    }
  },
}));
