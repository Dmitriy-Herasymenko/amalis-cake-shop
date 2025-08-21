import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Некоректний id" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Замовлення не знайдено" }, { status: 404 });

  return NextResponse.json(order);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.order.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "Deleted" });
}
