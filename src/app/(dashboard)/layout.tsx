// import "@/app/globals.css";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-zinc-100p-6">
        {children}
      </main>
    </>
  );
}
