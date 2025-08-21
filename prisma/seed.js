import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const cakes = [
  {
    name: "Шоколадний торт",
    description: "Смачний шоколадний торт з кремом",
    price: 500,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?q=80&w=682&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    name: "Полуничний торт",
    description: "Торт з полуничним кремом",
    price: 550,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1715073808638-2d4e76e27390?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
  {
    name: "Медовий торт",
    description: "Ніжний медовий торт з горіхами",
    price: 600,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1714342967641-ea23c8409cbe?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
  {
    name: "Ванільний торт",
    description: "Класичний ванільний торт з кремом",
    price: 450,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1714591971607-ba1d91fc8386?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
  {
    name: "Чізкейк",
    description: "Ніжний сирний чізкейк з ягодами",
    price: 650,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1714146022660-d9c01e9e6c8c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
  {
    name: "Морквяний торт",
    description: "Морквяний торт з горіхами та кремом",
    price: 500,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1713371128106-3d4c5ad9e308?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
  {
    name: "Лимонний торт",
    description: "Свіжий лимонний торт з кремом",
    price: 480,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1717017014070-2941b0d27b61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
  {
    name: "Фруктовий торт",
    description: "Торт зі свіжими фруктами та кремом",
    price: 700,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1723478441268-db17719af8a6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
  {
    name: "Капкейк-торт",
    description: "Торт із капкейків з шоколадом",
    price: 550,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1716918806817-62959f81cb76?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
  {
    name: "Тірамісу",
    description: "Італійський торт тірамісу з кавою",
    price: 650,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1716582338435-8c13a261d3ab?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  },
];

const ingredients = [
  // Бісквіти
  { name: "Шоколадний бісквіт", type: "BISCUIT", price: 150 },
  { name: "Ванільний бісквіт", type: "BISCUIT", price: 140 },
  { name: "Медовий бісквіт", type: "BISCUIT", price: 160 },

  // Креми
  { name: "Крем-чиз", type: "CREAM", price: 100 },
  { name: "Шоколадний крем", type: "CREAM", price: 120 },
  { name: "Ванільний крем", type: "CREAM", price: 110 },

  // Начинки
  { name: "Полунична начинка", type: "FILLING", price: 80 },
  { name: "Вишнева начинка", type: "FILLING", price: 90 },
  { name: "Малиновий джем", type: "FILLING", price: 85 },

  // Декор
  { name: "Ягоди та декор", type: "DECORATION", price: 60 },
  { name: "Фігурки з мастики", type: "DECORATION", price: 150 },
  { name: "Горіхи та посипка", type: "DECORATION", price: 70 },
];

async function main() {
  // Створення адміна
  const hashedPassword = await bcrypt.hash("1122334455667788", 10);

  await prisma.admin.upsert({
    where: { email: "amalishouse@gmail.com" },
    update: {},
    create: {
      email: "amalishouse@gmail.com",
      username: "amalishouse",
      password: hashedPassword,
    },
  });

  // Перезапис тортів
  await prisma.cake.deleteMany();
  await prisma.cake.createMany({ data: cakes });

  // Перезапис інгредієнтів
  await prisma.ingredient.deleteMany();
  await prisma.ingredient.createMany({ data: ingredients });

  console.log("✅ Seed успішно виконаний: додано адміна, 10 тортів та інгредієнти!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
