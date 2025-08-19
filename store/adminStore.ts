// store/adminStore.ts
import { create } from "zustand";

interface AdminState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isLoggedIn: false,
  username: null,

  login: (username, password) => {
    // Для прикладу хардкод адміна
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "123456";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      set({ isLoggedIn: true, username });
      return true;
    } else {
      return false;
    }
  },

  logout: () => set({ isLoggedIn: false, username: null }),
}));
