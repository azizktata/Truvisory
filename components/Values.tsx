import {
  Award,
  Eye,
  Target,
  Shield,
  CheckCircle,
  Scale
} from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Professionnalisme",
    description: "Rigueur et engagement dans chaque mission.",
  },
  {
    icon: Eye,
    title: "Transparence",
    description: "Communication claire et relation de confiance.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Standards élevés et efficience opérationnelle.",
  },
  {
    icon: Scale,
    title: "Objectivité",
    description: "Meilleures pratiques internationales.",
  },
  {
    icon: CheckCircle,
    title: "Fiabilité",
    description: "Compétence technique éprouvée.",
  },
  {
    icon: Shield,
    title: "Éthique",
    description: "Intégrité et confidentialité absolue.",
  },
];

const Values = () => {
  return (
    <section id="values" className="relative py-24 bg-navy-deep overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Top border gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
              Nos valeurs
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream">
              Les principes qui guident{" "}
              <span className="text-gold">notre excellence</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-cream/70 lg:max-w-sm lg:text-right">
            Ces valeurs structurent notre relation avec nos partenaires et guident chacune de nos missions.
          </p>
        </div>

        {/* Values Grid - Modern cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="group relative"
            >
              {/* Card with gradient border on hover */}
              <div className="relative h-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-500 hover:border-gold/30 hover:bg-white/10">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon with modern styling */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-all duration-300">
                      <value.icon className="h-7 w-7 text-gold" />
                    </div>
                    {/* Number indicator */}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/10 text-xs font-medium text-cream/60 flex items-center justify-center">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-xl font-bold text-cream mb-2 group-hover:text-gold transition-colors duration-300">
                    {value.title}
                  </h3>

                  <p className="text-cream/60 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden rounded-br-2xl">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-gold/10 to-transparent transform translate-x-1/2 translate-y-1/2 group-hover:from-gold/20 transition-colors duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges - modernized */}
        <div className="mt-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-cream">Ordre des Experts-Comptables</div>
                  <p className="text-cream/50 text-sm">Membre inscrit</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-cream">Compagnie des CAC</div>
                  <p className="text-cream/50 text-sm">Commissaire certifié</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-cream">Normes IFRS</div>
                  <p className="text-cream/50 text-sm">Standards internationaux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
