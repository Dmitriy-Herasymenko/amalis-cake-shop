import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (!token) redirect("/login");
  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl rounded-r-2xl p-8 flex flex-col">
        <h2 className="text-3xl font-bold mb-10 text-indigo-600">Admin Panel</h2>
        <nav className="flex flex-col gap-4 text-lg">
          <a
            href="/dashboard/cakes"
            className="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
          >
            🎂 Торти
          </a>
          <a
            href="/dashboard/orders"
            className="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
          >
            📦 Замовлення
          </a>
          <a
            href="/dashboard/users"
            className="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all font-medium"
          >
            👥 Користувачі
          </a>
        </nav>
        <div className="mt-auto">
          <button className="w-full bg-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-red-600 transition-all">
            Вийти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 bg-gray-50">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
