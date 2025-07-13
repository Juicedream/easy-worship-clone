import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();
import { books } from "../src/lib/biblebooks.js";


async function main() {
  await prisma.$connect();
  console.log("📡 Connected to DB");

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    console.log("Seeding:", book.name);

    try {
      await prisma.book.upsert({
        where: { name: book.name },
        update: {},
        create: {
          name: book.name,
          abbreviation: book.abbreviation,
          testament: book.testament,
          bookOrder: i + 1,
        },
      });
    } catch (error) {
      console.error(`❌ Error with ${book.name}:`, error);
    }
  }

  console.log("✅ Done seeding");
}

main()
  .catch((e) => {
    console.error("Main error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
