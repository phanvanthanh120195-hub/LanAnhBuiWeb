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

const PricingSketch = () => {
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
        // Filter by sketch course
        const filtered = (data as Tuition[]).filter(
          (t) => t.courseType === "sketch"
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
    title: currentTuition?.title || "Phác Thảo Thời Trang: Định Hình Phong Cách Của Bạn",
    price: currentTuition
      ? calculateDiscountedPrice(
        currentTuition.originalPrice,
        currentTuition.discountPercent
      )
      : "4,700,000",
    features: currentTuition?.contentList || ["Thích hợp cho người mới bắt đầu"],
    description: currentTuition?.description ||
      "Khóa học này sẽ giúp bạn nắm vững các kỹ thuật phác thảo thời trang cơ bản, từ việc vẽ hình người đến cách thể hiện các chi tiết trang phục. Phù hợp cho người mới bắt đầu muốn khám phá đam mê thiết kế thời trang.",
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
            {/* Illustration */}
            <div className="relative order-1 lg:order-1">
              <div className="aspect-[3/4] max-w-sm mx-auto bg-gradient-to-b from-background to-cream rounded-sm flex items-center justify-center border border-border/20 overflow-hidden">
                {currentTuition?.imageUrl ? (
                  <img
                    src={currentTuition.imageUrl}
                    alt="Course pricing"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-32 h-44 mx-auto border border-primary/20 rounded-sm bg-background/50 flex items-center justify-center">
                      <span className="font-heading text-6xl text-primary/30 italic">✿</span>
                    </div>
                    <p className="mt-4 font-heading text-sm italic text-muted-foreground">Fashion Sketch</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-card rounded-sm border border-border/50 p-8 lg:p-12 shadow-[var(--shadow-soft)] order-2 lg:order-2">
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
                    4,700,000
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
