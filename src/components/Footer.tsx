const Footer = () => {
  return (
    <footer className="py-12 bg-secondary/50 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <p className="font-heading text-2xl italic text-primary">Kiquy</p>
          <p className="text-sm text-muted-foreground">
            Fashion Illustration Course
          </p>
          <div className="section-divider" />
          <p className="text-xs text-muted-foreground">
            © 2024 Kiquy Pham. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
