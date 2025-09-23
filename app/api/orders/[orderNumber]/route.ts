// app/api/orders/[orderNumber]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

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
  createdAt: string;
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
  createdAt: string;
  ingredients: {
    id: number;
    name: string;
  }[];
};

type CustomIngredient = {
  ingredient: {
    id: number;
    name: string;
  };
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    // Беремо orderNumber з pathname
    const pathParts = url.pathname.split("/");
    const orderNumberStr = pathParts[pathParts.length - 1];
    const orderNumber = Number(orderNumberStr);

    if (isNaN(orderNumber)) {
      return NextResponse.json({ message: "Некоректний номер замовлення" }, { status: 400 });
    }

    // 1️⃣ Звичайне замовлення
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
        createdAt: normalOrder.createdAt.toISOString(),
        items: normalOrder.items as OrderItem[],
      };
      return NextResponse.json(response);
    }

    // 2️⃣ Кастомне замовлення
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
      const ingredients = customOrder.ingredients.map(
        (ing: CustomIngredient) => ({
          id: ing.ingredient.id,
          name: ing.ingredient.name,
        })
      );

      const response: CustomOrder = {
        ...customOrder,
        type: "custom",
        createdAt: customOrder.createdAt.toISOString(),
        ingredients,
      };
      return NextResponse.json(response);
    }

    return NextResponse.json({ message: "Замовлення не знайдено" }, { status: 404 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Помилка отримання замовлення" },
      { status: 500 }
    );
  }
}
