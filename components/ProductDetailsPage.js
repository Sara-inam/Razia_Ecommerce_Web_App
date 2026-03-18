// "use client";

// import { useState } from "react";

// export default function ProductDetails({ product }) {
//   const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
//   const [selectedSize, setSelectedSize] = useState(selectedColor?.stock?.[0]?.size || "");
//   const [quantity, setQuantity] = useState(1);

//   const handleColorClick = (color) => {
//     setSelectedColor(color);
//     setSelectedSize(color.stock?.[0]?.size || "");
//     setQuantity(1);
//   };

//   const increaseQty = () => {
//     if (selectedColor && quantity < selectedColor.stock.length) setQuantity(qty => qty + 1);
//   };
//   const decreaseQty = () => {
//     if (quantity > 1) setQuantity(qty => qty - 1);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      
//       {/* Image Section */}
//       <div className="flex-1 flex flex-col items-center">
//         <img
//           src={selectedColor?.images?.[0] || "/placeholder.png"}
//           alt={product.name}
//           className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-lg"
//         />
//       </div>

//       {/* Details Section */}
//       <div className="flex-1 flex flex-col">
//         <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
//         <p className="text-gray-500 mb-4">Brand: {product.brand?.brand_name || "Unknown"}</p>

//         {/* Price */}
//         <div className="mb-4 flex items-center gap-2">
//           {product.discountPercentage > 0 ? (
//             <>
//               <span className="line-through text-gray-400 text-lg">Rs {product.price}</span>
//               <span className="text-green-600 font-bold text-xl">Rs {product.discountPrice}</span>
//             </>
//           ) : (
//             <span className="text-gray-900 font-bold text-xl">Rs {product.price}</span>
//           )}
//         </div>

//         {/* Color Selection */}
//         {product.colors?.length > 0 && (
//           <div className="flex gap-3 mb-4">
//             {product.colors.map((color, idx) =>
//               color.images?.[0] ? (
//                 <img
//                   key={idx}
//                   src={color.images[0]}
//                   alt={`${product.name} color ${idx + 1}`}
//                   onClick={() => handleColorClick(color)}
//                   className={`w-12 h-12 rounded-full border-2 cursor-pointer object-cover transition-transform duration-300 ${
//                     selectedColor === color
//                       ? "border-green-600 scale-110 shadow-lg"
//                       : "border-gray-300"
//                   }`}
//                 />
//               ) : null
//             )}
//           </div>
//         )}

//         {/* Size & Quantity */}
//         <div className="flex items-center gap-4 mb-6">
//           {/* Size */}
//           {selectedColor?.stock?.length > 0 && (
//             <select
//               value={selectedSize}
//               onChange={(e) => setSelectedSize(e.target.value)}
//               className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               {selectedColor.stock.map((s) => (
//                 <option key={s.size} value={s.size}>{s.size}</option>
//               ))}
//             </select>
//           )}

//           {/* Quantity */}
//           {selectedColor?.stock?.length > 0 && (
//             <div className="flex items-center border rounded-md overflow-hidden">
//               <button onClick={decreaseQty} className="px-3 py-1 hover:bg-gray-100 transition">-</button>
//               <span className="px-4">{quantity}</span>
//               <button onClick={increaseQty} className="px-3 py-1 hover:bg-gray-100 transition">+</button>
//             </div>
//           )}
//         </div>

//         {/* Add to Cart */}
//         <button
//           className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold transition"
//           disabled={!selectedColor || !selectedSize}
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// }