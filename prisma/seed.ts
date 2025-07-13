import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

(async () => {
  await prisma.book.create({
    data: {
      name: "Genesis",
      abbreviation: "Gen",
      testament: "OT",
      bookOrder: 1,
      Verses: {
        createMany: {
          data: [
            {
              chapter: 1,
              verse: 1,
              text: "In the beginning God created...",
              translation: "kjv",
            },
            {
              chapter: 1,
              verse: 2,
              text: "And the earth was without form...",
              translation: "kjv",
            },
          ],
        },
      },
    },
  });
  console.log("Seeded!");
  await prisma.$disconnect();
})();
