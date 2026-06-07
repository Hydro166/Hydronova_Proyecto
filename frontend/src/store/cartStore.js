import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find(item => item.productId === product.id);

    let newItems;
    if (existingItem) {
      newItems = items.map(item =>
        item.productId === product.id
          ? { ...item, cantidad: item.cantidad + quantity }
          : item
      );
    } else {
      newItems = [
        ...items,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          nombre: product.nombre,
          precio: product.precio,
          precioFinal: product.precio,
          imagenUrl: product.imagenUrl,
          cantidad: quantity,
          subtotal: product.precio * quantity
        }
      ];
    }

    set({ items: newItems });
    get().calculateTotal();
    localStorage.setItem('hydronova_cart', JSON.stringify(newItems));
  },

  updateQuantity: (productId, cantidad) => {
    const items = get().items.map(item =>
      item.productId === productId
        ? { ...item, cantidad, subtotal: item.precio * cantidad }
        : item
    );
    set({ items });
    get().calculateTotal();
    localStorage.setItem('hydronova_cart', JSON.stringify(items));
  },

  removeItem: (productId) => {
    const items = get().items.filter(item => item.productId !== productId);
    set({ items });
    get().calculateTotal();
    localStorage.setItem('hydronova_cart', JSON.stringify(items));
  },

  clearCart: () => {
    set({ items: [], total: 0 });
    localStorage.removeItem('hydronova_cart');
  },

  setItems: (items) => {
    set({ items });
    get().calculateTotal();
    localStorage.setItem('hydronova_cart', JSON.stringify(items));
  },

  calculateTotal: () => {
    const items = get().items;
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    set({ total: parseFloat(total.toFixed(2)) });
  },

  getItemCount: () => get().items.length
}));
