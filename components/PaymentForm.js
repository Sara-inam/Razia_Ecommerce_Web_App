"use client";

export default function PaymentForm({ method, onPay }) {
  const labels = {
    jazzcash: "JazzCash Account / Phone Number",
    easypaisa: "EasyPaisa Account / Phone Number",
    card: "Card Number",
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-3 shadow-sm animate-slide-down">
      <input
        type="text"
        placeholder={labels[method]}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        onClick={() => onPay()}
        className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Pay Rs 250
      </button>
    </div>
  );
}