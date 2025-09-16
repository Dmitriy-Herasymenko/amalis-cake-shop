import { prisma } from "@/app/lib/prisma";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // вимикаємо стандартний JSON parser
  },
};

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// --- POST: створення нового торта ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const price = formData.get("price")?.toString();
    const image = formData.get("image") as File;

    if (!name || !description || !price || !image) {
      return new Response("All fields including image are required", { status: 400 });
    }

    // Збереження файлу
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(UPLOAD_DIR, image.name);
    fs.writeFileSync(filePath, buffer);
    const imageUrl = `/uploads/${image.name}`;

    const cake = await prisma.cake.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
      },
    });

    return new Response(JSON.stringify(cake), { status: 200 });
  } catch (e: any) {
    return new Response(e.message || "Error creating cake", { status: 500 });
  }
}

// --- GET: отримати всі торти ---
export async function GET() {
  try {
    const cakes = await prisma.cake.findMany();
    return new Response(JSON.stringify(cakes), { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 500 });
    }
    return new Response("Error fetching cakes", { status: 500 });
  }
}


// --- DELETE: видалити торт за id ---
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("ID required", { status: 400 });

  try {
    await prisma.cake.delete({ where: { id: parseInt(id) } });
    return new Response("Deleted", { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return new Response(e.message || "Error deleting cake", { status: 500 });
    }

  }
}

// --- PUT: оновити торт ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, price } = body;
    if (!id) return new Response("ID required", { status: 400 });

    const cake = await prisma.cake.update({
      where: { id: id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
      },
    });

    return new Response(JSON.stringify(cake), { status: 200 });
  } catch (e: unknown) {

    if (e instanceof Error) {
      return new Response(e.message || "Error updating cake", { status: 500 });
    }

  }
}
