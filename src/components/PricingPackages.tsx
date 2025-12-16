import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import CourseModal from "@/components/CourseModal";
import { firestoreService } from "@/services/firestoreService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TuitionPackage {
  id?: string;
  title: string;
  courseType: string;
  mode: "online" | "offline";
  originalPrice: number;
  discountPercent: number;
  contentList?: string[];
  description?: string;
  recommended?: boolean;
  imageUrl?: string;
}

const PricingPackages = () => {
  const [selectedMode, setSelectedMode] = useState<"online" | "offline">("online");
  const [packages, setPackages] = useState<TuitionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<{
    title: string;
    price: string;
    discount?: string;
    features: string[];
    description?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const { data } = await firestoreService.getAll("tuition");
      console.log("Tuition packages from Firestore:", data);
      if (data && data.length > 0) {
        setPackages(data as TuitionPackage[]);
      }
    } catch (error) {
      console.error("Error loading tuition packages:", error);
    }
    setLoading(false);
  };

  // Filter packages by selected mode
  const filteredPackages = packages.filter(pkg => pkg.mode === selectedMode);

  // Determine if we should show carousel navigation
  const showCarouselNav = filteredPackages.length > 3;

  const calculateDiscountedPrice = (price: number, discount: number) => {
    const discounted = price * (1 - discount / 100);
    return discounted.toLocaleString("en-US").replace(/\./g, ",");
  };



  const handleOpenModal = (pkg: TuitionPackage) => {
    const price = calculateDiscountedPrice(pkg.originalPrice, pkg.discountPercent);
    setSelectedCourse({
      title: pkg.title,
      price: price,
      discount: pkg.discountPercent > 0 ? `(tiết kiệm ${pkg.discountPercent}%)` : undefined,
      features: pkg.contentList || [],
      description: pkg.description,
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return null;
  }

  // Hide pricing section if no packages exist
  if (packages.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Chọn khóa học phù hợp với bạn</h2>
          <div className="section-divider" />
        </div>

        {/* Online/Offline Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setSelectedMode("online")}
              className={`px-8 py-3 font-medium transition-all duration-300 ${selectedMode === "online"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-secondary"
                }`}
            >
              Online
            </button>
            <button
              onClick={() => setSelectedMode("offline")}
              className={`px-8 py-3 font-medium transition-all duration-300 border-l border-border ${selectedMode === "offline"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-secondary"
                }`}
            >
              Offline
            </button>
          </div>
        </div>

        {/* Packages Display */}
        <div className="max-w-7xl mx-auto px-12">
          {showCarouselNav ? (
            // Show Carousel with navigation if more than 3 packages
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {filteredPackages.map((pkg, index) => (
                  <CarouselItem key={pkg.id || index} className="pl-4 md:basis-1/2 lg:basis-1/3 pt-4">
                    <PackageCard
                      pkg={pkg}
                      onOpenModal={handleOpenModal}
                      calculatePrice={calculateDiscountedPrice}

                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            // Show static grid if 3 or fewer packages
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg, index) => (
                <div key={pkg.id || index} className="pt-4">
                  <PackageCard
                    pkg={pkg}
                    onOpenModal={handleOpenModal}
                    calculatePrice={calculateDiscountedPrice}

                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
      />
    </section>
  );
};

// Extracted PackageCard component for reusability
const PackageCard = ({
  pkg,
  onOpenModal,
  calculatePrice,
}: {
  pkg: TuitionPackage;
  onOpenModal: (pkg: TuitionPackage) => void;
  calculatePrice: (price: number, discount: number) => string;
}) => {
  return (
    <div
      className={`relative bg-card rounded-sm border-2 p-8 flex flex-col transition-all duration-300 h-full ${pkg.recommended
        ? "border-primary shadow-[var(--shadow-soft)]"
        : "border-border/30 hover:border-primary/50"
        }`}
    >
      {pkg.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs uppercase tracking-wider font-heading">
          Phổ biến nhất
        </div>
      )}

      {/* Illustration */}
      <div className="aspect-[4/3] mb-6 bg-gradient-to-b from-secondary/50 to-cream rounded-sm flex items-center justify-center overflow-hidden">
        {pkg.imageUrl ? (
          <img src={pkg.imageUrl} alt={pkg.title || ""} className="w-full h-full object-cover" />
        ) : (
          <span className="font-heading text-5xl text-primary/20 italic">✿</span>
        )}
      </div>

      <h3 className="font-heading text-xl text-center text-foreground mb-4 min-h-[56px] font-bold">
        {pkg.title || ""}
      </h3>

      <div className="text-center mb-6">
        {pkg.discountPercent > 0 && (
          <p className="line-through text-muted-foreground text-lg mb-1">
            {pkg.originalPrice.toLocaleString("en-US").replace(/\./g, ",")} VNĐ
          </p>
        )}
        <p className="font-heading text-4xl font-light text-primary">
          {calculatePrice(pkg.originalPrice, pkg.discountPercent)}
        </p>
        {pkg.discountPercent > 0 && (
          <p className="text-sm text-accent font-medium mt-1">
            (tiết kiệm {pkg.discountPercent}%)
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">VNĐ</p>
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {pkg.contentList && pkg.contentList.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-foreground/70">
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={pkg.recommended ? "elegant" : "course"}
        size="lg"
        className="w-full font-[family-name:var(--font-button)] tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        onClick={() => onOpenModal(pkg)}
      >
        MUA KHÓA HỌC
      </Button>
    </div>
  );
};

export default PricingPackages;
