'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { InlineWidget } from "react-calendly";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Calendar,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { ContactSection } from "@/lib/wp-types";

// Icons hardcoded per position — design decision, not CMS content
const contactIcons: LucideIcon[] = [Phone, MessageCircle, Mail, MapPin, MapPin];

const contactSchema = z.object({
  name: z.string().min(2, "Nom requis (min. 2 caractères)"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message trop court (min. 10 caractères)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactProps {
  data: ContactSection;
}

const Contact = ({ data }: ContactProps) => {
  const [showCalendly, setShowCalendly] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast.success("Message envoyé ! Nous vous répondrons dans les plus brefs délais.");
        form.reset();
      } else {
        toast.error("Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-muted/30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block text-sm font-medium text-gold uppercase tracking-wider mb-4">
            {data.section_label}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            {data.heading_part1}{" "}
            <span className="text-gold">{data.heading_part2}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {data.subheading}
          </p>
        </div>

        {/* Segmented tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-card border border-border rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setShowCalendly(false)}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                !showCalendly
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <FileText className="h-4 w-4" />
              Envoyer un message
            </button>
            <button
              onClick={() => setShowCalendly(true)}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                showCalendly
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Prendre rendez-vous
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-10">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {data.contact_items.map((item, index) => {
              const Icon = contactIcons[index] ?? Phone;
              return (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-gold/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                      {item.label}
                    </div>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="font-medium text-primary hover:text-gold transition-colors truncate block"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Quick CTA */}
            <div className="pt-4 flex gap-3">
              <Button variant="gold" className="flex-1" asChild>
                <a href={data.cta_phone} className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  Appeler
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a
                  href={data.cta_whatsapp}
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

          {/* Right Panel: Form or Calendly */}
          <div className="lg:col-span-3">
            {showCalendly ? (
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="px-8 pt-8 pb-4">
                  <h3 className="font-serif text-xl font-bold text-primary mb-1">
                    Réservez un créneau
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez un horaire qui vous convient pour un entretien de 30 minutes.
                  </p>
                </div>
                <InlineWidget
                  url="https://calendly.com/faiez-rekik/30min"
                  styles={{ height: "660px", minWidth: "320px" }}
                  pageSettings={{
                    backgroundColor: "ffffff",
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: "c0392b",
                    textColor: "1a1a2e",
                  }}
                />
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-primary mb-6">
                  Envoyez-nous un message
                </h3>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                        Nom complet
                      </label>
                      <input
                        {...form.register("name")}
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                        placeholder="Votre nom"
                      />
                      {form.formState.errors.name && (
                        <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                        Téléphone
                      </label>
                      <input
                        {...form.register("phone")}
                        type="tel"
                        id="phone"
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
                      {...form.register("email")}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      placeholder="votre@email.com"
                    />
                    {form.formState.errors.email && (
                      <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                      Message
                    </label>
                    <textarea
                      {...form.register("message")}
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-none"
                      placeholder="Décrivez votre projet ou vos besoins..."
                    />
                    {form.formState.errors.message && (
                      <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Réponse garantie sous 24h ouvrées
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
