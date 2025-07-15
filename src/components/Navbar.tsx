import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
   
      <nav className="p-4 flex flex-row items-center justify-between gap-4 bg-zinc-600 shadow">
        <div className="p-4 flex gap-4">
          {["bible", "search", "control", "projector", "bookmarks", "history"].map((p) => (
            <Link
              key={p}
              href={`/${p}`}
              className="capitalize hover:text-emerald-400"
            >
              {p}
            </Link>
          ))}
        </div>
        <header className="flex justify-end items-center p-4 gap-4 h-16">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </nav>
   
  );
};
export default Navbar;
