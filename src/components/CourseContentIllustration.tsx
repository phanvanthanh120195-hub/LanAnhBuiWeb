import { useState, useEffect } from "react";
import { useCourse } from "@/contexts/CourseContext";
import { firestoreService } from "@/services/firestoreService";

type CourseType = "illustration" | "sketch" | "ipad" | "designThinking" | "basicSewing";

const courseNames: Record<CourseType, string> = {
  illustration: "diễn họa thời trang",
  sketch: "phác thảo thời trang",
  ipad: "diễn họa iPad",
  designThinking: "tư duy thiết kế",
  basicSewing: "cắt may cơ bản"
};

interface CourseContent {
  id?: string;
  courseType: string;
  items: string[];
  imageUrl?: string;
}

const CourseContentIllustration = () => {
  const { selectedCourse } = useCourse();
  const [allContent, setAllContent] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const { data } = await firestoreService.getAll("courseContent");
      console.log("Course content data:", data);
      if (data) {
        setAllContent(data as CourseContent[]);
      }
    } catch (error) {
      console.error("Error loading course content:", error);
    }
    setLoading(false);
  };

  // Filter content based on selected course
  const filteredContent = allContent.filter(
    content => content.courseType === selectedCourse
  );

  const courseName = courseNames[selectedCourse as CourseType] || selectedCourse;

  if (loading || filteredContent.length === 0) {
    return null;
  }

  // Get items from filtered content
  const topics = filteredContent[0]?.items || [];
  const imageUrl = filteredContent[0]?.imageUrl;

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12" data-aos="fade-up">
            <h2 className="section-title">Nội dung khóa học {courseName}</h2>
            <p className="section-subtitle mt-2 text-3xl">{topics.length} chủ đề:</p>
            <div className="section-divider !mx-0 !my-4" />
          </div>

          <div className="space-y-6" data-aos="fade-up">
            {topics.map((item, index) => (
              <div
                key={index}
                className="grid md:grid-cols-[1fr_200px] gap-6 items-center py-4 border-b border-border/30 hover:border-primary/30 transition-colors"
              >
                {/* Topic Title */}
                <div className="flex items-baseline gap-4">
                  <span className="number-badge flex-shrink-0 text-2xl">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <h3 className="font-heading text-2xl italic text-foreground/80">
                    {item}
                  </h3>
                </div>

                {/* Topic Image */}
                <div className="aspect-[4/3] bg-secondary/30 rounded-sm overflow-hidden border border-border/30">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-heading text-4xl text-primary/20">✎</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseContentIllustration;
