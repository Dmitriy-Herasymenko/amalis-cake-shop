import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request, context: any) {
  const { params } = context;
  const orderNumber = Number(params.orderNumber);

  if (isNaN(orderNumber)) {
    return new Response("Некоректний номер замовлення", { status: 400 });
  }

  try {
    // Шукаємо кастомне замовлення
    const customOrder = await prisma.customCakeOrder.findUnique({
      where: { orderNumber },
      select: {
        orderNumber: true,
        status: true,
        name: true,
        phone: true,
        eventType: true,
        weight: true,
        comment: true,
        customImage: true,
        createdAt: true,
        ingredients: {
          select: {
            id: true,
            ingredient: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!customOrder) {
      return new Response("Замовлення не знайдено", { status: 404 });
    }

    // Формуємо інгредієнти
    const ingredients = customOrder.ingredients.map((ing) => ({
      id: ing.ingredient.id,
      name: ing.ingredient.name,
    }));

    return new Response(JSON.stringify({ ...customOrder, ingredients }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 });
    }
    return new Response("Помилка сервера", { status: 500 });
  }
}
