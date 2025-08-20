import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { Sidebar } from "./components/sidebar";

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
    <div className="min-h-screen flex  bg-[#EBE9F5] font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-10 bg-[#EBE9F5]">
        <div className="max-w-8xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
