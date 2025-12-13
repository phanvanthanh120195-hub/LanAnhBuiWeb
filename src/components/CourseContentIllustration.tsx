const CourseContentIllustration = () => {
  const topics = [
    { number: "01", title: "Giới thiệu và hướng dẫn kĩ thuật màu nước cơ bản" },
    { number: "02", title: "Tả chất liệu Denim / Jeans", label: "DENIM/JEANS" },
    { number: "03", title: "Tả chất liệu Sheer / vải trong suốt", label: "SHEER" },
    { number: "04", title: "Tả chất liệu Fur / vải lông", label: "FUR" },
    { number: "05", title: "Tả chất liệu Velvet / vải nhung", label: "VELVET" },
    { number: "06", title: "Tả chất liệu Leather / Da bóng", label: "LEATHER" },
    { number: "07", title: "Tả chất liệu Lace / vải ren", label: "LACE" },
    { number: "08", title: "Tả chất liệu Sequin / Kim sa", label: "SEQUIN" },
    { number: "09", title: "Tả chất liệu Tweed", label: "TWEED" },
    { number: "10", title: "Bài tập cuối khóa", label: "FINAL" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="section-title">Nội dung khóa học diễn họa thời trang</h2>
            <p className="section-subtitle mt-2">10 chủ đề:</p>
            <div className="section-divider lg:!mx-0 !my-4" />
          </div>

          <div className="grid lg:grid-cols-2 gap-x-16 gap-y-4">
            {/* Topics List */}
            <div className="space-y-4">
              {topics.map((topic) => (
                <div
                  key={topic.number}
                  className="flex items-baseline gap-4 py-3 border-b border-border/30 hover:border-primary/30 transition-colors"
                >
                  <span className="number-badge">{topic.number}.</span>
                  <h3 className="font-heading text-lg italic text-foreground/80">
                    {topic.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Illustration Placeholders */}
            <div className="grid grid-cols-2 gap-4 h-fit">
              {topics.slice(1, 9).map((topic) => (
                <div
                  key={topic.number}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-sm"
                >
                  <div className="w-12 h-16 bg-gradient-to-b from-background to-cream rounded-sm flex items-center justify-center border border-border/30">
                    <span className="font-heading text-lg text-primary/30">♀</span>
                  </div>
                  <span className="text-xs font-heading uppercase tracking-wider text-muted-foreground">
                    {topic.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseContentIllustration;
