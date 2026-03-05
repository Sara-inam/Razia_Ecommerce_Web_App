"use client";

import CartItem from '@/components/CartItem';

const cart = [
  { id: 1, name: "Leather Bag", price: 2000 },
  { id: 3, name: "Wrist Watch", price: 5000 },
];

export default function CartPage() {
  if(cart.length === 0) return <p className="mt-10 text-center">Your cart is empty.</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
      <p className="mt-4 font-bold">
        Total: Rs {cart.reduce((a,b)=>a+b.price, 0)}
      </p>
    </div>
  );
}