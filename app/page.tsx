import CakesList from "./cakes/CakesList";
import { PrismaClient } from "@prisma/client";
import Navbar from "./components/Navbar";


const prisma = new PrismaClient();
export default async function Home() {

  const cakes = await prisma.cake.findMany();
  return (

    <>
      <Navbar />
      <CakesList cakes={cakes || []} />;
    </>
  );
}
