import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import CourseModal from "@/components/CourseModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PricingPackages = () => {
  const [selectedMode, setSelectedMode] = useState<"online" | "offline">("online");
  const [selectedCourse, setSelectedCourse] = useState<{
    title: string;
    price: string;
    discount?: string;
    features: string[];
    description?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const packages = [
    {
      title: "Phác Thảo Thời Trang: Định Hình Phong Cách Của Bạn",
      onlinePrice: "4,700,000",
      offlinePrice: "5,200,000",
      features: ["Thích hợp cho người mới bắt đầu"],
      description: "Khóa học này sẽ giúp bạn nắm vững các kỹ thuật phác thảo thời trang cơ bản, từ việc vẽ hình người đến cách thể hiện các chi tiết trang phục. Phù hợp cho người mới bắt đầu muốn khám phá đam mê thiết kế thời trang.",
      recommended: false,
    },
    {
      title: "Vẽ Thời Trang Từ A đến Z: Hành Trình Khám Phá Tài Năng",
      onlinePrice: "9,560,000",
      offlinePrice: "10,500,000",
      discount: "(tiết kiệm 15%)",
      features: [
        "Trọn gói khóa học vẽ thời trang từ cơ bản đến chuyên sâu",
        "Tiết kiệm 1,640,000 so với mua riêng từng khóa",
      ],
      description: "Gói khóa học toàn diện từ cơ bản đến nâng cao, bao gồm cả phác thảo và kỹ thuật màu nước. Đây là lựa chọn tối ưu cho những ai muốn trở thành họa sĩ thời trang chuyên nghiệp với mức giá ưu đãi nhất.",
      recommended: true,
    },
    {
      title: "Bản Vẽ Thời Trang Màu Nước: Sự Hoàn Hảo trong Từng Đường Nét",
      onlinePrice: "6,500,000",
      offlinePrice: "7,000,000",
      features: [
        "Khóa nâng cao dành cho những ai đã biết vẽ phác thảo muốn tả chất liệu thời trang bằng màu nước",
        "Hoàn thiện bản vẽ thời trang từ phác thảo đến lên màu",
      ],
      description: "Nâng cao kỹ năng vẽ thời trang của bạn với kỹ thuật màu nước chuyên nghiệp. Học cách tạo hiệu ứng chất liệu, ánh sáng và bóng đổ để tác phẩm của bạn trở nên sống động và chuyên nghiệp hơn.",
      recommended: false,
    },
    {
      title: "Diễn Họa iPad: Nghệ Thuật Số Hiện Đại",
      onlinePrice: "5,800,000",
      offlinePrice: "6,300,000",
      features: [
        "Học vẽ thời trang trên iPad với Procreate",
        "Kỹ thuật digital illustration chuyên nghiệp",
      ],
      description: "Khám phá thế giới diễn họa thời trang số với iPad và Procreate. Học cách tạo ra những bản vẽ thời trang chuyên nghiệp với công nghệ hiện đại, phù hợp cho thời đại 4.0.",
      recommended: false,
    },
    {
      title: "Tư Duy Thiết Kế: Sáng Tạo Không Giới Hạn",
      onlinePrice: "4,200,000",
      offlinePrice: "4,700,000",
      features: [
        "Phát triển tư duy sáng tạo trong thiết kế thời trang",
        "Xây dựng phong cách riêng biệt",
      ],
      description: "Khóa học giúp bạn phát triển tư duy thiết kế, từ việc tìm kiếm cảm hứng đến việc xây dựng concept collection. Phù hợp cho những ai muốn trở thành nhà thiết kế thời trang.",
      recommended: false,
    },
  ];

  const handleOpenModal = (pkg: typeof packages[0]) => {
    const price = selectedMode === "online" ? pkg.onlinePrice : pkg.offlinePrice;
    setSelectedCourse({
      title: pkg.title,
      price: price,
      discount: pkg.discount,
      features: pkg.features,
      description: pkg.description,
    });
    setIsModalOpen(true);
  };

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

        {/* Carousel */}
        <div className="max-w-7xl mx-auto px-12">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {packages.map((pkg, index) => {
                const currentPrice = selectedMode === "online" ? pkg.onlinePrice : pkg.offlinePrice;

                return (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 pt-4">
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

                      {/* Illustration placeholder */}
                      <div className="aspect-[4/3] mb-6 bg-gradient-to-b from-secondary/50 to-cream rounded-sm flex items-center justify-center">
                        <span className="font-heading text-5xl text-primary/20 italic">✿</span>
                      </div>

                      <h3 className="font-heading text-xl text-center text-foreground mb-4 min-h-[56px] font-bold">
                        {pkg.title}
                      </h3>

                      <div className="text-center mb-6">
                        <p className="font-heading text-4xl font-light text-primary">
                          {currentPrice}
                        </p>
                        {pkg.discount && (
                          <p className="text-sm text-accent font-medium mt-1">{pkg.discount}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">VNĐ</p>
                      </div>

                      <ul className="space-y-3 mb-8 flex-grow">
                        {pkg.features.map((feature, idx) => (
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
                        onClick={() => handleOpenModal(pkg)}
                      >
                        MUA KHÓA HỌC
                      </Button>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
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

export default PricingPackages;
