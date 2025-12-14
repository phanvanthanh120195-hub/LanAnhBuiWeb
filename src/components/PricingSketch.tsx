import { Button } from "@/components/ui/button";
import { useState } from "react";
import CourseModal from "@/components/CourseModal";

const PricingSketch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const courseData = {
    title: "Phác Thảo Thời Trang: Định Hình Phong Cách Của Bạn",
    price: "4,700,000",
    features: ["Thích hợp cho người mới bắt đầu"],
    description: "Khóa học này sẽ giúp bạn nắm vững các kỹ thuật phác thảo thời trang cơ bản, từ việc vẽ hình người đến cách thể hiện các chi tiết trang phục. Phù hợp cho người mới bắt đầu muốn khám phá đam mê thiết kế thời trang.",
  };

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
              <h3 className="font-heading text-xl uppercase tracking-wider text-muted-foreground font-bold">
                Học phí
              </h3>
              <p className="font-heading text-5xl lg:text-6xl font-light text-primary">
                4,700,000
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

export default PricingSketch;
