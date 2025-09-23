"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

type OrderStatus = "NEW" | "PROCESSING" | "DELIVERING" | "COMPLETED";

type OrderItem = {
  cakeId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type NormalOrder = {
  type: "regular";
  orderNumber: number;
  status: OrderStatus;
  paid: boolean;
  totalPrice: number;
  items: OrderItem[];
  name: string;
  phone: string;
  address: string | null;
  deliveryType: "PICKUP" | "DELIVERY" | null;
  comment: string | null;
  createdAt: string;
};

type CustomOrder = {
  type: "custom";
  orderNumber: number;
  status: OrderStatus;
  name: string;
  phone: string;
  eventType: string | null;
  weight: number | null;
  comment: string | null;
  customImage: string | null;
  createdAt: string;
  ingredients: {
    id: number;
    name: string;
  }[];
};

export default function OrderPage({ params }: PageProps) {
  // ✅ Розпаковуємо проміс від Next.js
  const { orderNumber } = use(params);

  const [order, setOrder] = useState<NormalOrder | CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        if (!res.ok) {
          setOrder(null);
          return;
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Помилка завантаження замовлення:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return <p className="p-6">Завантаження...</p>;
  }

  if (!order) {
    return <p className="p-6">Замовлення не знайдено</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {order.type === "regular"
          ? `Звичайне замовлення №${order.orderNumber}`
          : `Кастомне замовлення №${order.orderNumber}`}
      </h1>

      <div className="space-y-2">
        <p><span className="font-semibold">Статус:</span> {order.status}</p>
        {"paid" in order && (
          <p><span className="font-semibold">Оплачено:</span> {order.paid ? "Так" : "Ні"}</p>
        )}
        {"totalPrice" in order && (
          <p><span className="font-semibold">Сума:</span> {order.totalPrice} ₴</p>
        )}
        <p><span className="font-semibold">Ім’я:</span> {order.name}</p>
        <p><span className="font-semibold">Телефон:</span> {order.phone}</p>
        {"address" in order && (
          <p><span className="font-semibold">Адреса:</span> {order.address || "—"}</p>
        )}
        {"deliveryType" in order && (
          <p><span className="font-semibold">Доставка:</span> {order.deliveryType || "—"}</p>
        )}
        {"eventType" in order && (
          <p><span className="font-semibold">Подія:</span> {order.eventType || "—"}</p>
        )}
        {"weight" in order && (
          <p><span className="font-semibold">Вага:</span> {order.weight ? `${order.weight} кг` : "—"}</p>
        )}
        <p><span className="font-semibold">Коментар:</span> {order.comment || "—"}</p>
        <p><span className="font-semibold">Створено:</span> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {"items" in order && order.items.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Товари</h2>
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border p-3 rounded-lg shadow-sm"
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded"
                />
              )}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Кількість: {item.quantity} × {item.price} ₴
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {"ingredients" in order && order.ingredients.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Інгредієнти</h2>
          <ul className="list-disc list-inside">
            {order?.ingredients.map((ing, index) => (
              <li key={`${ing.id}-${index}`}>{ing.name}</li>
            ))}
          </ul>
        </div>
      )}

      {"customImage" in order && order.customImage && (
        <div>
          <h2 className="text-lg font-semibold">Зображення торта</h2>
          <Image
            src={order.customImage}
            alt="Кастомний торт"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
