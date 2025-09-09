"use client";

import { useState } from "react";

type OrderStatus = "NEW" | "PROCESSING" | "DELIVERING" | "COMPLETED";

// Звичайне замовлення
type RegularOrder = {
  type: "regular";
  orderNumber: number;
  status: OrderStatus;
  paid: boolean;
  totalPrice: number;
  items: { name: string; quantity?: number; price?: number }[];
};

// Кастомне замовлення
type CustomOrder = {
  type: "custom";
  orderNumber: number;
  status: OrderStatus;
  name: string;
  phone: string;
  eventType?: string | null;
  weight?: number | null;
  comment?: string | null;
  customImage?: string | null;
  ingredients: { id: number; name: string }[];
};

type OrderInfo = RegularOrder | CustomOrder;

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState<number | "">("");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    if (!orderNumber) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderNumber}`);
      if (!res.ok) throw new Error("Замовлення не знайдено");
      const data = await res.json();

      // Типобезпечне приведення: API вже повертає поле type
      setOrder(data as OrderInfo);
    } catch (err: any) {
      setError(err.message || "Помилка при отриманні замовлення");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status: OrderStatus) => {
    switch (status) {
      case "NEW":
        return "Новий";
      case "PROCESSING":
        return "В процесі";
      case "DELIVERING":
        return "Доставляється";
      case "COMPLETED":
        return "Виконано";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Відстежити замовлення</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="number"
          placeholder="Введіть номер замовлення"
          value={orderNumber}
          onChange={(e) =>
            setOrderNumber(e.target.value ? Number(e.target.value) : "")
          }
          className="border rounded p-2 w-64"
        />
        <button
          onClick={handleCheckStatus}
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold"
        >
          Перевірити
        </button>
      </div>

      {loading && <p>Завантаження...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {order?.type === "regular" && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <p>
            <strong>Номер замовлення:</strong> {order.orderNumber}
          </p>
          <p>
            <strong>Статус:</strong> {renderStatus(order.status)}
          </p>
          <p>
            <strong>Оплачено:</strong> {order.paid ? "Так" : "Ні"}
          </p>
          <p>
            <strong>Сума:</strong> {order.totalPrice} грн
          </p>
          <div>
            <strong>Товари:</strong>
            <ul className="list-disc pl-5">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity || 1} ({item.price || 0} грн)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {order?.type === "custom" && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <p>
            <strong>Номер замовлення:</strong> {order.orderNumber}
          </p>
          <p>
            <strong>Статус:</strong> {renderStatus(order.status)}
          </p>
          <p>
            <strong>Ім’я:</strong> {order.name}
          </p>
          <p>
            <strong>Телефон:</strong> {order.phone}
          </p>
          {order.eventType && (
            <p>
              <strong>Подія:</strong> {order.eventType}
            </p>
          )}
          {order.weight && (
            <p>
              <strong>Вага:</strong> {order.weight} кг
            </p>
          )}
          {order.comment && (
            <p>
              <strong>Коментар:</strong> {order.comment}
            </p>
          )}
          {order.customImage && (
            <div className="mt-3">
              <strong>Ескіз:</strong>
              <img
                src={order.customImage}
                alt="Custom cake"
                className="mt-2 rounded shadow max-h-48 object-contain"
              />
            </div>
          )}
          <div className="mt-3">
            <strong>Інгредієнти:</strong>
            <ul className="list-disc pl-5">
              {order.ingredients.map((ing) => (
                <li key={ing.id}>{ing.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
