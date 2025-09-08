"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const topSales = [
  { name: "Медовий торт", sales: 40 },
  { name: "Шоколадний торт", sales: 30 },
  { name: "Фруктовий торт", sales: 20 },
  { name: "Ванільний торт", sales: 15 },
];

const salesOverTime = [
  { day: "Пн", orders: 12 },
  { day: "Вт", orders: 18 },
  { day: "Ср", orders: 20 },
  { day: "Чт", orders: 15 },
  { day: "Пт", orders: 25 },
  { day: "Сб", orders: 30 },
  { day: "Нд", orders: 22 },
];

const categoryDistribution = [
  { name: "Шоколадні", value: 40 },
  { name: "Фруктові", value: 30 },
  { name: "Ванільні", value: 20 },
  { name: "Медові", value: 10 },
];

const topClients = [
  { name: "Олексій", orders: 12 },
  { name: "Марія", orders: 10 },
  { name: "Іван", orders: 8 },
  { name: "Світлана", orders: 6 },
];

const COLORS = ["#B3986B", "#C49E6A", "#503D2F", "#FFB6C1"];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Top продажі */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-semibold mb-2">Топ продажів</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topSales}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#B3986B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Продажі за тиждень */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-semibold mb-2">Продажі за тиждень</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesOverTime}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#C49E6A" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Розподіл за категоріями */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-semibold mb-2">Розподіл за категоріями</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#B3986B" label>
              {categoryDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Топ клієнтів */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-semibold mb-2">Топ клієнтів</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={topClients}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="orders" stroke="#503D2F" fill="#C49E6A" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
