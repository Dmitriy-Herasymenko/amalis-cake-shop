import { prisma } from "@/app/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { OrderStatus } from "@prisma/client";

export const config = { api: { bodyParser: false } };

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/custom-cakes");
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

// --- допоміжна функція для унікального номера ---
async function generateUniqueOrderNumber(): Promise<number> {
  let number: number;
  while (true) {
    number = Math.floor(100000 + Math.random() * 900000);
    const exists = await prisma.customCakeOrder.findUnique({
      where: { orderNumber: number },
    });
    if (!exists) break;
  }
  return number;
}

// --- POST: створення кастомного торта ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const phone = formData.get("phone")?.toString();
    const eventType = formData.get("eventType")?.toString();
    const weight = formData.get("weight")?.toString();
    const comment = formData.get("comment")?.toString();
    const ingredientsRaw = formData.get("ingredients")?.toString();
    const customImageFile = formData.get("customImage") as File | null;

    if (!name || !phone)
      return new Response("Name and phone are required", { status: 400 });

    // --- збереження файлу ---
    let customImage: string | null = null;
    if (customImageFile && customImageFile.size > 0) {
      const buffer = Buffer.from(await customImageFile.arrayBuffer());
      const filePath = path.join(UPLOAD_DIR, customImageFile.name);
      await fs.writeFile(filePath, buffer);
      customImage = `/uploads/custom-cakes/${customImageFile.name}`;
    }

    // --- генеруємо унікальний номер замовлення ---
    const orderNumber = await generateUniqueOrderNumber();

    // --- створення запису ---
    const newOrder = await prisma.customCakeOrder.create({
      data: {
        name,
        phone,
        eventType: eventType || null,
        weight: weight ? parseFloat(weight) : null,
        comment: comment || null,
        customImage,
        orderNumber,
        status: OrderStatus.NEW,
      },
    });

    // --- прив'язка інгредієнтів, якщо немає картинки ---
    if (!customImage && ingredientsRaw) {
      const ingIds: number[] = JSON.parse(ingredientsRaw || "[]");
      for (const id of ingIds) {
        await prisma.customCakeIngredient.create({
          data: { customCakeOrderId: newOrder.id, ingredientId: id },
        });
      }
    }

    return new Response(JSON.stringify(newOrder), { status: 200 });
  } catch (e: any) {
    console.error("POST /api/custom-cakes error:", e);
    return new Response(e.message || "Error creating custom cake order", {
      status: 500,
    });
  }
}

// --- GET: отримати всі замовлення ---
export async function GET() {
  try {
    const orders = await prisma.customCakeOrder.findMany({
      include: { ingredients: { include: { ingredient: true } } },
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (e: any) {
    console.error("GET /api/custom-cakes error:", e);
    return new Response(e.message || "Error fetching custom cake orders", {
      status: 500,
    });
  }
}

// --- PUT: оновити статус замовлення ---
export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status)
      return new Response("ID and status required", { status: 400 });

    const updatedOrder = await prisma.customCakeOrder.update({
      where: { id },
      data: { status },
    });

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/custom-cakes error:", e);
    return new Response(e.message || "Error updating custom cake order", {
      status: 500,
    });
  }
}
