// app/api/custom-cakes/route.ts
import { prisma } from "@/app/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // вимикаємо стандартний JSON parser
  },
};

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/custom-cakes");

// Переконаємось, що папка існує
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

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

    if (!name || !phone) {
      return new Response("Name and phone are required", { status: 400 });
    }

    let customImage: string | null = null;

    if (customImageFile && customImageFile.size > 0) {
      const arrayBuffer = await customImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(UPLOAD_DIR, customImageFile.name);
      await fs.writeFile(filePath, buffer);
      customImage = `/uploads/custom-cakes/${customImageFile.name}`;
    }

    const newOrder = await prisma.customCakeOrder.create({
      data: {
        name,
        phone,
        eventType: eventType || null,
        weight: weight ? parseFloat(weight) : undefined,
        comment: comment || null,
        customImage,
      },
    });

    // Якщо інгредієнти передані і фото немає
    if (!customImage && ingredientsRaw) {
      let ingIds: number[] = [];
      try {
        ingIds = JSON.parse(ingredientsRaw);
      } catch {
        ingIds = [];
      }

      for (const id of ingIds) {
        await prisma.customCakeIngredient.create({
          data: {
            customCakeOrderId: newOrder.id,
            ingredientId: id,
          },
        });
      }
    }

    return new Response(JSON.stringify(newOrder), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(e.message || "Error creating custom cake order", { status: 500 });
  }
}

// --- GET: отримати всі кастомні замовлення ---
// --- GET: отримати всі кастомні замовлення ---
export async function GET() {
  try {
    const orders = await prisma.customCakeOrder.findMany({
      include: { 
        ingredients: { 
          include: { ingredient: true }  // <--- тут важливо
        } 
      },
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(e.message || "Error fetching custom cake orders", { status: 500 });
  }
}

// --- PUT: оновити статус кастомного замовлення ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return new Response("ID and status required", { status: 400 });
    }

    const updatedOrder = await prisma.customCakeOrder.update({
      where: { id },
      data: { status },
    });

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (e: any) {
    console.error(e);
    return new Response(e.message || "Error updating custom cake order", { status: 500 });
  }
}

