import { FaInstagram, FaFacebook, FaTelegram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#503D2F] text-white px-6 py-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Ліва колонка: логотип + соцмережі + адреса */}
                <div className="md:w-1/3 flex flex-col gap-4 relative">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">Amalis Cake Shop</span>
                    </div>
                    <p>м. Кропивницький, вул. Смачний Торт, 15</p>
                    <div className="flex gap-4 text-xl">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                            <FaInstagram />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                            <FaFacebook />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                            <FaTelegram />
                        </a>
                    </div>

                    {/* Вертикальна біла смужка справа */}
                    <div className="hidden md:block absolute top-0 right-0 h-full w-px bg-white"></div>
                </div>

                {/* Права частина: інформаційні колонки */}
                <div className="md:w-2/3 flex justify-between gap-8">
                    {/* Перша права колонка */}
                    <div className="text-right">
                        <h3 className="font-semibold mb-4">Інформація</h3>
                        <ul className="space-y-2">
                            <li><a href="/cakes" className="hover:text-pink-500">Каталог тортів</a></li>
                            <li><a href="/custom-cakes" className="hover:text-pink-500">Конструктор торта</a></li>
                            <li><a href="/contacts" className="hover:text-pink-500">Контакти</a></li>
                        </ul>
                    </div>

                    <div className="text-right">
                        <h3 className="font-semibold mb-4">Інформація</h3>
                        <ul className="space-y-2">
                            <li><a href="/cakes" className="hover:text-pink-500">Каталог тортів</a></li>
                            <li><a href="/custom-cakes" className="hover:text-pink-500">Конструктор торта</a></li>
                            <li><a href="/contacts" className="hover:text-pink-500">Контакти</a></li>
                        </ul>
                    </div>

                    {/* Друга права колонка */}
                    <div className="text-right">
                        <h3 className="font-semibold mb-4">Контакти</h3>
                        <ul className="space-y-2">
                            <li>Телефон: +380 93 817 11 66</li>
                            <li>Email: info@amaliscakes.com</li>
                            <li>Графік роботи: 9:00 - 21:00</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-gray-300 text-sm">
                &copy; 2024 Amalis Cake Shop. All rights reserved.
            </div>
        </footer>
    );
}
