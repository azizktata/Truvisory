import Image from "next/image";
import {
  Award,
  TrendingUp,
  Scale,
  Globe,
  Search,
  Briefcase,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { FounderSection } from "@/lib/wp-types";
import { resolveWPImageUrl } from "@/lib/wp-types";

// Icons hardcoded per position — design decision, not CMS content
const expertiseIcons: LucideIcon[] = [Award, TrendingUp, Scale, Globe, Search, Briefcase];

interface FounderProps {
  data: FounderSection;
}

const Founder = ({ data }: FounderProps) => {
  const photoUrl = resolveWPImageUrl(data.image);

  return (
    <section id="founder" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Image/Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary to-navy-medium rounded-2xl aspect-[4/5] overflow-hidden">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={data.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-8xl md:text-9xl font-bold text-cream/20">
                      {data.initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-gold/20 rounded-2xl" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
              Le Fondateur
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              {data.name}
            </h2>

            <p className="text-lg text-gold font-medium mb-6">
              {data.title}
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {data.bio}
            </p>

            {/* Expertise Grid */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {data.expertise.map((item, index) => {
                const Icon = expertiseIcons[index] ?? Award;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-sm font-medium text-primary">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Trust badges — hardcoded, decorative */}
            <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-3 border border-border">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <div className="font-semibold text-primary text-sm">Ordre des Experts-Comptables</div>
                    <p className="text-muted-foreground text-xs">Membre inscrit</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <div className="font-semibold text-primary text-sm">Compagnie des CAC</div>
                    <p className="text-muted-foreground text-xs">Commissaire certifié</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
