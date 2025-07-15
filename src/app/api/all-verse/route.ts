import { NextRequest, NextResponse } from "next/server";
import { TRANSLATIONS } from "@/utils/translations";
import { API_BIBLE_BOOK_IDS } from "@/utils/apiBibleBookIds";

export async function POST(req: NextRequest) {
  const { book, chapter, verse, translation = "KJV" } = await req.json();

  const bibleId = TRANSLATIONS[translation];
  if (!bibleId) {
    return NextResponse.json(
      { error: "Unsupported translation" },
      { status: 400 }
    );
  }

  const bookCode = API_BIBLE_BOOK_IDS[book];
  if (!bookCode) {
    return NextResponse.json(
      { error: `Book "${book}" is not recognized.` },
      { status: 400 }
    );
  }

  const verseId = `${bookCode}.${chapter}.${verse}`;

  try {
    const r = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}`,
      {
        headers: { "api-key": process.env.BIBLE_API_KEY! },
      }
    );

    if (!r.ok) {
      throw new Error(`API.Bible error ${r.status}`);
    }

    const data = await r.json();
    const text = data.data.content
      .replace(/<[^>]+>/g, "") // remove HTML tags
      .replace(/\s+/g, " ") // collapse whitespace
      .trim();

    return NextResponse.json({
      book,
      chapter,
      verse,
      translation,
      text,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch verse" },
      { status: 500 }
    );
  }
}
