import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { createdAt: "asc" },
    });
    return new Response(JSON.stringify(ingredients), { status: 200 });
  } catch (e: unknown) {
        if (e instanceof Error) { 
           return new Response(e.message || "Error fetching ingredients", { status: 500 });
        }

   
  }
}
