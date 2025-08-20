"use client";

import { useEffect, useState } from "react";

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

const STATUS_OPTIONS: Order["status"][] = ["NEW", "PROCESSING", "DELIVERING", "COMPLETED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"NEW" | "PROCESSING" | "COMPLETED">("NEW");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: Order["status"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "NEW") return order.status === "NEW";
    if (activeTab === "PROCESSING") return order.status === "PROCESSING" || order.status === "DELIVERING";
    if (activeTab === "COMPLETED") return order.status === "COMPLETED";
    return false;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Адмінка замовлень</h1>

      {/* Таби */}
      <div className="flex space-x-4 mb-6">
        {["NEW", "PROCESSING", "COMPLETED"].map((tab) => (
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
      ) : filteredOrders.length === 0 ? (
        <p>Немає замовлень у цьому табі.</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Номер замовлення</th>
              <th className="p-2 text-left">Ім'я</th>
              <th className="p-2 text-left">Телефон</th>
              <th className="p-2 text-left">Адреса</th>
              <th className="p-2 text-left">Товари</th>
              <th className="p-2 text-left">Сума</th>
              <th className="p-2 text-left">Оплата</th>
              <th className="p-2 text-left">Оплачено</th>
              <th className="p-2 text-left">Статус</th>
              <th className="p-2 text-left">Коментар</th>
              <th className="p-2 text-left">Дата</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.orderNumber}</td>
                <td className="p-2">{order.name}</td>
                <td className="p-2">{order.phone}</td>
                <td className="p-2">{order.address}</td>
                <td className="p-2">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.name} x {item.quantity || 1}
                    </div>
                  ))}
                </td>
                <td className="p-2">{order.totalPrice} грн</td>
                <td className="p-2">{order.payment}</td>
                <td className="p-2">{order.paid ? "Так" : "Ні"}</td>
                <td className="p-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as Order["status"])
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
                <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
