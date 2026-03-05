"use client";

export default function CartItem({ item }) {
  return (
    <div className="bg-white p-4 shadow-md rounded mb-2 flex justify-between">
      <span>{item.name}</span>
      <span>Rs {item.price}</span>
    </div>
  );
}