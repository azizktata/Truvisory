import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold mb-6">
              <span className="text-sm font-medium tracking-wide uppercase">Contact</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Parlons de votre
              <br />
              <span className="text-gold">projet ensemble</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Que vous ayez besoin d'un accompagnement ponctuel ou d'un partenariat de long terme, 
              notre équipe est à votre écoute. Contactez-nous pour un premier échange sans engagement.
            </p>

            {/* Contact info */}
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-primary">Téléphone</div>
                  <a href="tel:+33123456789" className="text-muted-foreground hover:text-gold transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-primary">WhatsApp</div>
                  <a 
                    href="https://wa.me/33123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-gold transition-colors"
                  >
                    Discutons sur WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-primary">Email</div>
                  <a href="mailto:contact@truv.fr" className="text-muted-foreground hover:text-gold transition-colors">
                    contact@truv.fr
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-primary">Adresse</div>
                  <p className="text-muted-foreground">
                    Paris, France
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-primary">Horaires</div>
                  <p className="text-muted-foreground">
                    Lun - Ven : 9h00 - 18h00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="flex items-center">
            <div className="w-full bg-gradient-to-br from-primary to-navy-medium rounded-2xl p-10 lg:p-12">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-cream mb-4">
                Prêt à nous confier vos projets ?
              </h3>
              
              <p className="text-cream/70 mb-8 leading-relaxed">
                Bénéficiez d'un premier entretien gratuit et sans engagement pour 
                évaluer ensemble vos besoins et définir la meilleure stratégie.
              </p>

              <div className="space-y-4">
                <Button variant="hero" size="xl" className="w-full" asChild>
                  <a href="tel:+33123456789" className="flex items-center justify-center gap-2">
                    <Phone className="h-5 w-5" />
                    Appeler maintenant
                  </a>
                </Button>

                <Button variant="hero-outline" size="xl" className="w-full" asChild>
                  <a 
                    href="https://wa.me/33123456789?text=Bonjour,%20je%20souhaite%20obtenir%20des%20informations%20sur%20vos%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Contacter via WhatsApp
                  </a>
                </Button>
              </div>

              {/* Trust badge */}
              <div className="mt-8 pt-6 border-t border-cream/10 text-center">
                <p className="text-cream/50 text-sm">
                  Réponse garantie sous 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
