"use client";

import { useState, useEffect } from "react";

type IngredientType = {
  id: number;
  name: string;
  type: "BISCUIT" | "SOAKING" | "CREAM" | "FILLING" | "DECOR";
  price: number;
};

type CustomCakeOrder = {
  name: string;
  phone: string;
  eventType: string;
  persons?: number;
  weight?: number;
  tiers?: number;
  urgent?: boolean;
  comment?: string;
  customImage?: File | null;
  ingredients: number[];
  address?: string;
  deliveryType?: "PICKUP" | "DELIVERY";
};

// Мапа категорій → українські назви
const CATEGORY_LABELS: Record<IngredientType["type"], string> = {
  BISCUIT: "Бісквіт (1 варіант)",
  SOAKING: "Просочення (до 2 варіантів)",
  CREAM: "Крем (1 варіант)",
  FILLING: "Начинка (до 3 варіантів)",
  DECOR: "Декор",
};

export default function CustomCakePage() {
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [order, setOrder] = useState<CustomCakeOrder>({
    name: "",
    phone: "",
    eventType: "",
    persons: undefined,
    weight: undefined,
    tiers: undefined,
    urgent: false,
    comment: "",
    customImage: null,
    ingredients: [],
    deliveryType: "PICKUP",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Завантаження інгредієнтів
  useEffect(() => {
    fetch("/api/ingredients")
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch((err) => console.error(err));
  }, []);

  // Обмеження вибору інгредієнтів
  const handleIngredientToggle = (id: number, type: IngredientType["type"]) => {
    const currentSelected = order.ingredients
      .map((ingId) => ingredients.find((i) => i.id === ingId))
      .filter(Boolean) as IngredientType[];

    const typeCount = currentSelected.filter((i) => i.type === type).length;

    let limit = Infinity;
    if (type === "BISCUIT") limit = 1;
    if (type === "SOAKING") limit = 2;
    if (type === "CREAM") limit = 1;
    if (type === "FILLING") limit = 3;

    const isSelected = order.ingredients.includes(id);

    if (!isSelected && typeCount >= limit) {
      alert(`Можна вибрати не більше ${limit} для категорії ${CATEGORY_LABELS[type]}`);
      return;
    }

    setOrder((prev) => ({
      ...prev,
      ingredients: isSelected
        ? prev.ingredients.filter((i) => i !== id)
        : [...prev.ingredients, id],
    }));
  };

  // Розрахунок ваги по кількості осіб
  useEffect(() => {
    if (order.persons) {
      if (order.persons <= 5) setOrder((p) => ({ ...p, weight: 1 }));
      else if (order.persons <= 8) setOrder((p) => ({ ...p, weight: 1.5 }));
      else if (order.persons <= 12) setOrder((p) => ({ ...p, weight: 2 }));
      else setOrder((p) => ({ ...p, weight: +(order.persons * 0.18).toFixed(1) }));
    }
  }, [order.persons]);

  // Submit
const submitOrder = async () => {
  setLoading(true);

  try {
    const res = await fetch("/api/custom-cakes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...order,
        customImage: undefined, // бо файл ми не відправляємо JSON-ом
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Помилка при оформленні замовлення");
      return;
    }

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

      {/* Step 1 — Основна інформація + інгредієнти */}
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
            placeholder="Кількість осіб"
            value={order.persons || ""}
            onChange={(e) =>
              setOrder({ ...order, persons: parseInt(e.target.value) })
            }
            className="w-full p-3 border rounded-lg"
          />
          <p className="text-gray-600">
            Рекомендована вага:{" "}
            <span className="font-semibold">{order.weight || "-"} кг</span>
          </p>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={order.urgent}
              onChange={(e) =>
                setOrder({ ...order, urgent: e.target.checked })
              }
            />
            <span>⚡ Срочне замовлення</span>
          </label>

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

          {/* Інгредієнти */}
          {!order.customImage && (
            <div>
              <h2 className="font-semibold mb-4 text-lg">Інгредієнти торта</h2>
              {(["BISCUIT", "SOAKING", "CREAM", "FILLING", "DECOR"] as IngredientType["type"][]).map(
                (cat) => (
                  <div key={cat} className="mb-6">
                    <h3 className="font-bold text-pink-600 mb-2">
                      {CATEGORY_LABELS[cat]}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {ingredients
                        .filter((i) => i.type === cat)
                        .map((ing) => {
                          const selected = order.ingredients.includes(ing.id);
                          return (
                            <button
                              key={ing.id}
                              type="button"
                              className={`border rounded-xl p-3 text-center transition-all ${
                                selected
                                  ? "bg-green-100 border-green-400 shadow-md"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() =>
                                handleIngredientToggle(ing.id, ing.type)
                              }
                            >
                              <div className="font-semibold">{ing.name}</div>
                              {ing.price > 0 && (
                                <div className="text-sm text-gray-600">
                                  +{ing.price} грн
                                </div>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )
              )}
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

      {/* Step 2 — Доставка */}
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

      {/* Step 3 — Оплата */}
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
