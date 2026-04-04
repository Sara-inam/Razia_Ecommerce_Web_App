"use client";
import { useState } from "react";

const methods = [
  { id: "jazzcash", label: "JazzCash", logo: "/logos/jazzcash.png" },
  { id: "easypaisa", label: "EasyPaisa", logo: "/logos/easypaisa.png" },
  { id: "card", label: "Bank Card", logos: ["/logos/visa.png","/logos/mastercard.png"] },
];

function PaymentForm({ method, onPay }) {
  const labels = { jazzcash: "JazzCash Account / Phone Number", easypaisa: "EasyPaisa Account / Phone Number", card: "Card Number" };
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mt-4 shadow-lg animate-slide-down transition-all">
      <input type="text" placeholder={labels[method]} className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition" />
      {method === "card" && (
        <div className="flex gap-3 mt-3">
          <input type="text" placeholder="MM/YY" className="w-1/2 p-4 border rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"/>
          <input type="text" placeholder="CVV" className="w-1/2 p-4 border rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"/>
        </div>
      )}
      <button onClick={onPay} className="w-full mt-4 bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition shadow-md">Pay Rs 250</button>
    </div>
  );
}

export default function DeliveryPayment({ onPaid }) {
  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState(false);

  const handlePay = () => { setPaid(true); onPaid(selected); alert(`✅ Delivery Rs 250 paid via ${selected.toUpperCase()}`); }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-6 hover:shadow-2xl transition-all duration-300">
      <h3 className="text-2xl font-semibold text-gray-900">Delivery Charge Payment (Rs 250)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {methods.map(m => (
          <div key={m.id} onClick={() => setSelected(m.id)} className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1 ${selected===m.id ? "border-green-500 bg-green-50 shadow-md" : "border-gray-200 bg-white"}`}>
            {m.id==="card" ? <div className="flex gap-2">{m.logos.map((logo,i)=><img key={i} src={logo} className="w-10 h-10 object-contain"/>)}</div> : <img src={m.logo} alt={m.label} className="w-12 h-12 object-contain" />}
            <span className="font-medium text-gray-800">{m.label}</span>
          </div>
        ))}
      </div>
      {selected && !paid && <PaymentForm method={selected} onPay={handlePay} />}
      {paid && <p className="text-green-600 font-semibold text-center mt-3">✅ Delivery paid via {selected.toUpperCase()}</p>}
    </div>
  );
}