import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Cake {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface CartState {
  cart: Cake[];
  addToCart: (cake: Cake) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (cake) =>
        set((state) => ({ cart: [...state.cart, cake] })),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((c) => c.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart-storage" }
  )
);
