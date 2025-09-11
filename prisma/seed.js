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
  // =====================
  // 1. Бісквіти
  // =====================
  { name: "Ванільний", type: "BISCUIT", price: 140 },
  { name: "Шоколадний", type: "BISCUIT", price: 150 },
  { name: "Лимонний", type: "BISCUIT", price: 150 },
  { name: "Червоний оксамит", type: "BISCUIT", price: 160 },
  { name: "Горіховий", type: "BISCUIT", price: 170 },
  { name: "Маковий", type: "BISCUIT", price: 160 },

  // =====================
  // 2. Просочення
  // =====================
  { name: "Класичне цукрове", type: "SOAKING", price: 0 },
  { name: "Цитрусове", type: "SOAKING", price: 0 },
  { name: "Фруктове", type: "SOAKING", price: 0 },
  { name: "Карамельне", type: "SOAKING", price: 0 },
  { name: "Молочне", type: "SOAKING", price: 0 },
  { name: "Кавове", type: "SOAKING", price: 0 },

  // алкогольні просочення
  { name: "Коньяк", type: "SOAKING", price: 50 },
  { name: "Горілка", type: "SOAKING", price: 50 },
  { name: "Апероль", type: "SOAKING", price: 70 },
  { name: "Кокосовий лікер", type: "SOAKING", price: 70 },
  { name: "Єгермейстер", type: "SOAKING", price: 80 },

  // =====================
  // 3. Креми
  // =====================
  { name: "Крем з м’якого сиру + масло", type: "CREAM", price: 100 },
  { name: "Крем на маскарпоне", type: "CREAM", price: 120 },
  { name: "Крем вершково-йогуртовий", type: "CREAM", price: 110 },
  { name: "Шоколадний крем-чіз", type: "CREAM", price: 130 },
  { name: "Крем сирково-ягідний", type: "CREAM", price: 120 },
  { name: "Крем зі згущеним молоком", type: "CREAM", price: 110 },

  // =====================
  // 4. Начинка
  // =====================
  { name: "Ганаш молочний шоколад", type: "FILLING", price: 60 },
  { name: "Ганаш білий шоколад", type: "FILLING", price: 60 },
  { name: "Ганаш чорний шоколад", type: "FILLING", price: 60 },
  { name: "Солодка карамель", type: "FILLING", price: 50 },
  { name: "Солона карамель", type: "FILLING", price: 55 },

  // ягоди
  { name: "Малина", type: "FILLING", price: 70 },
  { name: "Полуниця", type: "FILLING", price: 70 },
  { name: "Чорниця", type: "FILLING", price: 70 },
  { name: "Абрикос", type: "FILLING", price: 70 },
  { name: "Вишня", type: "FILLING", price: 70 },

  // вишня в алкоголі
  { name: "Вишня в амаретто", type: "FILLING", price: 90 },
  { name: "Вишня в коньяку", type: "FILLING", price: 90 },
  { name: "Вишня в горілці", type: "FILLING", price: 85 },

  // горіхи
  { name: "Фундук", type: "FILLING", price: 80 },
  { name: "Мигдаль", type: "FILLING", price: 80 },
  { name: "Фісташка", type: "FILLING", price: 120 },
  { name: "Волоський горіх", type: "FILLING", price: 80 },
  { name: "Кешью", type: "FILLING", price: 100 },
  { name: "Арахіс", type: "FILLING", price: 60 },

  { name: "Карамелізовані банани", type: "FILLING", price: 80 },
  { name: "Кокосова начинка", type: "FILLING", price: 70 },
  { name: "Горіхове праліне", type: "FILLING", price: 100 },
  { name: "Цитрусовий курд", type: "FILLING", price: 80 },

  // екзотичні
  { name: "Манго-ананас", type: "FILLING", price: 100 },
  { name: "Манго-маракуйя", type: "FILLING", price: 100 },
  { name: "Персик-манго", type: "FILLING", price: 100 },
  { name: "Персик-маракуйя", type: "FILLING", price: 100 },

  // сухофрукти
  { name: "Курага", type: "FILLING", price: 60 },
  { name: "Фінік", type: "FILLING", price: 60 },
  { name: "Чорнослив", type: "FILLING", price: 60 },
  { name: "Журавлина", type: "FILLING", price: 60 },

  // =====================
  // 5. Декор
  // =====================
  { name: "Стандартний (голий торт)", type: "DECOR", price: 0 },
  { name: "Два яруси (від 3.5 кг)", type: "DECOR", price: 0 },
  { name: "Три яруси (від 5 кг)", type: "DECOR", price: 0 },
  { name: "Ягоди та декор", type: "DECOR", price: 60 },
  { name: "Фігурки з мастики", type: "DECOR", price: 150 },
  { name: "Горіхи та посипка", type: "DECOR", price: 70 },
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
