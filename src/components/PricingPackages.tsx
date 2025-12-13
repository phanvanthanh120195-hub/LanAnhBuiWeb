import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingPackages = () => {
  const packages = [
    {
      title: "Phác Thảo Thời Trang: Định Hình Phong Cách Của Bạn",
      price: "4,700,000",
      features: ["Thích hợp cho người mới bắt đầu"],
      recommended: false,
    },
    {
      title: "Bản Vẽ Thời Trang Màu Nước: Sự Hoàn Hảo trong Từng Đường Nét",
      price: "6,500,000",
      features: [
        "Khóa nâng cao dành cho những ai đã biết vẽ phác thảo muốn tả chất liệu thời trang bằng màu nước",
        "Hoàn thiện bản vẽ thời trang từ phác thảo đến lên màu",
      ],
      recommended: false,
    },
    {
      title: "Vẽ Thời Trang Từ A đến Z: Hành Trình Khám Phá Tài Năng",
      price: "9,560,000",
      discount: "(tiết kiệm 15%)",
      features: [
        "Trọn gói khóa học vẽ thời trang từ cơ bản đến chuyên sâu",
        "Tiết kiệm 1,640,000 so với mua riêng từng khóa",
      ],
      recommended: true,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Chọn khóa học phù hợp với bạn</h2>
          <div className="section-divider" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-sm border p-8 flex flex-col ${
                pkg.recommended
                  ? "border-primary/50 shadow-[var(--shadow-soft)]"
                  : "border-border/50"
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

              <h3 className="font-heading text-lg text-center text-foreground mb-4 min-h-[56px]">
                {pkg.title}
              </h3>

              <div className="text-center mb-6">
                <p className="font-heading text-4xl font-light text-primary">
                  {pkg.price}
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
                className="w-full"
              >
                Mua khóa học
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPackages;
