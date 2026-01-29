'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Téléphone",
    value: "(+216) 70 755 910",
    href: "tel:+21670755910",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Discutons sur WhatsApp",
    href: "https://wa.me/21653496484",
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@truv.fr",
    href: "mailto:contact@truv.fr",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Immeuble Laguna Square n° A6 cité les pins les berges du lac II - 1053 Tunis - Tunisie",
    href: "https://maps.app.goo.gl/c75bLkmFBRURhEoZ9",
    external: true,
  },
  {
    icon: MapPin,
    label: "Adresse Secondaire",
    value: "12 rue Quetigny 93800 Epinay sur Seine île de France",
    href: "https://maps.app.goo.gl/xShAHpEUKaKAXCQFA",
    external: true,
  },
  // {
  //   icon: Clock,
  //   label: "Horaires",
  //   value: "Lun - Ven : 9h00 - 18h00",
  // },
];

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="relative py-24 bg-muted/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
            Contact
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Parlons de votre{" "}
            <span className="text-gold">projet</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Notre équipe est à votre écoute pour un premier échange sans engagement.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-10 ">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-4 ">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                  <item.icon className="h-5 w-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="font-medium text-primary hover:text-gold transition-colors truncate block"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium text-primary truncate">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Quick CTA */}
            <div className="pt-4 flex gap-3">
              <Button variant="gold" className="flex-1" asChild>
                <a href="tel:+33123456789" className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  Appeler
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a
                  href="https://wa.me/33123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-primary mb-6">
                Envoyez-nous un message
              </h3>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">Message envoyé !</h4>
                  <p className="text-muted-foreground text-sm">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                        placeholder="+216 00 000 000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-none"
                      placeholder="Décrivez votre projet ou vos besoins..."
                    />
                  </div>

                  <Button type="submit" variant="gold" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Réponse garantie sous 24h ouvrées
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
