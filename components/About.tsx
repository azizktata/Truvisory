import { Award, BookOpen, Shield, Globe } from "lucide-react";

const About = () => {
  const credentials = [
    {
      icon: Award,
      title: "Expert-Comptable",
      description: "Diplômé et inscrit à l'Ordre des Experts-Comptables",
    },
    {
      icon: BookOpen,
      title: "Commissaire aux Comptes",
      description: "Inscrit à la Compagnie des Commissaires aux Comptes",
    },
    {
      icon: Shield,
      title: "24 ans d'expérience",
      description: "Accompagnement de PME et TPE en France et à l'international",
    },
    {
      icon: Globe,
      title: "Vision internationale",
      description: "Expertise en normes IFRS et fiscalité internationale",
    },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold mb-6">
              <span className="text-sm font-medium tracking-wide uppercase">À propos du cabinet</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
              Une expertise reconnue,
              <br />
              <span className="text-gold">une approche personnalisée</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              TRUV est un cabinet d'expertise comptable, d'audit et de conseil fondé par un professionnel 
              cumulant <strong className="text-primary">24 années d'expérience</strong> au service des entreprises françaises. 
              Notre mission : accompagner les PME et TPE dans leur développement avec rigueur, 
              éthique et excellence.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Notre fondateur, <strong className="text-primary">Expert-Comptable et Commissaire aux Comptes</strong>, 
              met son expertise au service d'une clientèle exigeante, notamment les entreprises 
              ayant une dimension internationale. Nous maîtrisons les normes comptables internationales 
              (IFRS) et les problématiques de fiscalité transfrontalière.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {credentials.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual element */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-navy-medium p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="font-serif text-8xl md:text-9xl font-bold text-gold mb-4">
                  T
                </div>
                <div className="font-serif text-2xl md:text-3xl font-semibold text-cream">
                  TRUV
                </div>
                <div className="mt-4 text-cream/60 text-sm uppercase tracking-widest">
                  Excellence • Rigueur • Confiance
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold/20 rounded-lg -z-10" />
            <div className="absolute -top-6 -left-6 w-16 h-16 border-2 border-gold/30 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
