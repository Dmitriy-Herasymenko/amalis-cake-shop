"use client";

import Link from "next/link";
import { Icons } from "../components/Icons";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  
  const cartCount = useCartStore((state) => state.cart.length);

  return (
    <nav className="bg-[#402300] shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Логотип */}
      <Link href="/" className="text-2xl font-bold text-[#AA824D]">
        Amali&apos;s Cake Shop
      </Link>

      {/* Навігація */}
      <div className="hidden md:flex space-x-2 font-medium text-white">
        <Link href="/" className="hover:text-pink-600 transition">
          Головна
        </Link>
        <Link href="/cakes" className="hover:text-pink-600 transition">
          Торти
        </Link>
        <Link href="/custom-cakes" className="hover:text-pink-600 transition">
          Конструктор торта
        </Link>
        <Link href="/contacts" className="hover:text-pink-600 transition">
          Контакти
        </Link>
      </div>

      {/* Іконка корзини */}
      <div className="flex gap-4 font-medium text-white">
        <Link href="/track-order" className="">Відстежити замовлення</Link>
        <Link href="/basket" className="relative">

          <Icons.ShoppingCart className="w-7 h-7 text-white hover:text-pink-600 transition" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

    </nav>
  );
}
