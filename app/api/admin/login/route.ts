// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email і пароль обов'язкові" }, { status: 400 });
    }

    // Знаходимо адміна
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Невірний логін" }, { status: 401 });
    }

    // Перевіряємо пароль
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
    }

    // Генеруємо токен
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "1h" });

    const res = NextResponse.json({ message: "Успішно" });
    res.cookies.set("adminToken", token, { httpOnly: true, path: "/" });

    return res;
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
