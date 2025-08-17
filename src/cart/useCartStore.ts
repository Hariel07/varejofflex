import { create } from "zustand";

type CartItem = { productId: string; name: string; unitPrice: number; qty: number };
type State = {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
  deliveryFee: number;
  setDeliveryFee: (v: number) => void;
  add: (it: CartItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setCoupon: (code?: string, discount?: number) => void;
  subtotal: () => number;
  total: () => number;
};

export const useCartStore = create<State>((set, get) => ({
  items: [],
  deliveryFee: 0,
  setDeliveryFee: (v) => set(() => ({ deliveryFee: v })),
  add: (it) => {
    const items = [...get().items];
    const idx = items.findIndex(i => i.productId === it.productId);
    if (idx >= 0) items[idx].qty += it.qty; else items.push(it);
    set({ items });
  },
  remove: (productId) => set({ items: get().items.filter(i => i.productId !== productId) }),
  clear: () => set({ items: [], couponCode: undefined, discount: 0 }),
  setCoupon: (code, discount) => set({ couponCode: code, discount }),
  subtotal: () => get().items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
  total: () => {
    const s = get().subtotal();
    const d = get().discount || 0;
    return Number((s - d + (get().deliveryFee || 0)).toFixed(2));
  },
}));
