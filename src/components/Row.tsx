"use client";

import React from "react";

export default function Row({
  label,
  children,
  bold = false,
}: {
  label: string;
  children: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span
        className={bold ? "font-semibold tabular-nums" : "tabular-nums"}
        suppressHydrationWarning
      >
        {children}
      </span>
    </div>
  );
}