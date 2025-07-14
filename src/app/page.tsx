// app/(dashboard)/bible/page.tsx
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/db";

type Book = {
  id: number;
  name: string;
  verses: Array<any>;
  testament: string;
  bookOrder: number;
};

export default async function BiblePage() {
  const books: Book[] = await prisma.book.findMany({
    orderBy: { bookOrder: "asc" },
    include: { verses: true },
  });

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Bible Books</h1>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {books.map((book: Book) => (
            <li
              key={book.id}
              className="bg-gray-500 p-4 rounded shadow"
              title={`${book.name} has ${book?.verses.length} verses`}
            >
              <h2 className="font-semibold">{book.name}</h2>
              <p className="text-sm text-black">{book.testament}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
