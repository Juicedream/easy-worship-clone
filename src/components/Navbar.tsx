import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="p-4 flex gap-4 bg-zinc-900 shadow">
      {["bible", "search", "control", "projector", "bookmarks"].map((p) => (
        <Link
          key={p}
          href={`/${p}`}
          className="capitalize hover:text-emerald-400"
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
export default Navbar