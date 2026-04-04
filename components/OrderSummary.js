"use client";
import React from "react";

export default function OrderSummary({ subtotal, deliveryCharge, handlePlaceOrder }) {
  const total = subtotal + deliveryCharge;

  return (
    <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-xl p-8 sticky top-24 space-y-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <h3 className="text-2xl font-semibold text-gray-900">Order Summary</h3>
      <div className="flex justify-between text-gray-600">
        <span>Subtotal (COD)</span>
        <span>Rs {subtotal}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Delivery Charges</span>
        <span>Rs {deliveryCharge}</span>
      </div>
      <hr className="border-gray-200" />
      <div className="flex justify-between font-bold text-gray-900 text-lg">
        <span>Total</span>
        <span>Rs {total}</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full mt-5 bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition shadow-md"
      >
        Place Order
      </button>
    </div>
  );
}