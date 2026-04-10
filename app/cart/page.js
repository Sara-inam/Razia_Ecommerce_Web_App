"use client";

import CartItem from "@/components/CartItem";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function CartPage() {
  const { cart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [showLogin, setShowLogin] = useState(false);

  // If user logs in while modal is open, close modal and redirect
  useEffect(() => {
    if (user && showLogin) {
      setShowLogin(false);
      router.push("/checkout");
    }
  }, [user, showLogin, router]);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Your cart is empty 🛒
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Add some products to see them here
        </p>
      </div>
    );
  }

  const total = cart.reduce((a, b) => a + b.price * b.quantity, 0);

  const handleCheckout = () => {
  if (loading) return; // do nothing while auth is loading

  if (!user) {
    setShowLogin(true); // show login modal
    return;
  }

  router.push("/checkout"); // go to checkout if logged in
};
  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        🛒 Shopping Cart
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {cart.map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-lg p-5 sticky top-24">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Order Summary
            </h3>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>Rs {total}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>Rs {total}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <LoginForm show={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}