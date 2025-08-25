"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity?: number;
};

type Order = {
  orderNumber: number;
  status: "NEW" | "PROCESSING" | "DELIVERING" | "COMPLETED";
  paid: boolean;
  totalPrice: number;
  items: OrderItem[];
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = params?.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        if (!res.ok) throw new Error("Замовлення не знайдено");
        const data: Order = await res.json();
        setOrder(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Помилка при отриманні замовлення");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) return <p className="p-6 text-center">Завантаження...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!order) return <p className="p-6 text-center">Замовлення не знайдено</p>;
console.log("Order Data:", order);
  return (
    <div className="p-6 min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-2">
          Замовлення №{order.orderNumber}
        </h1>

        <div className="flex justify-between">
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
        </div>

        <p>
          <strong>Сума:</strong> {order.totalPrice} грн
        </p>

        <div>
          <strong>Товари:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} x {item.quantity || 1} — {item.price} грн
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-500 text-sm">
          <em>Дата завантаження даних: {new Date().toLocaleString()}</em>
        </p>
      </div>
    </div>
  );
}
