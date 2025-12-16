import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";

interface CourseContent {
  id?: string;
  number: string;
  title: string;
  items: string[];
  imageUrl: string;
  courseType: "sketch" | "illustration" | "ipad" | "designThinking" | "basicSewing";
}

const CourseContentSketch = () => {
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const { data } = await firestoreService.getAll("courseContent");
    if (data) {
      const filtered = (data as CourseContent[])
        .filter((c: any) => c.courseType === "sketch")
        .sort((a, b) => parseInt(a.number) - parseInt(b.number));
      setContents(filtered);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="section-title">Nội dung khóa học phác thảo thời trang</h2>
            <p className="section-subtitle mt-2">{contents.length} chủ đề:</p>
            <div className="section-divider !mx-0 !my-4" />
          </div>

          <div className="space-y-8">
            {contents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có nội dung nào.
              </p>
            ) : (
              contents.map((content) => (
                <div
                  key={content.id}
                  className="grid md:grid-cols-[300px_1fr] gap-6 items-start"
                >
                  {/* Image */}
                  {content.imageUrl ? (
                    <div className="aspect-[4/3] bg-background rounded-sm border border-border/30 overflow-hidden">
                      <img
                        src={content.imageUrl}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-background rounded-sm border border-border/30 flex items-center justify-center overflow-hidden">
                      <div className="text-center p-4">
                        <span className="font-heading text-4xl text-primary/20">✎</span>
                        <p className="mt-2 text-xs text-muted-foreground italic">Lesson Preview</p>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-4 border-b border-border/50 pb-2">
                      <span className="number-badge text-2xl">{content.number}.</span>
                      <h3 className="font-heading text-2xl italic text-primary">
                        {content.title}
                      </h3>
                    </div>
                    <ul className="space-y-1 ml-4">
                      {content.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground/70">
                          <span className="text-primary/50">•</span>
                          <span className="text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseContentSketch;
