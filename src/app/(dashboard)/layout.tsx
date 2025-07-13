import Link from "next/link";
import "@/app/globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <nav className="p-4 flex gap-4 bg-zinc-900 shadow">
          {["bible", "search", "bookmarks", "presentations"].map((p) => (
            <Link
              key={p}
              href={`/${p}`}
              className="capitalize hover:text-emerald-400"
            >
              {p}
            </Link>
          ))}
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
