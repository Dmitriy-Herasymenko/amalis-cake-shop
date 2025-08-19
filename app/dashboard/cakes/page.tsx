"use client";

import { useState, useEffect } from "react";

type CakeType = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function CakesPage() {
  const [cakes, setCakes] = useState<CakeType[]>([]);
  const [newCake, setNewCake] = useState({ name: "", description: "", price: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCakes = async () => {
    const res = await fetch("/api/cakes");
    const data = await res.json();
    setCakes(data);
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const handleAdd = async () => {
    if (!newCake.name || !newCake.price || !imageFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", newCake.name);
    formData.append("description", newCake.description);
    formData.append("price", newCake.price);
    formData.append("image", imageFile);

    const res = await fetch("/api/cakes", { method: "POST", body: formData });
    if (res.ok) {
      const created = await res.json();
      setCakes([...cakes, created]);
      setNewCake({ name: "", description: "", price: "" });
      setImageFile(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/cakes?id=${id}`, { method: "DELETE" });
    setCakes(cakes.filter(c => c.id !== id));
  };

  const handleSave = async (cake: CakeType) => {
    await fetch("/api/cakes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cake),
    });
    fetchCakes();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-bold mb-6 text-pink-600">Адмінка тортів</h1>

      {/* Форма додавання */}
      <div className="flex gap-3 mb-6 items-center">
        <input
          type="text"
          placeholder="Назва"
          value={newCake.name}
          onChange={(e) => setNewCake({ ...newCake, name: e.target.value })}
          className="border p-2 rounded flex-1 shadow-sm"
        />
        <input
          type="text"
          placeholder="Опис"
          value={newCake.description}
          onChange={(e) => setNewCake({ ...newCake, description: e.target.value })}
          className="border p-2 rounded flex-2 shadow-sm"
        />
        <input
          type="number"
          placeholder="Ціна"
          value={newCake.price}
          onChange={(e) => setNewCake({ ...newCake, price: e.target.value })}
          className="border p-2 rounded w-24 shadow-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="border p-2 rounded w-32"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Додати
        </button>
      </div>

      {/* Таблиця */}
      <table className="w-full border-collapse shadow-lg">
        <thead>
          <tr className="bg-pink-100 text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Фото</th>
            <th className="border p-2">Назва</th>
            <th className="border p-2">Опис</th>
            <th className="border p-2">Ціна</th>
            <th className="border p-2">Дії</th>
          </tr>
        </thead>
        <tbody>
          {cakes.map((cake) => (
            <tr key={cake.id} className="bg-white hover:bg-pink-50">
              <td className="border p-2">{cake.id}</td>
              <td className="border p-2">
                <img src={cake.imageUrl} alt={cake.name} className="w-20 h-20 object-cover rounded" />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={cake.name}
                  onChange={(e) => setCakes(cakes.map(c => c.id === cake.id ? { ...c, name: e.target.value } : c))}
                  className="border p-1 w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={cake.description}
                  onChange={(e) => setCakes(cakes.map(c => c.id === cake.id ? { ...c, description: e.target.value } : c))}
                  className="border p-1 w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={cake.price}
                  onChange={(e) => setCakes(cakes.map(c => c.id === cake.id ? { ...c, price: parseFloat(e.target.value) } : c))}
                  className="border p-1 w-24"
                />
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleSave(cake)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Зберегти
                </button>
                <button
                  onClick={() => handleDelete(cake.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
