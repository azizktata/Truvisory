const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <div>
            <span className="font-serif text-2xl font-bold text-cream">TRUV</span>
            <p className="text-cream/50 text-sm mt-2">
              Expert-Comptable & Commissaire aux Comptes
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#about" className="text-cream/60 hover:text-gold transition-colors text-sm">
              À propos
            </a>
            <a href="#expertise" className="text-cream/60 hover:text-gold transition-colors text-sm">
              Expertise
            </a>
            <a href="#values" className="text-cream/60 hover:text-gold transition-colors text-sm">
              Valeurs
            </a>
            <a href="#contact" className="text-cream/60 hover:text-gold transition-colors text-sm">
              Contact
            </a>
          </div>

          {/* Legal */}
          <div className="text-center md:text-right">
            <p className="text-cream/40 text-sm">
              © {currentYear} TRUV. Tous droits réservés.
            </p>
            <p className="text-cream/30 text-xs mt-1">
              Membre de l'Ordre des Experts-Comptables
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
