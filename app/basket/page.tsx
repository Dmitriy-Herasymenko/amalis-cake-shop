"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useState } from "react";

export default function BasketPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderDone, setOrderDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    // Розгортаємо кількість у дублікати
    const expandedItems = cart.flatMap(item =>
      Array(item.quantity).fill({
        id: item.id,
        name: item.name,
        price: item.price,
      })
    );

    const body = {
      ...formData,
      payment,
      deliveryType,
      store: deliveryType === "PICKUP" ? selectedStore : null,
      items: expandedItems,
      totalPrice,
    };

    // 🔹 Спочатку створюємо замовлення
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setOrderNumber(data.orderNumber || "не визначено");

    // 🔹 Якщо вибрали PayPass → йдемо в LiqPay
    if (payment === "paypass") {
      const payRes = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          orderId: data.orderNumber,
        }),
      });

      const payData = await payRes.json();
      // 🔹 Створюємо форму та відправляємо у LiqPay
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.liqpay.ua/api/3/checkout";
      form.acceptCharset = "utf-8";

      const inputData = document.createElement("input");
      inputData.type = "hidden";
      inputData.name = "data";
      inputData.value = payData.data;
      form.appendChild(inputData);

      const inputSignature = document.createElement("input");
      inputSignature.type = "hidden";
      inputSignature.name = "signature";
      inputSignature.value = payData.signature;
      form.appendChild(inputSignature);

      document.body.appendChild(form);
      form.submit();
    } else {
      // 🔹 Якщо готівка → просто показуємо успіх
      setOrderDone(true);
      clearCart();
    }
  } catch (err) {
    console.error("Error sending order:", err);
    alert("Помилка при оформленні замовлення");
  } finally {
    setLoading(false);
  }
};


  // ✅ Замовлення успішне
  if (orderDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">
          ✅ Замовлення прийнято!
        </h1>
        <p className="mb-4">
          Номер вашого замовлення: <span className="font-bold">{orderNumber}</span>
        </p>
        <Link
          href="/cakes"
          className="text-pink-500 underline hover:text-pink-700 text-lg"
        >
          Повернутись до каталогу
        </Link>
      </div>
    );
  }

  // ✅ Порожня корзина
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center justify-between bg-white rounded-2xl shadow-md p-4"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-500">{item.price} грн</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 font-bold hover:text-red-700 transition cursor-pointer text-xl"
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

          <div>
            <p className="font-semibold mb-1">Тип доставки:</p>
            <select
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value as "PICKUP" | "DELIVERY")}
              className="w-full p-3 border rounded-lg"
            >
              <option value="PICKUP">Самовивіз зі магазину</option>
              <option value="DELIVERY">Доставка за адресою</option>
            </select>
          </div>

          {deliveryType === "PICKUP" && (
            <div>
              <p className="font-semibold mb-1">Виберіть магазин:</p>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Оберіть магазин</option>
                <option value="Store 1">Store 1</option>
                <option value="Store 2">Store 2</option>
              </select>
            </div>
          )}

          {deliveryType === "DELIVERY" && (
            <input
              type="text"
              name="address"
              placeholder="Ваша адреса"
              required
              className="w-full p-3 border rounded-lg"
            />
          )}

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
