import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    // Отримуємо orderNumber з URL
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const orderNumberParam = segments[segments.length - 1];
    const orderNumber = Number(orderNumberParam);

    if (isNaN(orderNumber)) {
      return new Response("Некоректний номер замовлення", { status: 400 });
    }

    // --- Шукаємо кастомне замовлення ---
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
        updatedAt: true,
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

    // Формуємо масив інгредієнтів
    const ingredients = customOrder.ingredients.map((ing) => ({
      id: ing.ingredient.id,
      name: ing.ingredient.name,
    }));

    // Відповідь
    const response = { ...customOrder, ingredients };
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Помилка сервера";
    return new Response(message, { status: 500 });
  }
}
