// app/api/orders/[orderNumber]/route.ts
import { prisma } from "@/app/lib/prisma";

interface Params {
  params: { orderNumber: string };
}

type OrderStatus = "NEW" | "PROCESSING" | "DELIVERING" | "COMPLETED";

type OrderItem = {
  cakeId: number;        // id конкретного торта з таблиці Cake
  name: string;          // назва торта (на момент замовлення)
  price: number;         // ціна за одиницю
  quantity: number;      // кількість
};

// Тип для звичайного замовлення
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

// Тип для кастомного замовлення
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



export async function GET(_req: Request, { params }: Params) {
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
      const response: NormalOrder = { ...normalOrder, type: "regular", items: normalOrder.items as OrderItem[], };
      return new Response(JSON.stringify(response), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2️⃣ Якщо не знайдено — шукаємо кастомний торт
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

    if (customOrder) {
      const ingredients = customOrder.ingredients.map((ing) => ({
        id: ing.ingredient.id,
        name: ing.ingredient.name,
      }));
      const response: CustomOrder = { ...customOrder, type: "custom", ingredients };
      return new Response(JSON.stringify(response), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3️⃣ Якщо нічого не знайдено
    return new Response("Замовлення не знайдено", { status: 404 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message || "Помилка отримання замовлення", {
        status: 500,
      });
    }

  }
}
