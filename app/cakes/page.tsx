// app/cakes/page.tsx
import CakesList from "../cakes/CakesList";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function CakesPage() {
  const cakes = await prisma.cake.findMany();

  return <CakesList cakes={cakes || []} />;
}
