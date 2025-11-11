import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-4xl font-semibold text-foreground tracking-tight">
          Welcome to OsarPosar
        </h1>
        <p className="text-muted-foreground">
          Calculate your product delivery cost from India to Nepal in seconds.
        </p>
        <Link
          href="/rate"
          className="inline-block rounded-full bg-primary text-white px-8 py-3 font-medium shadow hover:bg-primary/90 transition"
        >
          Open Rate Calculator →
        </Link>
      </div>
    </main>
  );
}
