import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  img: string;
  quantity: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, quantity = 1) => {
        const id = String(product?.id ?? product?.slug ?? product?.name ?? '');
        if (!id) {
          toast.error('Could not add this item to the cart.');
          return;
        }

        const addQty = Math.max(1, Math.floor(quantity) || 1);
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity + addQty }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id,
                name: String(product?.name ?? 'Item'),
                price: String(product?.price ?? '0'),
                img: String(product?.img ?? ''),
                slug: String(product?.slug ?? id),
                quantity: addQty,
              },
            ],
          });
        }

        set({ isOpen: true });
        toast.success(`${product?.name ?? 'Item'} added to cart`);
      },
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseInt(String(item.price).replace(/,/g, ''), 10) || 0;
          return total + price * item.quantity;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'sparklights-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
