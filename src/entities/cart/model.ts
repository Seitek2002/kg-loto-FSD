import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // Это ticketId
  price: number;
  type: "super" | "other";
  ticketNumber: string;
  combination: number[];
  lotteryId: string;
  drawId: string;
  name: string;
}

interface CartStore {
  items: CartItem[];
  toggleItem: (item: CartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== item.id) };
          }
          return { items: [...state.items, item] };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
