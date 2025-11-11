"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Home" },
  { href: "/rate", label: "Rate Calculator" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="text-lg sm:text-xl font-semibold tracking-tight">OsarPosar</Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>OsarPosar</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 grid gap-3">
                {links.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={
                      pathname === l.href
                        ? "rounded-md bg-muted px-3 py-2 font-medium"
                        : "rounded-md px-3 py-2 text-muted-foreground hover:bg-muted"
                    }
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
