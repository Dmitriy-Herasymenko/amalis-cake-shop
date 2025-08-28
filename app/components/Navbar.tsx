"use client";

import Link from "next/link";
import { Icons } from "../components/Icons";
import { useCartStore } from "@/store/cartStore";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.cart.length);

    const navLinks = [
    { href: "/", label: "Головна" },
    { href: "/cakes", label: "Торти" },
    { href: "/custom-cakes", label: "Конструктор торта" },
    { href: "/contacts", label: "Контакти" },
    { href: "/track-order", label: "Відстежити замовлення" },
  ];

  return (
    <nav className="bg-[#fff]  px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Логотип */}
      <Link href="/" className="text-xl  flex items-center uppercase font-bold text-[#AA824D]">
        Amali&apos;s Cake Shop Logo
      </Link>

      {/* Навігація */}
   <div className="hidden flex items-center  md:flex space-x-6 text-[300] text-[12px] uppercase text-[#202020]">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`relative pb-1 transition 
            ${pathname === link.href ? " border-b-2 border-[#EFEADE]" : "hover:text-pink-600 hover:border-b-2 hover:border-pink-600"}`
          }
        >
          {link.label}
        </Link>
      ))}
      <Link href="/basket" className="relative">
        <svg
          className="w-7 h-7 text-[#202020] hover:text-pink-600 transition"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9v9m-4-9v9"
          />
        </svg>
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
