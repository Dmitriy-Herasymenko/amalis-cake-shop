import { prisma } from "@/app/lib/prisma";

type OrderStatus = "NEW" | "PROCESSING" | "DELIVERING" | "COMPLETED";

type OrderItem = {
  cakeId: number;
  name: string;
  price: number;
  quantity: number;
};

type NormalOrder = {
  type: "regular";
  orderNumber: number;
  status: OrderStatus;
  paid: boolean;
  totalPrice: number;
  items: OrderItem[];
  name: string;
  phone: string;
  address: string | null;
  deliveryType: "PICKUP" | "DELIVERY" | null;
  comment: string | null;
  createdAt: Date;
};

type CustomOrder = {
  type: "custom";
  orderNumber: number;
  status: OrderStatus;
  name: string;
  phone: string;
  eventType: string | null;
  weight: number | null;
  comment: string | null;
  customImage: string | null;
  createdAt: Date;
  ingredients: {
    id: number;
    name: string;
  }[];
};

export async function GET(
  req: Request,
  { params }: { params: { orderNumber: string } }
) {
  const orderNumber = Number(params.orderNumber);

  if (isNaN(orderNumber)) {
    return new Response("Некоректний номер замовлення", { status: 400 });
  }

  try {
    // 1️⃣ Шукаємо звичайне замовлення
    const normalOrder = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        orderNumber: true,
        status: true,
        paid: true,
        totalPrice: true,
        items: true,
        name: true,
        phone: true,
        address: true,
        deliveryType: true,
        comment: true,
        createdAt: true,
      },
    });

    if (normalOrder) {
      const response: NormalOrder = {
        ...normalOrder,
        type: "regular",
        items: normalOrder.items as OrderItem[],
      };
      return Response.json(response);
    }

    // 2️⃣ Шукаємо кастомне замовлення
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
            ingredient: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (customOrder) {
      const ingredients = customOrder.ingredients.map((ing) => ({
        id: ing.ingredient.id,
        name: ing.ingredient.name,
      }));

      const response: CustomOrder = {
        ...customOrder,
        type: "custom",
        ingredients,
      };
      return Response.json(response);
    }

    return new Response("Замовлення не знайдено", { status: 404 });
  } catch (error: unknown) {
    return new Response(
      error instanceof Error ? error.message : "Помилка отримання замовлення",
      { status: 500 }
    );
  }
}
