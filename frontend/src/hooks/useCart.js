import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';

export const useCart = () => {
  const cart = useCartStore();

  useEffect(() => {
    const savedCart = localStorage.getItem('hydronova_cart');
    if (savedCart) {
      cart.setItems(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    cart.addItem(product, quantity);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      cart.removeItem(productId);
      return;
    }
    cart.updateQuantity(productId, quantity);
  };

  const removeFromCart = (productId) => {
    cart.removeItem(productId);
  };

  const clearCart = () => {
    cart.clearCart();
  };

  return {
    ...cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};