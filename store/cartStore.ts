import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Cake {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  cart: Cake[];
  addToCart: (cake: Cake) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (cake) =>
        set((state) => {
          const existing = state.cart.find((c) => c.id === cake.id);
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.id === cake.id ? { ...c, quantity: c.quantity + 1 } : c
              ),
            };
          }
          return { cart: [...state.cart, { ...cake, quantity: 1 }] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((c) => c.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((c) => (c.id === id ? { ...c, quantity } : c))
            .filter((c) => c.quantity > 0), // якщо 0 → видаляємо
        })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart-storage" }
  )
);
