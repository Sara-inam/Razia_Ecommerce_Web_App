"use client";
import React from "react";

export default function ShippingForm({ shipping, setShipping }) {
  const handleChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <h3 className="text-2xl font-semibold text-gray-900">Shipping Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shipping.name}
          onChange={handleChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={shipping.email}
          onChange={handleChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={shipping.phone}
          onChange={handleChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shipping.address}
          onChange={handleChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shipping.city}
          onChange={handleChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shipping.postalCode}
          onChange={handleChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
        />
      </div>
    </div>
  );
}