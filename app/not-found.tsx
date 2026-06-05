import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <div className="text-center max-w-md">
        <p className="text-7xl font-serif font-bold text-gold mb-4">404</p>
        <h1 className="font-serif text-2xl font-bold text-primary mb-4">
          Page introuvable
        </h1>
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button variant="gold" size="lg" asChild>
          <a href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </a>
        </Button>
      </div>
    </main>
  );
}
