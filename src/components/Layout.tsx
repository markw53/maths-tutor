import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-background flex flex-col min-h-screen text-foreground relative">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 pb-8 relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
