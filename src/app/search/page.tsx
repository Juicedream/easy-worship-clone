import BibleSearch from "@/components/bible/BibleSearch";
import Navbar from "@/components/Navbar";


export default function SearchPage() {
  return (
    <>
    <Navbar />
    <main className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">🔍 Bible Verse Search</h1>
      <BibleSearch />
    </main>
    </>
  );
}
