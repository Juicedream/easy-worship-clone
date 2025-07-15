import { PrismaClient } from "../src/generated/prisma/index.js";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Load the full-kjv.json
const filePath = path.join(process.cwd(), "lib", "full-kjv.json");
console.log("📖 Loading:", filePath);
const fullKJV = JSON.parse(fs.readFileSync(filePath, "utf8"));



async function seedFullKJV() {
  for (const [bookName, chapters] of Object.entries(fullKJV)) {
    const book = await prisma.book.findUnique({ where: { name: bookName } });

    if (!book) {
      console.warn(`❌ Book not found: ${bookName}`);
      continue;
    }

    for (const [chapterNum, verses] of Object.entries(chapters)) {
      for (const [verseNum, text] of Object.entries(verses)) {
        await prisma.verse.create({
          data: {
            bookId: book.id,
            chapter: parseInt(chapterNum),
            verse: parseInt(verseNum),
            text,
            translation: "kjv",
          },
        });
      }
    }

    console.log(`✅ Done seeding: ${bookName}`);
  }

  console.log("🎉 All verses seeded!");
}

seedFullKJV()
  .catch((err) => {
    console.error("❌ Error seeding full KJV:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
