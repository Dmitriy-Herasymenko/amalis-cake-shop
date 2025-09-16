"use client";
import Link from 'next/link'

export function Sidebar() {
    return (
        <aside className="w-48 my-12 ml-12 bg-white shadow-xl rounded-2xl p-8 flex flex-col">
            <h2 className="text-l font-bold mb-10 text-[#AA824D] text-center">Amali's Panel</h2>
            <nav className="flex flex-col gap-2 items-center text-xs">
                <Link
                    href="/dashboard"
                    className="px-2 py-1 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
                >
                    Головна
                </Link>
                <Link
                    href="/dashboard/cakes"
                    className="px-2 py-1 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
                >
                    Торти
                </Link>
                <Link
                    href="/dashboard/orders"
                    className="px-2 py-1 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
                >
                    Замовлення
                </Link>
                <Link
                    href="/dashboard/users"
                    className="px-2 py-1 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
                >
                    Користувачі
                </Link>
            </nav>
            <div className="mt-auto">
                <button className="w-full bg-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-red-600 transition-all">
                    Вийти
                </button>
            </div>
        </aside>
    )
}