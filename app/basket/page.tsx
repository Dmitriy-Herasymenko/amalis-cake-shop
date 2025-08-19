"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useState } from "react";

export default function BasketPage() {
  const { cart, removeFromCart /*, clearCart*/ } = useCartStore();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderDone, setOrderDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
    setFormData(data);
    setStep(3);
  };

  const submitOrder = async (payment: string) => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const body = {
        ...formData,
        payment,
        items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })),
        totalPrice,
      };

      console.log("Sending order:", body);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Server response:", data);

      // поки закоментовано, щоб корзина не очищалась і не переходило на сторінку успіху
      // setOrderDone(true);
      // clearCart();
    } catch (err) {
      console.error("Error sending order:", err);
      alert("Помилка при оформленні замовлення");
    } finally {
      setLoading(false);
    }
  };

  if (orderDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">
          ✅ Замовлення прийнято!
        </h1>
        <Link
          href="/cakes"
          className="text-pink-500 underline hover:text-pink-700 text-lg"
        >
          Повернутись до каталогу
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-pink-600">
          Ваша корзина порожня
        </h1>
        <Link
          href="/cakes"
          className="text-pink-500 underline hover:text-pink-700 text-lg"
        >
          Переглянути торти
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-5 md:px-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-10">
        Оформлення замовлення
      </h1>

      {/* Крок 1: Корзина */}
      {step === 1 && (
        <>
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className={`flex items-center justify-between bg-white rounded-2xl shadow-md p-4 transition-all duration-300 transform ${
                  removingId === item.id ? "opacity-0 -translate-x-20" : "opacity-100 translate-x-0"
                }`}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-500">{item.price} грн</p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 font-bold hover:text-red-700 transition cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center font-bold text-gray-800 text-xl">
            <span>Всього:</span>
            <span>{totalPrice} грн</span>
          </div>

          <button
            onClick={() => setStep(2)}
            className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition text-lg font-semibold cursor-pointer"
          >
            Далі
          </button>
        </>
      )}

      {/* Крок 2: Форма */}
      {step === 2 && (
        <form
          onSubmit={handleFormSubmit}
          className="mt-6 bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          <input type="text" name="name" placeholder="Ім'я" required className="w-full p-3 border rounded-lg" />
          <input type="tel" name="phone" placeholder="Номер телефону" required className="w-full p-3 border rounded-lg" />
          <input type="text" name="address" placeholder="Адреса доставки" required className="w-full p-3 border rounded-lg" />

          <label className="flex items-center space-x-2">
            <input type="checkbox" name="callBack" className="w-4 h-4" />
            <span>Передзвонити мені</span>
          </label>

          <div className="flex space-x-4">
            <button type="submit" className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
              Далі
            </button>
            <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
              Назад
            </button>
          </div>
        </form>
      )}

      {/* Крок 3: Оплата */}
      {step === 3 && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md space-y-4">
          <p className="font-semibold mb-2">Спосіб оплати:</p>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="paypass"
              checked={paymentMethod === "paypass"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>PayPass</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>При отриманні</span>
          </label>

          <button
            disabled={loading || !paymentMethod}
            onClick={() => submitOrder(paymentMethod)}
            className={`w-full py-3 rounded-lg text-white ${
              paymentMethod === "paypass" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {paymentMethod === "paypass" ? `Оплатити ${totalPrice} грн` : "Підтвердити замовлення"}
          </button>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
          >
            Назад
          </button>
        </div>
      )}
    </div>
  );
}
