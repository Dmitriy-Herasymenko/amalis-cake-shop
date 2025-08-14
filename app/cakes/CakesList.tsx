// app/cakes/CakesList.tsx
"use client"; // Client Component для корзини та інтерфейсу
import { useState } from "react";

interface Cake {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function CakesList({ cakes }: { cakes: Cake[] }) {
  const [cart, setCart] = useState<Cake[]>([]);

  const addToCart = (cake: Cake) => setCart(prev => [...prev, cake]);
  const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.id !== id));
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-5 md:px-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-10">
        Amali's Cake Shop
      </h1>

      {/* Список тортів */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {cakes.map(cake => (
          <div
            key={cake.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <img
              src={cake.imageUrl}
              alt={cake.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{cake.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{cake.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-pink-500 font-bold text-lg">{cake.price} грн</span>
                <button
                  className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 transition"
                  onClick={() => addToCart(cake)}
                >
                  Купити
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Корзина */}
      <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-xl p-5 w-72">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Корзина</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Пусто</p>
        ) : (
          <ul className="mb-3 max-h-64 overflow-y-auto">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between text-gray-700 mb-1">
                <span>{item.name}</span>
                <div className="flex gap-2">
                  <span>{item.price} грн</span>
                  <button
                    className="text-red-500 hover:text-red-700 font-bold"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <hr className="mb-3" />
        <div className="flex justify-between font-bold text-gray-800 mb-2">
          <span>Всього:</span>
          <span>{total} грн</span>
        </div>
        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
          Оформити замовлення
        </button>
      </div>
    </div>
  );
}
