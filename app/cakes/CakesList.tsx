"use client";
import { useCartStore } from "@/store/cartStore";

interface Cake {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function CakesList({ cakes }: { cakes: Cake[] }) {
  const { addToCart } = useCartStore();

  return (
    <div className="min-h-screen  ">

      {/* Список тортів */}
      <div className="px-6 md:px-20 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {cakes.map((cake:Cake, idx) => (
            <div
              key={cake.id}
              className="relative rounded-[12px] shadow-xl overflow-hidden  "
            >
              {/* бейдж */}
              {idx % 2 === 0 && (
                <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  NEW
                </span>
              )}
              <img
                src={cake.imageUrl}
                alt={cake.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex flex-col justify-between h-56">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {cake.name}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {cake.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[#AA824D] font-extrabold text-xl">
                    {cake.price} грн
                  </span>
                  <button
                    onClick={() => addToCart({ ...cake, quantity: 1 })}
                    className="bg-[#B17F44] cursor-pointer text-white px-4 py-2 rounded-xl shadow-md hover:bg-inherit hover:border-[1px] hover:border-black hover:text-black active:scale-95 transition"
                  >
                    Купити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
