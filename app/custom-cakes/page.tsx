"use client";

import { useState, useEffect } from "react";

type IngredientType = {
  id: number;
  name: string;
  type: string;
  price: number;
};

type CustomCakeOrder = {
  name: string;
  phone: string;
  eventType: string;
  weight?: number;
  comment?: string;
  customImage?: File | null;
  ingredients: number[];
  address?: string;
  deliveryType?: "PICKUP" | "DELIVERY";
};

export default function CustomCakePage() {
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [order, setOrder] = useState<CustomCakeOrder>({
    name: "",
    phone: "",
    eventType: "",
    weight: undefined,
    comment: "",
    customImage: null,
    ingredients: [],
    deliveryType: "PICKUP",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ingredients")
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch((err) => console.error(err));
  }, []);

  const handleIngredientToggle = (id: number) => {
    if (order.customImage) return;
    setOrder((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(id)
        ? prev.ingredients.filter((i) => i !== id)
        : [...prev.ingredients, id],
    }));
  };

  const submitOrder = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(order).forEach(([key, value]) => {
      if (value) {
        if (key === "ingredients") {
          formData.append("ingredients", JSON.stringify(value));
        } else if (key === "customImage" && value instanceof File) {
          formData.append("customImage", value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      const res = await fetch("/api/custom-cakes", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setOrderNumber(data.orderNumber || "невідомо");
      setStep(4);
    } catch (err) {
      console.error(err);
      alert("Помилка при оформленні замовлення");
    } finally {
      setLoading(false);
    }
  };

  // ================= RENDER =================

  if (step === 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">
          ✅ Замовлення прийнято!
        </h1>
        <p className="mb-4">
          Номер вашого замовлення:{" "}
          <span className="font-bold">{orderNumber}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-5 md:px-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-10">
        Створення кастомного торта
      </h1>

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <input
            type="text"
            placeholder="Ім'я"
            value={order.name}
            onChange={(e) => setOrder({ ...order, name: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Телефон"
            value={order.phone}
            onChange={(e) => setOrder({ ...order, phone: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Подія (День народження, Весілля...)"
            value={order.eventType}
            onChange={(e) => setOrder({ ...order, eventType: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Вага (кг)"
            value={order.weight || ""}
            onChange={(e) =>
              setOrder({ ...order, weight: parseFloat(e.target.value) })
            }
            className="w-full p-3 border rounded-lg"
          />
          <textarea
            placeholder="Коментар"
            value={order.comment}
            onChange={(e) => setOrder({ ...order, comment: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setOrder({ ...order, customImage: e.target.files?.[0] || null })
            }
            className="w-full p-3 border rounded-lg"
          />

          {!order.customImage && (
            <div>
              <h2 className="font-semibold mb-2">Виберіть інгредієнти:</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className={`border p-2 rounded cursor-pointer text-center ${
                      order.ingredients.includes(ing.id)
                        ? "bg-blue-100 border-blue-400"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleIngredientToggle(ing.id)}
                  >
                    <div className="font-semibold">{ing.name}</div>
                    <div className="text-xs">{ing.type}</div>
                    <div className="text-xs">{ing.price} грн</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 mt-4"
          >
            Далі
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <p className="font-semibold mb-1">Тип доставки:</p>
          <select
            value={order.deliveryType}
            onChange={(e) =>
              setOrder({
                ...order,
                deliveryType: e.target.value as "PICKUP" | "DELIVERY",
              })
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="PICKUP">Самовивіз</option>
            <option value="DELIVERY">Доставка</option>
          </select>

          {order.deliveryType === "DELIVERY" && (
            <input
              type="text"
              placeholder="Адреса доставки"
              value={order.address || ""}
              onChange={(e) =>
                setOrder({ ...order, address: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400"
            >
              Назад
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
            >
              Далі
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
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

          <div className="flex space-x-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400"
            >
              Назад
            </button>
            <button
              disabled={loading || !paymentMethod}
              onClick={submitOrder}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
            >
              {loading ? "Відправка..." : "Підтвердити"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
