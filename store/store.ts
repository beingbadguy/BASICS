import { create } from "zustand";
import axios from "axios";

// Define the shape of your authentication state
interface AuthState {
  user: { name: string; email: string; isVerified: boolean } | null;
  isLoggingOut: boolean;
  fetchUser: () => Promise<void>;
  logout: () => void;
  setUser: (user: any) => void;
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
    } catch (error) {
      console.error("Failed to fetch user", error);
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
}));
