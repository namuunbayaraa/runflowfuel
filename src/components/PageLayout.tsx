"use client";

import { ThemeToggle } from "./ThemeToggle";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="w-full p-4 flex justify-end">
        <ThemeToggle />
      </header>
      {children}
    </div>
  );
}
