import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OsarPosar | Smart Rate Calculator",
  description:
    "Easily calculate product delivery cost from India to Nepal in seconds using OsarPosar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-foreground antialiased">
        <header className="border-b border-border/40 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <h1 className="text-xl font-semibold tracking-tight text-primary">
              OsarPosar
            </h1>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <a
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </a>
              <a
                href="/rate"
                className="hover:text-foreground transition-colors"
              >
                Rate Calculator
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>

        <footer className="border-t border-border/40 bg-white/50 mt-12 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} OsarPosar — All rights reserved.
        </footer>
      </body>
    </html>
  );
}
