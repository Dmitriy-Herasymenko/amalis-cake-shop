"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";

type OrderItem = {
  id: number;
  name: string;
  price: number;
};

type Ingredient = {
  id: number;
  ingredientId: number;
  ingredient: {
    id: number;
    name: string;
    type: string;
    price: number;
  };
};

type StandardOrder = {
  orderNumber: number;
  name: string;
  phone: string;
  status: string;
  comment?: string | null;
  items: OrderItem[];
  totalPrice: number;
  paid: boolean;
};

type CustomOrder = {
  orderNumber: number;
  name: string;
  phone: string;
  status: string;
  comment?: string | null;
  eventType: string;
  weight?: number | null;
  customImage?: string | null;
  ingredients: Ingredient[];
};

type Order = StandardOrder | CustomOrder;

interface PageProps {
  params: Promise<{
    type: string;
    orderNumber: string;
  }>;
}

export default function OrderPage({ params }: PageProps) {
  const { type, orderNumber } = use(params);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber || !type) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/${type}/${parseInt(orderNumber)}`);
        if (!res.ok) {
          console.error("Order not found", await res.text());
          setOrder(null);
          setLoading(false);
          return;
        }
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
  }, [type, orderNumber]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {type === "orders"
        ? renderStandardOrder(order as StandardOrder)
        : renderCustomOrder(order as CustomOrder)}
    </div>
  );
}

/* ---------- Рендер стандартного замовлення ---------- */
function renderStandardOrder(order: StandardOrder) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Замовлення #{order.orderNumber}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === "NEW"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "PAID"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <p><span className="font-medium">Ім’я: </span>{order.name}</p>
        <p><span className="font-medium">Телефон: </span>{order.phone}</p>
        {order.comment && <p><span className="font-medium">Коментар: </span>{order.comment}</p>}
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Товари</h2>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item, index) => (
            <li key={index} className="py-2 flex justify-between">
              <span>{item.name}</span>
              <span className="font-medium">{item.price} грн</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4 pt-2 border-t">
          <span className="font-semibold">Всього:</span>
          <span className="font-bold text-lg">{order.totalPrice} грн</span>
        </div>
      </div>
    </>
  );
}

/* ---------- Рендер кастомного замовлення ---------- */
function renderCustomOrder(order: CustomOrder) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Кастомне замовлення #{order.orderNumber}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === "NEW"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <p><span className="font-medium">Ім’я: </span>{order.name}</p>
        <p><span className="font-medium">Телефон: </span>{order.phone}</p>
        <p><span className="font-medium">Подія: </span>{order.eventType}</p>
        {order.weight && <p><span className="font-medium">Вага: </span>{order.weight} кг</p>}
        {order.comment && <p><span className="font-medium">Коментар: </span>{order.comment}</p>}
      </div>

      {order.customImage && (
        <Image
          src={order.customImage}
          alt="Custom Cake"
          className="w-64 h-64 object-cover rounded-lg shadow"
        />
      )}

      {order?.ingredients && order.ingredients.length > 0 && (
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Інгредієнти</h2>
          <ul className="divide-y divide-gray-200">
            {order.ingredients.map((ing, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span>{ing.ingredient.name}</span>
                <span className="text-gray-500">{ing.ingredient.type}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
