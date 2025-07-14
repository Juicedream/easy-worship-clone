import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import Navbar from "@/components/Navbar";

export default function BookmarksPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <BookmarkForm />
        <BookmarkList userId="demo-user" />
      </main>
    </>
  );
}
