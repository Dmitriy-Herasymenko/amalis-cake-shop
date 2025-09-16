"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


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
  orderNumber: number;
  customImage?: string;
  createdAt: string;
  updatedAt: string;
};

type Tab = "NEW" | "PROCESSING" | "COMPLETED";

const STATUS_OPTIONS: (Order["status"] | CustomOrder["status"])[] = [
  "NEW",
  "PROCESSING",
  "DELIVERING",
  "COMPLETED",
];



export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("NEW");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- Fetch ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error(await res.text());
      setOrders(await res.json());
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/custom-cakes");
      if (!res.ok) throw new Error(await res.text());
      setCustomOrders(await res.json());
    } catch (err) {
      console.error(err);
      setCustomOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomOrders();
  }, []);

  // --- Update Status ---
  const handleOrderStatusChange = async (id: number, status: Order["status"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCustomStatusChange = async (id: number, status: CustomOrder["status"]) => {
    try {
      const res = await fetch("/api/custom-cakes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCustomOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Filtered ---
  const filteredOrders = orders.filter((o) =>
    activeTab === "NEW"
      ? o.status === "NEW"
      : activeTab === "PROCESSING"
      ? o.status === "PROCESSING" || o.status === "DELIVERING"
      : o.status === "COMPLETED"
  );

  const filteredCustomOrders = customOrders.filter((o) =>
    activeTab === "NEW"
      ? o.status === "NEW"
      : activeTab === "PROCESSING"
      ? o.status === "PROCESSING" || o.status === "DELIVERING"
      : o.status === "COMPLETED"
  );



  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Адмінка замовлень</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {(["NEW", "PROCESSING", "COMPLETED"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab === "NEW" ? "Нові" : tab === "PROCESSING" ? "В процесі" : "Виконані"}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Завантаження замовлень...</p>
      ) : (
        <>
    {/* Звичайні замовлення */}
{filteredOrders?.length > 0 && (
  <table className="w-full bg-white rounded-lg shadow-md overflow-hidden mb-6">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2">{"Ім'я"}</th>
        <th className="p-2">Телефон</th>
        <th className="p-2">Адреса</th>
        <th className="p-2">Товари</th>
        <th className="p-2">Сума</th>
        <th className="p-2">Оплата</th>
        <th className="p-2">Оплачено</th>
        <th className="p-2">Статус</th>
        <th className="p-2">Коментар</th>
        <th className="p-2">Тип</th>
        <th className="p-2">Дата</th>
      </tr>
    </thead>
    <tbody>
      {filteredOrders.map((order) => (
        <tr
          key={order.id}
          className="border-b hover:bg-gray-50 cursor-pointer"
          onClick={() => router.push(`orders/${order.orderNumber}`)}
        >
          <td className="p-2">{order.name}</td>
          <td className="p-2">{order.phone}</td>
          <td className="p-2">{order.address}</td>
          <td className="p-2">
            {(() => {
              // Групуємо товари за id
              const groupedItems = order.items.reduce<Record<number, { name: string; quantity: number; price: number }>>(
                (acc, item) => {
                  if (acc[item.id]) {
                    acc[item.id].quantity += 1;
                  } else {
                    acc[item.id] = { name: item.name, quantity: 1, price: item.price ?? 0 };
                  }
                  return acc;
                },
                {}
              );

              // Рендеримо без дублювань
              return Object.values(groupedItems).map((item) => (
                <div key={item.name}>
                  {item.name} x {item.quantity} — {item.price} грн
                </div>
              ));
            })()}
          </td>
          <td className="p-2">{order.totalPrice} грн</td>
          <td className="p-2">{order.payment}</td>
          <td className="p-2">{order.paid ? "Так" : "Ні"}</td>
        <td className="p-2">
  <select
    value={order.status}
    onChange={(e) =>
      handleOrderStatusChange(order.id, e.target.value as Order["status"])
    }
    onClick={(e) => e.stopPropagation()} // ⬅️ важливо
    className="border p-1 rounded"
  >
    {STATUS_OPTIONS.map((status) => (
      <option key={status} value={status}>
        {status === "NEW"
          ? "Новий"
          : status === "PROCESSING"
          ? "В процесі"
          : status === "DELIVERING"
          ? "Доставляється"
          : "Виконано"}
      </option>
    ))}
  </select>
</td>

          <td className="p-2">{order.comment || "-"}</td>
          <td className="p-2">Звичайне</td>
          <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}


          {/* Кастомні замовлення */}
          {filteredCustomOrders.length > 0 && (
            <table className="w-full bg-white rounded-lg shadow-md overflow-hidden" >
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">{"Ім'я"}</th>
                  <th className="p-2">Телефон</th>
                  <th className="p-2">Вага/Тип</th>
                  <th className="p-2">Інгредієнти</th>
                  <th className="p-2">Фото</th>
                  <th className="p-2">Статус</th>
                  <th className="p-2">Коментар</th>
                  <th className="p-2">Тип</th>
                  <th className="p-2">Дата</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomOrders?.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50" onClick={() => router.push(`custom-cakes/${order?.orderNumber}`)}>
                    <td className="p-2">{order.name}</td>
                    <td className="p-2">{order.phone}</td>
                    <td className="p-2">
                      {order.weight || "-"} {order.eventType || "-"}
                    </td>
                    <td className="p-2">
                      {order?.ingredients.map((i) => i.ingredient?.name).join(", ") || "-"}
                    </td>
                    <td className="p-2">
                      {order.customImage ? (
                        <img
                          src={order.customImage}
                          alt="custom cake"
                          className="w-24 h-24 object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleCustomStatusChange(order.id, e.target.value as CustomOrder["status"])
                        }
                        className="border p-1 rounded"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status === "NEW"
                              ? "Новий"
                              : status === "PROCESSING"
                              ? "В процесі"
                              : status === "DELIVERING"
                              ? "Доставляється"
                              : "Виконано"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">{order.comment || "-"}</td>
                    <td className="p-2">Кастомне</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Якщо немає замовлень */}
          {filteredOrders.length === 0 && filteredCustomOrders.length === 0 && (
            <p>Немає замовлень у цьому табі.</p>
          )}
        </>
      )}
    </div>
  );
}
