"use client";

import Image from "next/image";
import { useState } from "react";
import { popularCakes } from "./const";


function HeroSection() {
    return (
        <section
            className="relative h-[80vh] w-full flex items-center justify-center text-white 
             sm:h-[70vh] xs:h-[60vh]"
            style={{
                backgroundImage: `url('https://plus.unsplash.com/premium_photo-1680172800933-ae8462274162?q=80&w=2787&auto=format&fit=crop')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed", // легкий паралакс
            }}
        >
            <div className="p-6 rounded text-center max-w-lg sm:max-w-md xs:max-w-full">
                <h1 className="text-4xl font-bold mb-2 sm:text-3xl xs:text-2xl">
                    Наш магазин тортів
                </h1>
                <p className="text-lg sm:text-base xs:text-sm">
                    Смачні та унікальні торти на будь-яку подію
                </p>
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
        <section className="py-16 px-6 md:px-20">
            <h2 className="text-2xl text-[#B3986B] text-center max-sm:text-lg">
                Популярні торти
            </h2>

            <div className="flex flex-col md:flex-row gap-8 mt-8">
                {/* Ліва колонка */}
                <div className="md:w-1/3 bg-[#503D2F] text-white p-8 flex flex-col justify-center max-sm:p-4">
                    <h2 className="text-3xl font-bold text-center max-sm:text-xl">
                        Популярні торти
                    </h2>
                    <p className="text-gray-300 text-center mt-8 max-sm:mt-4 max-sm:text-sm">
                        Це наші найпопулярніші торти, які замовляють найчастіше. Спробуйте і ви!
                    </p>
                    <button className="bg-[#C49E6A] py-2 px-4 text-[#382A1C] mt-8 max-sm:mt-4 max-sm:text-sm">
                        Дивитися всі
                    </button>
                </div>

                {/* Права колонка — слайдер */}
                <div className="md:w-2/3 grid grid-cols-4 gap-4 max-sm:grid-cols-2">
                    {visibleCakes.map((cake) => (
                        <div
                            key={cake.id}
                            className="bg-white overflow-hidden shadow-md hover:scale-105 transition-transform"
                        >
                            <img
                                src={cake.image}
                                alt={cake.name}
                                className="w-full h-60 object-cover max-sm:h-40"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Стрілки */}
            <div className="flex justify-end gap-4 mt-6 max-sm:justify-center">
                <button
                    onClick={prev}
                    className="text-[#BEA787] p-2 rounded-full transition cursor-pointer max-sm:text-sm"
                >
                    ←
                </button>
                <button
                    onClick={next}
                    className="text-[#BEA787] p-2 rounded-full transition cursor-pointer max-sm:text-sm"
                >
                    →
                </button>
            </div>
        </section>

    );

}

function AboutUS() {
    return (
        <section className="p-10 text-center bg-[#C49E6A] px-32 max-sm:px-4 max-sm:py-6">
            <h2 className="text-4xl font-[700] text-[#FFFCF2] max-sm:text-2xl">
                Про нас
            </h2>
            <p className="text-[#FFFCF2] px-32 mt-4 max-sm:px-2 max-sm:text-sm max-sm:mt-2">
                {
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
                }
            </p>
        </section>

    );
}

function About() {
    return (
        <section className="p-10 text-center bg-[#EFEADE] px-32 mt-12 max-sm:px-4 max-sm:py-6 max-sm:mt-6">
            <div className="flex gap-12 max-sm:flex-col max-sm:gap-4">
                <img
                    src={"https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={"photo"}
                    className="max-w-[1200px] h-140 object-cover max-sm:h-auto max-sm:w-full"
                />

                <div className="bg-[#503D2F] w-full flex flex-col px-8 items-center pt-12 max-sm:px-4 max-sm:pt-6">
                    <h2 className="text-4xl text-white max-sm:text-2xl">What is Lorem Ipsum</h2>
                    <div className="border-t border-[#BFA681] my-2 w-[148px] max-sm:w-24"></div>
                    <p className="text-sm text-white leading-[40px] mt-12 max-sm:mt-4 max-sm:leading-6 max-sm:text-xs">
                        {"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy."}
                    </p>
                    <button className="bg-[#C69D6C] px-12 py-2 text-[12px] uppercase text-[#251309] mt-12 max-sm:px-6 max-sm:py-2 max-sm:text-[10px] max-sm:mt-4 mb-8">
                        Click
                    </button>
                </div>
            </div>
        </section>

    );
}

function ContactUs() {
    return (
        <section className="p-10 text-center bg-[#EFEADE] px-32 mt-12 max-sm:px-4 max-sm:py-6 max-sm:mt-6">
            <div className="flex gap-12 max-sm:flex-col max-sm:gap-4">
                <div className="w-full flex flex-col px-8 items-center pt-12 max-sm:px-4 max-sm:pt-6">
                    <h2 className="text-4xl text-[#B5A285] max-sm:text-2xl">Контакти</h2>
                    <div className="border-t border-[#BFA681] my-2 w-[148px] max-sm:w-24"></div>
                    <div className="flex justify-between w-full mt-24 max-sm:flex-col max-sm:mt-4 max-sm:gap-4">
                        <div className="flex flex-col items-start">
                            <p className="text-sm text-[#B5A285] mt-2">Телефон:</p>
                            <p className="text-sm text-[#B5A285] mt-2">Email:</p>
                            <p className="text-sm text-[#B5A285] mt-2">Адреса:</p>
                        </div>
                        <div className="flex flex-col text-right items-end max-sm:text-left max-sm:items-start">
                            <p className="text-sm text-[#B5A285] mt-2">+38 (093) 345-67-89</p>
                            <p className="text-sm text-[#B5A285] mt-2">amalis@gmail.com</p>
                            <p className="text-sm text-[#B5A285] mt-2 max-w-[200px]">вул. Смачних Тортів, 123, Кропивницький, Україна</p>
                        </div>
                    </div>
                </div>
                <img
                    src={"https://www.kypur.net/wp-content/uploads/2024/08/fb.-brenduvannya1.jpg"}
                    alt={"photo"}
                    className="max-w-[1200px] h-140 object-cover max-sm:h-auto max-sm:w-full"
                />
            </div>
        </section>

    );
}

export default function MainPage() {
    return (
        <main>
            <HeroSection />
            <PopularSection />
            <AboutUS />
            <About />
            <ContactUs />
        </main>
    );
}
