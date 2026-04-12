// export default function CategoryPage({ params }) {
//   const { category } = params;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-10">
//       {/* Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold capitalize text-gray-800">
//           {category}
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Explore best {category} products
//         </p>
//       </div>

//       {/* Placeholder grid */}
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {[1, 2, 3, 4, 5, 6].map((item) => (
//           <div
//             key={item}
//             className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
//           >
//             {/* Image placeholder */}
//             <div className="h-40 bg-gradient-to-r from-green-100 to-green-200"></div>

//             {/* Content */}
//             <div className="p-4">
//               <h3 className="font-semibold text-gray-800">
//                 {category} Product {item}
//               </h3>

//               <p className="text-sm text-gray-500 mt-1">
//                 High quality {category} item
//               </p>

//               <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
//                 View Product
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }