// app/api/custom-cakes/route.ts
import { prisma } from "@/app/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { OrderStatus, IngredientType } from "@prisma/client";

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

// --- допоміжна функція для розрахунку ціни ---
function calculatePrice(weightPrice: number, ingredients: { price: number }[], layers: number) {
  let ingredientsPrice = ingredients.reduce((sum, ing) => sum + ing.price, 0);
  let decorPrice = 0;
  if (layers === 2) decorPrice = 200;
  if (layers === 3) decorPrice = 400;
  return weightPrice + ingredientsPrice + decorPrice;
}

// --- POST: створення кастомного торта ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const phone = formData.get("phone")?.toString();
    const eventType = formData.get("eventType")?.toString() || null;
    const comment = formData.get("comment")?.toString() || null;
    const layers = parseInt(formData.get("layers")?.toString() || "1");
    const persons = parseInt(formData.get("persons")?.toString() || "1");
    const weightInput = parseFloat(formData.get("weight")?.toString() || "1");

    const customImageFile = formData.get("customImage") as File | null;

    // --- Категорії інгредієнтів ---
    const biscuitIds = JSON.parse(formData.get("biscuit")?.toString() || "[]"); // 1 варіант
    const soakIds = JSON.parse(formData.get("soak")?.toString() || "[]");       // до 2 варіантів
    const creamIds = JSON.parse(formData.get("cream")?.toString() || "[]");     // 1 варіант
    const fillingIds = JSON.parse(formData.get("filling")?.toString() || "[]"); // до 3 варіантів
    const decorIds = JSON.parse(formData.get("decor")?.toString() || "[]");     // декор

    const allIngredientIds = [...biscuitIds, ...soakIds, ...creamIds, ...fillingIds, ...decorIds];

    // --- Перевірки ---
    if (!name || !phone) return new Response("Ім'я та телефон обов'язкові", { status: 400 });
    if (weightInput < 1) return new Response("Мінімальна вага 1 кг", { status: 400 });
    if (biscuitIds.length !== 1) return new Response("Виберіть 1 варіант бісквіту", { status: 400 });
    if (soakIds.length > 2) return new Response("Виберіть максимум 2 варіанти просочення", { status: 400 });
    if (creamIds.length !== 1) return new Response("Виберіть 1 варіант крему", { status: 400 });
    if (fillingIds.length > 3) return new Response("Виберіть максимум 3 варіанти начинки", { status: 400 });
    if (allIngredientIds.length === 0) return new Response("Необхідно обрати інгредієнти", { status: 400 });

    // --- Збереження картинки ---
    let customImage: string | null = null;
    if (customImageFile && customImageFile.size > 0) {
      const buffer = Buffer.from(await customImageFile.arrayBuffer());
      const filePath = path.join(UPLOAD_DIR, customImageFile.name);
      await fs.writeFile(filePath, buffer);
      customImage = `/uploads/custom-cakes/${customImageFile.name}`;
    }

    // --- Унікальний номер ---
    const orderNumber = await generateUniqueOrderNumber();

    // --- Розрахунок ціни за кількість осіб ---
    let weightPrice = 0;
    if (persons <= 5) weightPrice = 900;
    else if (persons <= 8) weightPrice = 1350;
    else if (persons <= 12) weightPrice = 1800;
    else {
      const calculatedWeight = persons * 0.18;
      weightPrice = calculatedWeight * 900;
    }

    // --- Отримання даних інгредієнтів ---
    const ingredientsData = await prisma.ingredient.findMany({
      where: { id: { in: allIngredientIds } },
    });

    const totalPrice = calculatePrice(weightPrice, ingredientsData, layers);

    // --- Створення замовлення ---
    const newOrder = await prisma.customCakeOrder.create({
      data: {
        name,
        phone,
        eventType,
        weight: weightInput,
        comment,
        customImage,
        orderNumber,
        status: OrderStatus.NEW,
        totalPrice,
        persons,
        tiers: layers,
      },
    });

    // --- Прив'язка інгредієнтів ---
    for (const id of allIngredientIds) {
      await prisma.customCakeIngredient.create({
        data: { customCakeOrderId: newOrder.id, ingredientId: id },
      });
    }

    return new Response(JSON.stringify(newOrder), { status: 200 });
  } catch (e: any) {
    console.error("POST /api/custom-cakes error:", e);
    return new Response(e.message || "Помилка створення замовлення", { status: 500 });
  }
}

// --- GET: всі замовлення ---
export async function GET() {
  try {
    const orders = await prisma.customCakeOrder.findMany({
      include: { ingredients: { include: { ingredient: true } } },
      orderBy: { createdAt: "desc" },
    });

    const formatted = orders.map((o) => ({
      ...o,
      ingredients: o.ingredients.map((ing) => ({
        id: ing.ingredient.id,
        name: ing.ingredient.name,
        type: ing.ingredient.type,
        price: ing.ingredient.price,
      })),
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (e: any) {
    console.error("GET /api/custom-cakes error:", e);
    return new Response(e.message || "Помилка отримання замовлень", { status: 500 });
  }
}

// --- PUT: оновлення статусу ---
export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return new Response("ID та статус обов'язкові", { status: 400 });

    const updatedOrder = await prisma.customCakeOrder.update({
      where: { id },
      data: { status },
    });

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/custom-cakes error:", e);
    return new Response(e.message || "Помилка оновлення замовлення", { status: 500 });
  }
}
