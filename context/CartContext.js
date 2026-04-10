"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Cart load error:", error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Cart save error:", error);
    }
  }, [cart]);

  // ➕ ADD TO CART
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) =>
          p.productId === item.productId &&
          p.colorId === item.colorId &&
          p.size === item.size
      );

      if (existing) {
        return prev.map((p) =>
          p === existing
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      return [...prev, item];
    });
  };

  // ❌ REMOVE FROM CART
  const removeFromCart = (item) => {
    setCart((prev) =>
      prev.filter(
        (p) =>
          !(
            p.productId === item.productId &&
            p.colorId === item.colorId &&
            p.size === item.size
          )
      )
    );
  };
  // 🧹 CLEAR ENTIRE CART
const clearCart = () => {
  setCart([]); // cart state empty
  try {
    localStorage.removeItem("cart"); // localStorage se bhi remove
  } catch (error) {
    console.error("Failed to clear cart from localStorage:", error);
  }
};

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);