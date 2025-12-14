import { Button } from "@/components/ui/button";
import { useState } from "react";
import CourseModal from "@/components/CourseModal";

const PricingIllustration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const courseData = {
    title: "Bản Vẽ Thời Trang Màu Nước: Sự Hoàn Hảo trong Từng Đường Nét",
    price: "6,500,000",
    features: [
      "Khóa nâng cao dành cho những ai đã biết vẽ phác thảo muốn tả chất liệu thời trang bằng màu nước",
      "Hoàn thiện bản vẽ thời trang từ phác thảo đến lên màu",
    ],
    description: "Nâng cao kỹ năng vẽ thời trang của bạn với kỹ thuật màu nước chuyên nghiệp. Học cách tạo hiệu ứng chất liệu, ánh sáng và bóng đổ để tác phẩm của bạn trở nên sống động và chuyên nghiệp hơn.",
  };
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Pricing Card */}
          <div className="bg-card rounded-sm border border-border/50 p-8 lg:p-12 shadow-[var(--shadow-soft)] order-2 lg:order-1">
            <div className="text-center space-y-6">
              <h3 className="font-heading text-xl uppercase tracking-wider text-muted-foreground font-bold">
                Học phí
              </h3>
              <p className="font-heading text-5xl lg:text-6xl font-light text-primary">
                6,500,000
              </p>
              <p className="text-muted-foreground">VNĐ</p>

              <Button
                variant="course"
                size="xl"
                className="w-full font-[family-name:var(--font-button)] tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                onClick={() => setIsModalOpen(true)}
              >
                MUA KHÓA HỌC
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

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={courseData}
      />
    </section>
  );
};

export default PricingIllustration;
