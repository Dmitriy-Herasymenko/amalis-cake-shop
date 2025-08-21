"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Order = {
  id: number;
  orderNumber: number;
  name: string;
  phone: string;
  address: string;
  callBack: boolean;
  payment: string;
  paid: boolean;
  status: "NEW" | "PROCESSING" | "DELIVERING" | "COMPLETED";
  comment: string | null;
  items: { id: number; name: string; quantity?: number; price?: number }[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
};

type CustomOrder = {
  id: number;
  name: string;
  phone: string;
  eventType?: string;
  weight?: number;
  comment?: string;
  status: "NEW" | "PROCESSING" | "DELIVERING" | "COMPLETED";
  ingredients: { id: number; ingredient: { name: string } }[];
  customImage?: string;
  createdAt: string;
  updatedAt: string;
};

// Type guard
function isCustomOrder(order: Order | CustomOrder): order is CustomOrder {
  return "ingredients" in order;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // один запит на універсальний endpoint
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Замовлення не знайдено");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-6">Завантаження...</p>;
  if (!order) return <p className="p-6">Замовлення не знайдено</p>;

  const custom = isCustomOrder(order);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Деталі замовлення #{custom ? order.id : (order as Order).orderNumber}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <p><strong>Ім'я:</strong> {order.name}</p>
        <p><strong>Телефон:</strong> {order.phone}</p>

        {custom ? (
          <>
            <p><strong>Вага/Тип:</strong> {order.weight || "-"} {order.eventType || "-"}</p>
            <p><strong>Інгредієнти:</strong> {order.ingredients.map(i => i.ingredient.name).join(", ") || "-"}</p>
            <p>
              <strong>Фото:</strong>{" "}
              {order.customImage ? <img src={order.customImage} alt="custom cake" className="w-48 h-48 object-cover mt-2" /> : "-"}
            </p>
          </>
        ) : (
          <>
            <p><strong>Адреса:</strong> {(order as Order).address}</p>
            <p><strong>Товари:</strong></p>
            <ul className="list-disc ml-6">
              {(order as Order).items.map(item => (
                <li key={item.id}>
                  {item.name} x {item.quantity || 1} — {item.price || 0} грн
                </li>
              ))}
            </ul>
            <p><strong>Сума:</strong> {(order as Order).totalPrice} грн</p>
            <p><strong>Оплата:</strong> {(order as Order).payment}</p>
            <p><strong>Оплачено:</strong> {(order as Order).paid ? "Так" : "Ні"}</p>
          </>
        )}

        <p><strong>Статус:</strong> {order.status}</p>
        <p><strong>Коментар:</strong> {order.comment || "-"}</p>
        <p><strong>Дата створення:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
