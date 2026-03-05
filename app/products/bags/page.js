"use client";

import { useState } from "react";
import Image from "next/image";

export default function BagsPage() {
  const [activeCategory, setActiveCategory] = useState("Men");

  const categories = ["Men", "Women", "School Bags"];

  const products = {
    Men: [
      {
        id: 1,
        name: "Leather Backpack",
        brand: "Urban Style",
        discount: "10% OFF",
        rating: 4.5,
        img: "/images/slider1.jpg",
        price: "Rs 2,500",
        description: "Stylish leather backpack for everyday use.",
      },
      {
        id: 2,
        name: "Canvas Sling Bag",
        brand: "TravelPro",
        discount: "15% OFF",
        rating: 4.0,
        img: "/images/slider3.jpg",
        price: "Rs 1,800",
        description: "Durable canvas sling bag, perfect for casual outings.",
      },
    ],
    Women: [
      {
        id: 3,
        name: "Handbag Classic",
        brand: "Elegance Co.",
        discount: "20% OFF",
        rating: 5,
        img: "/images/slider4.jpg",
        price: "Rs 3,200",
        description: "Elegant handbag for office or casual events.",
      },
      {
        id: 4,
        name: "Stylish Tote",
        brand: "ChicBag",
        discount: "5% OFF",
        rating: 4.2,
        img: "/images/slider1.jpg",
        price: "Rs 2,700",
        description: "Spacious tote bag for shopping or travel.",
      },
    ],
    "School Bags": [
      {
        id: 5,
        name: "Kids Cartoon Bag",
        brand: "FunBags",
        discount: "10% OFF",
        rating: 4.8,
        img: "/images/slider4.jpg",
        price: "Rs 1,200",
        description: "Fun cartoon backpack for kids.",
      },
      {
        id: 6,
        name: "Teenager Backpack",
        brand: "StudentPack",
        discount: "12% OFF",
        rating: 4.3,
        img: "/images/slider3.jpg",
        price: "Rs 1,500",
        description: "Comfortable and durable for school use.",
      },
    ],
  };

  // Function to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center mt-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {halfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-green-100 rounded-lg p-6 mb-6">
        <h1 className="text-4xl font-bold text-green-700">
          Summer Collection - Bags
        </h1>
        <p className="mt-2 text-green-900">
          Check out our latest summer collection for Men, Women & School Bags!
        </p>
      </div>

      {/* Submenu */}
      <div className="flex space-x-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeCategory === cat
                ? "bg-green-700 text-white"
                : "bg-white border border-green-200 text-green-700 hover:bg-green-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products[activeCategory].map((prod) => (
          <div
            key={prod.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative w-full h-48">
              <Image
                src={prod.img}
                alt={prod.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg text-green-700">{prod.name}</h2>
              <p className="text-green-800 text-sm">{prod.brand}</p>
              <p className="text-red-500 font-semibold">{prod.discount}</p>
              <p className="text-green-900 mt-1">{prod.price}</p>
              {renderStars(prod.rating)}
              <p className="text-green-800 mt-2 text-sm">{prod.description}</p>
              <button className="mt-4 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}