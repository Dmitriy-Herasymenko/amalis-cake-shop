// app/api/custom-cakes/[orderNumber]/route.ts
import { prisma } from "@/app/lib/prisma";

interface Params {
  params: { orderNumber: string };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const orderNumber = Number(params.orderNumber);
    if (isNaN(orderNumber)) {
      return new Response("Некоректний номер замовлення", { status: 400 });
    }

    const order = await prisma.customCakeOrder.findUnique({
      where: { orderNumber },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!order) {
      return new Response("Замовлення не знайдено", { status: 404 });
    }

    return new Response(JSON.stringify(order), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("GET /api/custom-cakes/[orderNumber] error:", error);
    return new Response(error.message || "Помилка отримання замовлення", { status: 500 });
  }
}
