type BibleVerse = {
  id: number;
  chapter: number;
  verse: number;
  text: string;
};

interface BibleReaderProps {
  bookName: string;
  chapter: number;
  verses: BibleVerse[];
}

export default function BibleReader({
  bookName,
  chapter,
  verses,
}: BibleReaderProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {bookName} {chapter}
      </h2>
      <div className="space-y-1">
        {verses.map((v) => (
          <p key={v.id}>
            <span className="font-semibold text-sm mr-1">{v.verse}</span>
            {v.text}
          </p>
        ))}
      </div>
    </div>
  );
}
