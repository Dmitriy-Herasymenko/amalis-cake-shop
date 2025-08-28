"use client";

import Image from "next/image";
import { useState } from "react";

type Cake = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const popularCakes: Cake[] = [
  { id: 1, name: "Полуничний торт", price: 550, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 2, name: "Медовий торт", price: 600, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 3, name: "Шоколадний торт", price: 650, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 4, name: "Фруктовий торт", price: 500, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 5, name: "Морквяний торт", price: 580, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 6, name: "Ванільний торт", price: 530, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 7, name: "Торт з горіхами", price: 620, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 8, name: "Кавовий торт", price: 600, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
   { id: 9, name: "Фруктовий торт", price: 500, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 10, name: "Морквяний торт", price: 580, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 11, name: "Ванільний торт", price: 530, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 12, name: "Торт з горіхами", price: 620, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { id: 13, name: "Кавовий торт", price: 600, image: "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0" }
];

// Hero секція
function HeroSection() {
  return (
<section
  className="relative h-[80vh] w-full flex items-center justify-center text-white"
  style={{
    backgroundImage: `url('https://plus.unsplash.com/premium_photo-1680172800933-ae8462274162?q=80&w=2787&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', // легкий паралакс
  }}
>
  <div className="p-6 rounded text-center max-w-lg">
    <h1 className="text-4xl font-bold mb-2">Наш магазин тортів</h1>
    <p className="text-lg">Смачні та унікальні торти на будь-яку подію</p>
  </div>
</section>

  );
}

function PopularSection() {
 const [index, setIndex] = useState(0); 

  const visibleCakes = popularCakes.slice(index, index + 8);

  const prev = () => {
    setIndex((prev) => (prev - 8 < 0 ? popularCakes.length - 8 : prev - 8));
  };

  const next = () => {
    setIndex((prev) => (prev + 8 >= popularCakes.length ? 0 : prev + 8));
  };

  return (
    <section className="py-16 px-6 md:px-20 ">
        <h2 className="text-2xl text-[#B3986B] text-center">Популярні торти</h2>
      
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Ліва колонка */}
        <div className="md:w-1/3 bg-[#503D2F] text-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold  text-center">Популярні торти</h2>
          <p className="text-gray-300 text-center mt-8">
            Це наші найпопулярніші торти, які замовляють найчастіше. Спробуйте і ви!
          </p>
          <button className="bg-[#C49E6A] py-2 px-4 text-[#382A1C] mt-8">Дивитися всі</button>
        </div>

        {/* Права колонка — слайдер */}
        <div className="md:w-2/3 grid grid-cols-4 gap-4">
          {visibleCakes.map((cake) => (
            <div
              key={cake.id}
              className="bg-white  overflow-hidden shadow-md hover:scale-105 transition-transform"
            >
              <img
                src={cake.image}
                alt={cake.name}
                className="w-full h-60 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Стрілки */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={prev}
          className="text-[#BEA787] p-2 rounded-full transition cursor-pointer"
        >
          ←
        </button>
        <button
          onClick={next}
          className="text-[#BEA787] p-2 rounded-full transition cursor-pointer"
        >
          →
        </button>
      </div>
    </section>
  );

}
// Друга секція
function About() {
  return (
    <section className="p-10 text-center  bg-[#C49E6A] px-32">
      <h2 className="text-4xl font-[700] text-[#FFFCF2]">Про нас</h2>
      <p className="text-[#FFFCF2] px-32 mt-4">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
    </section>
  );
}

// Головна сторінка
export default function MainPage() {
  return (
    <main>
      <HeroSection />
      <PopularSection />
      <About />
    </main>
  );
}
