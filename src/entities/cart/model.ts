import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // short_id LTT-билета (используется как ticket id для покупки)
  price: number;
  type: "super" | "other";
  ticketNumber: string;
  // LTT-билеты не содержат пользовательской комбинации — поле опциональное
  combination?: number[];
  lotteryId: string;
  // drawId теперь число (ltt_id); строка допускается для legacy-совместимости
  drawId: number | string;
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
