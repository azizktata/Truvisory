const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-cream">
      {/* Top section */}
      <div className="container mx-auto px-6 lg:px-12 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-semibold">
              TRUVISORY
            </h3>
            <p className="mt-3 text-sm text-cream/60 leading-relaxed">
              Cabinet d’Expertise Comptable et de Commissariat aux Comptes,
              accompagnant les entreprises avec rigueur, indépendance et
              vision stratégique.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-cream/80">
              Navigation
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#hero" className="text-cream/60 hover:text-gold transition">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#about" className="text-cream/60 hover:text-gold transition">
                  À propos
                </a>
              </li>
              <li>
                <a href="#services" className="text-cream/60 hover:text-gold transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#sectors" className="text-cream/60 hover:text-gold transition">
                  Domaines d’expertise
                </a>
              </li>
              <li>
                <a href="#contact" className="text-cream/60 hover:text-gold transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-cream/80">
              Informations légales
            </h4>
            <address className="mt-4 not-italic">
              <p className="text-sm text-cream/60 leading-relaxed">
                Expert-Comptable inscrit à l’Ordre des Experts-Comptables<br />
                Commissaire aux Comptes
              </p>
            </address>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">
            © {currentYear} TRUVISORY — Tous droits réservés
          </p>
          <p className="text-xs text-cream/40">
            Développé
             par <a href="https://asis.tn" className="text-gold" target="_blank" rel="noopener noreferrer">Asis.tn</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
