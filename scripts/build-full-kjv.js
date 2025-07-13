import fs from "fs";
import path from "path";

const srcDir = path.join(process.cwd(), "bible-kjv");
const booksList = JSON.parse(
  fs.readFileSync(path.join(srcDir, "Books.json"), "utf8")
);

const bible = {};

for (const bookName of booksList) {
  const fileName = `${bookName.replace(/\s/g, "")}.json`; // remove spaces
  const filePath = path.join(srcDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`❌ Missing file for ${bookName} → tried ${fileName}`);
    continue;
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const chapters = {};

  for (const chap of raw.chapters) {
    const versesMap = {};
    for (const verseObj of chap.verses) {
      versesMap[String(verseObj.verse)] = verseObj.text;
    }
    chapters[String(chap.chapter)] = versesMap;
  }

  bible[bookName] = chapters;
}

fs.mkdirSync("lib", { recursive: true });
fs.writeFileSync("lib/full-kjv.json", JSON.stringify(bible, null, 2));
console.log("✅ full-kjv.json created at lib/full-kjv.json");
