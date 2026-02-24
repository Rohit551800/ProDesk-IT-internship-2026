import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopzone_cart')) || []; }
    catch { return []; }
  });

  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopzone_orders')) || []; }
    catch { return []; }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('shopzone_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('shopzone_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopzone_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shopzone_auth', isLoggedIn);
  }, [isLoggedIn]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const clearCart = () => setCart([]);

  // Called from Checkout when order is confirmed
  const placeOrder = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      status: 'Confirmed',
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQty, clearCart,
        cartCount, cartTotal,
        orders, placeOrder,
        isLoggedIn, login, logout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}