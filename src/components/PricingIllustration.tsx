import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import CourseModal from "@/components/CourseModal";
import { useCourse } from "@/contexts/CourseContext";
import { firestoreService } from "@/services/firestoreService";

interface Tuition {
  id?: string;
  mode: "online" | "offline";
  title?: string;
  contentList?: string[];
  description?: string;
  originalPrice: number;
  discountPercent: number;
  imageUrl?: string;
  courseType?: string;
}

const PricingIllustration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"online" | "offline">("online");
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCourse } = useCourse();

  useEffect(() => {
    loadTuitions();
  }, [selectedCourse]);

  // Auto-select first available mode when tuitions load
  useEffect(() => {
    if (tuitions.length > 0) {
      const hasOnline = tuitions.some((t) => t.mode === "online");
      const hasOffline = tuitions.some((t) => t.mode === "offline");

      // If current mode is not available, switch to available one
      if (selectedMode === "online" && !hasOnline && hasOffline) {
        setSelectedMode("offline");
      } else if (selectedMode === "offline" && !hasOffline && hasOnline) {
        setSelectedMode("online");
      }
    }
  }, [tuitions]);

  const loadTuitions = async () => {
    setLoading(true);
    try {
      const { data } = await firestoreService.getAll("tuition");
      if (data) {
        // Filter by selected course
        const filtered = (data as Tuition[]).filter(
          (t) => t.courseType === selectedCourse
        );
        setTuitions(filtered);
      }
    } catch (error) {
      console.error("Error loading tuitions:", error);
    }
    setLoading(false);
  };

  // Get current tuition based on selected mode
  const currentTuition = tuitions.find((t) => t.mode === selectedMode);

  const calculateDiscountedPrice = (price: number, discount: number) => {
    const discounted = price * (1 - discount / 100);
    return discounted.toLocaleString("en-US").replace(/\./g, ",");
  };

  const courseData = {
    title: currentTuition?.title || "Bản Vẽ Thời Trang Màu Nước: Sự Hoàn Hảo trong Từng Đường Nét",
    price: currentTuition
      ? calculateDiscountedPrice(
        currentTuition.originalPrice,
        currentTuition.discountPercent
      )
      : "6,500,000",
    features: currentTuition?.contentList || [
      "Khóa nâng cao dành cho những ai đã biết vẽ phác thảo muốn tả chất liệu thời trang bằng màu nước",
      "Hoàn thiện bản vẽ thời trang từ phác thảo đến lên màu",
    ],
    description: currentTuition?.description ||
      "Nâng cao kỹ năng vẽ thời trang của bạn với kỹ thuật màu nước chuyên nghiệp. Học cách tạo hiệu ứng chất liệu, ánh sáng và bóng đổ để tác phẩm của bạn trở nên sống động và chuyên nghiệp hơn.",
  };

  if (loading) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Online/Offline Toggle Tabs - Outside Card */}
          <div className="flex justify-center gap-0 mb-12">
            <button
              onClick={() => setSelectedMode("online")}
              className={`px-8 py-3 font-medium transition-all duration-300 border ${selectedMode === "online"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-secondary"
                }`}
            >
              Online
            </button>
            <button
              onClick={() => setSelectedMode("offline")}
              className={`px-8 py-3 font-medium transition-all duration-300 border border-l-0 ${selectedMode === "offline"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-secondary"
                }`}
            >
              Offline
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Pricing Card */}
            <div className="bg-card rounded-sm border border-border/50 p-8 lg:p-12 shadow-[var(--shadow-soft)] order-2 lg:order-1">
              <div className="text-center space-y-6">
                <h3 className="font-heading text-xl uppercase tracking-wider text-muted-foreground font-bold">
                  Học phí
                </h3>

                {currentTuition ? (
                  <>
                    {currentTuition.discountPercent > 0 && (
                      <div className="space-y-2">
                        <p className="line-through text-muted-foreground text-xl">
                          {currentTuition.originalPrice.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                          -{currentTuition.discountPercent}%
                        </span>
                      </div>
                    )}
                    <p className="font-heading text-5xl lg:text-6xl font-light text-primary">
                      {calculateDiscountedPrice(
                        currentTuition.originalPrice,
                        currentTuition.discountPercent
                      )}
                    </p>
                  </>
                ) : (
                  <p className="font-heading text-5xl lg:text-6xl font-light text-primary">
                    6,500,000
                  </p>
                )}
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
                {currentTuition?.imageUrl ? (
                  <img
                    src={currentTuition.imageUrl}
                    alt="Course pricing"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-40 h-56 mx-auto border border-primary/20 rounded-sm bg-background/30 flex items-center justify-center">
                      <span className="font-heading text-7xl text-primary/25 italic">✿</span>
                    </div>
                    <p className="mt-4 font-heading text-sm italic text-muted-foreground">
                      Watercolor Fashion
                    </p>
                  </div>
                )}
              </div>
              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/10 rounded-full blur-xl" />
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

export default PricingIllustration;
