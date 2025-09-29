"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";

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
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    setDeletingId(id);
    await fetch(`/api/cakes?id=${id}`, { method: "DELETE" });
    setCakes(cakes.filter(c => c.id !== id));
    setDeletingId(null);
  };

  const handleSave = async (cake: CakeType) => {
    setSavingId(cake.id);
    await fetch("/api/cakes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cake),
    });
    fetchCakes();
    setSavingId(null);
  };

  return (
    <div className="p-2 min-h-screen font-sans">

      {/* Форма додавання */}
      <div className="flex gap-3 mb-6 items-center justify-center flex-wrap">
        <input
          type="text"
          placeholder="Назва"
          value={newCake.name}
          onChange={(e) => setNewCake({ ...newCake, name: e.target.value })}
          className="border p-1 rounded shadow-sm text-xs"
        />
        <input
          type="text"
          placeholder="Опис"
          value={newCake.description}
          onChange={(e) => setNewCake({ ...newCake, description: e.target.value })}
          className="border p-1 rounded shadow-sm text-xs"
        />
        <input
          type="number"
          placeholder="Ціна"
          value={newCake.price}
          onChange={(e) => setNewCake({ ...newCake, price: e.target.value })}
          className="border p-1 rounded w-24 shadow-sm text-xs"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="border p-1 rounded w-32 text-xs"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50 text-xs"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Додати"}
        </button>
      </div>

      {/* Таблиця */}
      <table className="w-full border-collapse shadow-lg text-center">
        <thead>
          <tr className="bg-[#AA824D] text-white text-xs">
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
              <td className="border p-1">
                <Image 
                src={cake?.imageUrl} 
                alt={cake.name} 
                width={80}      
                height={80}  
                className="w-full h-20 object-cover  mx-auto" 
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={cake.name}
                  onChange={(e) =>
                    setCakes(cakes.map(c => c.id === cake.id ? { ...c, name: e.target.value } : c))
                  }
                  className=" p-1 text-xs w-full text-center"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={cake.description}
                  onChange={(e) =>
                    setCakes(cakes.map(c => c.id === cake.id ? { ...c, description: e.target.value } : c))
                  }
                  className=" p-1 text-xs w-full text-center"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={cake.price}
                  onChange={(e) =>
                    setCakes(cakes.map(c => c.id === cake.id ? { ...c, price: parseFloat(e.target.value) } : c))
                  }
                  className=" p-1 text-xs w-24 text-center mx-auto"
                />
              </td>
              <td className="border p-2 text-center">
                <div className="flex justify-center items-center gap-2">
                  <div
                    onClick={() => handleSave(cake)}
                    className="cursor-pointer p-1 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
                  >
                    {savingId === cake.id ? (
                      <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div
                    onClick={() => handleDelete(cake.id)}
                    className="cursor-pointer p-1 rounded hover:bg-red-100 transition-colors flex items-center justify-center"
                  >
                    {deletingId === cake.id ? (
                      <Loader2 className="animate-spin w-5 h-5 text-red-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
