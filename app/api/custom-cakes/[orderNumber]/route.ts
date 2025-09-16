import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
): Promise<NextResponse> {
  try {
    const { orderNumber } = await params;
    const orderNumberNum = Number(orderNumber);

    if (isNaN(orderNumberNum)) {
      return NextResponse.json(
        { message: "Некоректний номер замовлення" },
        { status: 400 }
      );
    }

    const order = await prisma.customCakeOrder.findUnique({
      where: { orderNumber: orderNumberNum },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Замовлення не знайдено" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Помилка отримання замовлення" },
      { status: 500 }
    );
  }
}
