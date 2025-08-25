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
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/ingredients")
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch((err) => console.error(err));
  }, []);

  const handleIngredientToggle = (id: number) => {
    if (order.customImage) return; // блокування вибору інгредієнтів якщо фото
    setOrder((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(id)
        ? prev.ingredients.filter((i) => i !== id)
        : [...prev.ingredients, id],
    }));
  };

  const handleSubmit = async () => {
    if (!order.name || !order.phone) {
      alert("Будь ласка, заповніть ім'я та телефон");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", order.name);
    formData.append("phone", order.phone);
    formData.append("eventType", order.eventType);
    if (order.weight) formData.append("weight", String(order.weight));
    if (order.comment) formData.append("comment", order.comment);
    if (order.customImage) formData.append("customImage", order.customImage);
    formData.append("ingredients", JSON.stringify(order.ingredients));

    try {
      const res = await fetch("/api/custom-cakes", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Ваше замовлення успішно відправлено!");
        setOrder({
          name: "",
          phone: "",
          eventType: "",
          weight: undefined,
          comment: "",
          customImage: null,
          ingredients: [],
        });
      } else {
        alert("Сталася помилка. Спробуйте ще раз.");
      }
    } catch (err) {
      console.error(err);
      alert("Помилка при відправці замовлення");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Створи свій торт</h1>

      {/* Інформація про замовника */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Ім'я"
          value={order.name}
          onChange={(e) => setOrder({ ...order, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Телефон"
          value={order.phone}
          onChange={(e) => setOrder({ ...order, phone: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Подія (День народження, Весілля...)"
          value={order.eventType}
          onChange={(e) => setOrder({ ...order, eventType: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Вага (кг)"
          value={order.weight || ""}
          onChange={(e) =>
            setOrder({ ...order, weight: parseFloat(e.target.value) })
          }
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Коментар"
          value={order.comment}
          onChange={(e) => setOrder({ ...order, comment: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setOrder({ ...order, customImage: e.target.files?.[0] || null })
          }
          className="border p-2 rounded"
        />
      </div>

      {/* Вибір інгредієнтів */}
      {!order.customImage && (
        <div className="mb-4">
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
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Відправка..." : "Замовити"}
      </button>
    </div>
  );
}
