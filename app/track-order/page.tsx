"use client";

import { useState } from "react";

type OrderStatus = "NEW" | "PROCESSING" | "DELIVERING" | "COMPLETED";

type OrderInfo = {
  orderNumber: number;
  status: OrderStatus;
  paid: boolean;
  totalPrice: number;
  items: { name: string; quantity?: number; price?: number }[];
};

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
      const data: OrderInfo = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "Помилка при отриманні замовлення");
    } finally { 
      setLoading(false);
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
          onChange={(e) => setOrderNumber(Number(e.target.value))}
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

      {order && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <p>
            <strong>Номер замовлення:</strong> {order.orderNumber}
          </p>
          <p>
            <strong>Статус:</strong>{" "}
            {order.status === "NEW"
              ? "Новий"
              : order.status === "PROCESSING"
              ? "В процесі"
              : order.status === "DELIVERING"
              ? "Доставляється"
              : "Виконано"}
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
                  {item.name} x {item.quantity || 1} ({item.price} грн)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
