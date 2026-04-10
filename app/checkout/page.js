"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import ShippingForm from "@/components/ShippingForm";
import OrderSummary from "@/components/OrderSummary";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [shipping, setShipping] = useState({
    name: "", email: "", phone: "", address: "", city: "", postalCode: ""
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const deliveryCharge = 250;
  const subtotal = cart.reduce((a, b) => a + b.price * b.quantity, 0);
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (!shipping.name || !shipping.phone || !shipping.address) {
      toast.error("Please fill all required shipping details");
      return;
    }

    const orderData = {
      customer: shipping,
      items: cart.map(item => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.colorName,
        image: item.image.startsWith("http") 
          ? item.image 
          : `${window.location.origin}${item.image}`
      })),
      subtotal,
      deliveryCharge,
      total,
    };

    try {
      const res = await fetch(`${window.location.origin}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        setOrderPlaced(true); // ✅ set order placed
        clearCart();          // ✅ clear cart
        toast.success("Order placed successfully! ✅");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  if (orderPlaced) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-3">✅ Order Placed!</h2>
      <p className="text-gray-700 text-lg">Cash on Delivery (COD)</p>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );

  if (!cart || cart.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty 🛒</h2>
      <p className="text-gray-500 mt-2">Add some products to start shopping</p>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <ShippingForm shipping={shipping} setShipping={setShipping} />
        </div>

        <OrderSummary
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          handlePlaceOrder={handlePlaceOrder}
        />
      </div>

      {/* Toast container for notifications */}
     <ToastContainer
  position="top-right"            // top-right corner
  autoClose={4000}               // auto hide after 4s
  hideProgressBar={false}        // show progress bar
  newestOnTop={true}             // latest toast on top
  closeOnClick                   // close on click
  pauseOnFocusLoss               // pause when window loses focus
  draggable                      // draggable
  pauseOnHover                   // pause on hover
  theme="colored"                // colorful toast
/>
    </div>
  );
}