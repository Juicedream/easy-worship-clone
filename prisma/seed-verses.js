import { PrismaClient } from "../src/generated/prisma/index.js"; // Or from "@prisma/client" if not customized
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const filePath = path.join(process.cwd(), "lib", "full-kjv.json");
console.log("Loading:", filePath);

const kjvData = JSON.parse(fs.readFileSync(filePath, "utf8"));

async function seedVerses() {
  await prisma.verse.deleteMany();

  for (const [bookName, chapters] of Object.entries(kjvData)) {
    const book = await prisma.book.findUnique({ where: { name: bookName } });

    if (!book) {
      console.warn(`❌ Book not found: ${bookName}`);
      continue;
    }

    for (const [chapter, verses] of Object.entries(chapters)) {
      for (const [verse, text] of Object.entries(verses)) {
        await prisma.verse.create({
          data: {
            bookId: book.id,
            chapter: parseInt(chapter),
            verse: parseInt(verse),
            text,
            translation: "kjv",
          },
        });
      }
    }

    console.log(`✅ Seeded ${bookName}`);
  }
}

seedVerses()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
