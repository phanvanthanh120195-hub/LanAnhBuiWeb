import { Button } from "@/components/ui/button";

const PricingIllustration = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Pricing Card */}
          <div className="bg-card rounded-sm border border-border/50 p-8 lg:p-12 shadow-[var(--shadow-soft)] order-2 lg:order-1">
            <div className="text-center space-y-6">
              <h3 className="font-heading text-xl uppercase tracking-wider text-muted-foreground">
                Học phí
              </h3>
              <p className="font-heading text-5xl lg:text-6xl font-light text-primary">
                6,500,000
              </p>
              <p className="text-muted-foreground">VNĐ</p>
              
              <Button variant="course" size="xl" className="w-full uppercase">
                Mua khóa học
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[3/4] max-w-sm mx-auto bg-gradient-to-b from-secondary/50 to-cream rounded-sm flex items-center justify-center border border-border/20 overflow-hidden">
              <div className="text-center p-8">
                <div className="w-40 h-56 mx-auto border border-primary/20 rounded-sm bg-background/30 flex items-center justify-center">
                  <span className="font-heading text-7xl text-primary/25 italic">✿</span>
                </div>
                <p className="mt-4 font-heading text-sm italic text-muted-foreground">Watercolor Fashion</p>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingIllustration;
