// app/api/orders/[orderNumber]/route.ts
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request, { params }: { params: { orderNumber: string } }) {
  const orderNumber = Number(params.orderNumber);
  if (isNaN(orderNumber)) return new Response("Некоректний номер замовлення", { status: 400 });

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      paid: true,
      totalPrice: true,
      items: true,
    },
  });

  if (!order) return new Response("Замовлення не знайдено", { status: 404 });

  return new Response(JSON.stringify(order), {
    headers: { "Content-Type": "application/json" },
  });
}
