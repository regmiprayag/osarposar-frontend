// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">OsarPosar</h1>
        <p className="text-muted-foreground">Welcome! Use our instant rate calculator.</p>
        <Link href="/rate" className="underline">Go to Calculator →</Link>
      </div>
    </main>
  );
}