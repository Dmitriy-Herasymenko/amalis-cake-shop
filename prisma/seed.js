import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cakes = [
  {
    name: "Шоколадний торт",
    description: "Смачний шоколадний торт з кремом",
    price: 500,
    imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
  },
  {
    name: "Полуничний торт",
    description: "Торт з полуничним кремом",
    price: 550,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
  },
  {
    name: "Медовий торт",
    description: "Ніжний медовий торт з горіхами",
    price: 600,
    imageUrl: "https://images.unsplash.com/photo-1627308611864-0b74ecf5a73c",
  },
  {
    name: "Ванільний торт",
    description: "Класичний ванільний торт з кремом",
    price: 450,
    imageUrl: "https://images.unsplash.com/photo-1599785209707-9c29df5f09e4",
  },
  {
    name: "Чізкейк",
    description: "Ніжний сирний чізкейк з ягодами",
    price: 650,
    imageUrl: "https://images.unsplash.com/photo-1601924582970-1fefb4e90f8e",
  },
  {
    name: "Морквяний торт",
    description: "Морквяний торт з горіхами та кремом",
    price: 500,
    imageUrl: "https://images.unsplash.com/photo-1603133872876-51b1b74e5d57",
  },
  {
    name: "Лимонний торт",
    description: "Свіжий лимонний торт з кремом",
    price: 480,
    imageUrl: "https://images.unsplash.com/photo-1624432760488-3b620c7f7b68",
  },
  {
    name: "Фруктовий торт",
    description: "Торт зі свіжими фруктами та кремом",
    price: 700,
    imageUrl: "https://images.unsplash.com/photo-1578985545065-9c6f1b57e1a8",
  },
  {
    name: "Капкейк-торт",
    description: "Торт із капкейків з шоколадом",
    price: 550,
    imageUrl: "https://images.unsplash.com/photo-1617196034296-4c9620b18c05",
  },
  {
    name: "Тірамісу",
    description: "Італійський торт тірамісу з кавою",
    price: 650,
    imageUrl: "https://images.unsplash.com/photo-1589308078057-9b0c1c2dc6d3",
  },
];

async function main() {
  // Видаляємо всі старі записи
  await prisma.cake.deleteMany();

  // Додаємо нові записи
  for (const cake of cakes) {
    await prisma.cake.create({ data: cake });
  }

  console.log("✅ 10 тортів додано!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
