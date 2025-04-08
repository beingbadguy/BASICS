import { create } from "zustand";
import axios, { AxiosError } from "axios";

// Define the shape of your authentication state
interface AuthState {
  user: {
    name: string;
    email: string;
    isVerified: boolean;
    role: string;
    createdAt: string;
    address: string;
    phone: number;
    image: string;
    wishlist?: { products: WishlistItem[] }[];
  } | null;
  isLoggingOut: boolean;
  fetchUser: () => Promise<void>;
  logout: () => void;
  setUser: (user: any) => void;
  addToWishlist: (id: string) => void;
}
type WishlistItem = {
  productId: string;
};
interface Products {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  image: string;
  discountPercentage: number;
  isActive: boolean;
}

// Create Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggingOut: false,
  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const response = await axios.get("/api/me");
      set({ user: response.data.user });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error("Failed to fetch user", error);
      }
      set({ user: null });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true }); // Show loading spinner while logging out
    try {
      await axios.post("/api/logout");
      set({ user: null });
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  addToWishlist: async (id: string) => {
    const user = useAuthStore.getState().user;
    if (!id) {
      console.log("You must provide a product id.");
      return;
    }
    if (!user) {
      console.log("You must be logged in to add to wishlist.");
      return;
    }
    try {
      const response = await axios.post(`/api/wishlist/${id}`);
      console.log(response.data);
      useAuthStore.getState().fetchUser();
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  },
}));
