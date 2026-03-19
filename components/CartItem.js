"use client";

import { useCart } from "@/context/CartContext";

export default function CartItem({ item }) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-md hover:shadow-lg transition">

      {/* Image */}
      <div className="w-full sm:w-24 flex-shrink-0">
        <img
          src={item.image || "/placeholder.png"}
          alt={item.name}
          className="w-full h-32 sm:h-24 object-cover rounded-xl border"
        />
      </div>

      {/* Details */}
      <div className="flex-1 w-full">

        {/* Name */}
        <h3 className="font-semibold text-lg sm:text-xl text-gray-800">
          {item.name}
        </h3>

        {/* Info */}
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
          <p>
            Color:{" "}
            <span className="font-medium text-gray-800">
              {item.colorName || "N/A"}
            </span>
          </p>

          <p>
            Size:{" "}
            <span className="font-medium text-gray-800">
              {item.size || "N/A"}
            </span>
          </p>

          <p>
            Quantity:{" "}
            <span className="font-medium text-gray-800">
              {item.quantity}
            </span>
          </p>

          <p>
            Price:{" "}
            <span className="font-bold text-green-600">
              Rs {item.price}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">

          {/* Remove Button */}
          <button
            onClick={() => removeFromCart(item)}
            className="text-red-500 text-sm font-medium hover:text-red-600 hover:underline transition"
          >
            Remove
          </button>

        </div>
      </div>
    </div>
  );
}