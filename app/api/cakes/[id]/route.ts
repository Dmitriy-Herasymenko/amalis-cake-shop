
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const cake = await prisma.cake.update({
    where: { id: parseInt(params.id) },
    data: body,
  });
  return NextResponse.json(cake);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.cake.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: "Deleted" });
}
