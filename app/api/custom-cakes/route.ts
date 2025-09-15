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
    const body = await req.json();

    const {
      name,
      phone,
      eventType,
      comment,
      tiers,
      persons,
      weight,
      urgent,
      address,
      deliveryType,
      ingredients = [],
    } = body;

    // --- Перевірки ---
    if (!name || !phone)
      return Response.json({ error: "Ім'я та телефон обов'язкові" }, { status: 400 });
    if (!Array.isArray(ingredients) || ingredients.length === 0)
      return Response.json({ error: "Необхідно обрати інгредієнти" }, { status: 400 });

    // --- Розбір по категоріях ---
    const ingredientsData = await prisma.ingredient.findMany({
      where: { id: { in: ingredients } },
    });

    const biscuits = ingredientsData.filter((i) => i.type === "BISCUIT");
    const soakings = ingredientsData.filter((i) => i.type === "SOAKING");
    const creams = ingredientsData.filter((i) => i.type === "CREAM");
    const fillings = ingredientsData.filter((i) => i.type === "FILLING");

    if (biscuits.length !== 1)
      return Response.json({ error: "Виберіть 1 варіант бісквіту" }, { status: 400 });
    if (soakings.length > 2)
      return Response.json({ error: "Виберіть максимум 2 варіанти просочення" }, { status: 400 });
    if (creams.length !== 1)
      return Response.json({ error: "Виберіть 1 варіант крему" }, { status: 400 });
    if (fillings.length > 3)
      return Response.json({ error: "Виберіть максимум 3 варіанти начинки" }, { status: 400 });

    // --- Унікальний номер ---
    const orderNumber = await generateUniqueOrderNumber();

    // --- Розрахунок ціни ---
    let weightPrice = 0;
    if (persons <= 5) weightPrice = 900;
    else if (persons <= 8) weightPrice = 1350;
    else if (persons <= 12) weightPrice = 1800;
    else {
      const calculatedWeight = persons * 0.18;
      weightPrice = calculatedWeight * 900;
    }

    const totalPrice = calculatePrice(weightPrice, ingredientsData, tiers);

  const newOrder = await prisma.customCakeOrder.create({
  data: {
    name: body.name,
    phone: body.phone,
    eventType: body.eventType,
    weight: body.weight,
    comment: body.comment,
    customImage: body.customImage,
    persons: body.persons,
    tiers: body.tiers,
    totalPrice: totalPrice,
    deliveryType: body.deliveryType , // якщо є в схемі
    address: body.address,           // якщо є в схемі
    rushOrder: body.rushOrder ?? false, // <-- замість urgent
    status: "NEW",
    ingredients: {
      create: body.ingredients.map((id: number) => ({
        ingredient: { connect: { id } },
      })),
    },
  },
});


    // --- Прив'язка інгредієнтів ---
    for (const id of ingredients) {
      await prisma.customCakeIngredient.create({
        data: { customCakeOrderId: newOrder.id, ingredientId: id },
      });
    }

    return Response.json(newOrder, { status: 200 });
  } catch (e: any) {
    console.error("POST /api/custom-cakes error:", e);
    return Response.json(
      { error: e.message || "Помилка створення замовлення" },
      { status: 500 }
    );
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
