import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("1122334455667788", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "amalishouse@gmail.com" },
    update: {},
    create: {
      email: "amalishouse@gmail.com",
      username: "amalishouse",
      password: hashedPassword,
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
