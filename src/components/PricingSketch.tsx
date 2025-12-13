import { Button } from "@/components/ui/button";

const PricingSketch = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Illustration */}
          <div className="relative">
            <div className="aspect-square max-w-sm mx-auto bg-gradient-to-b from-background to-cream rounded-sm flex items-center justify-center border border-border/20">
              <div className="text-center p-8">
                <div className="w-32 h-44 mx-auto border border-primary/20 rounded-sm bg-background/50 flex items-center justify-center">
                  <span className="font-heading text-6xl text-primary/30 italic">✿</span>
                </div>
                <p className="mt-4 font-heading text-sm italic text-muted-foreground">Fashion Sketch</p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-card rounded-sm border border-border/50 p-8 lg:p-12 shadow-[var(--shadow-soft)]">
            <div className="text-center space-y-6">
              <h3 className="font-heading text-xl uppercase tracking-wider text-muted-foreground">
                Học phí
              </h3>
              <p className="font-heading text-5xl lg:text-6xl font-light text-primary">
                4,700,000
              </p>
              <p className="text-muted-foreground">VNĐ</p>
              
              <Button variant="course" size="xl" className="w-full">
                Mua khóa học
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSketch;
