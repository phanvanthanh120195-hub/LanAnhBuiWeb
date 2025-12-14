const CourseContentIllustration = () => {
  const topics = [
    {
      number: "01",
      title: "Giới thiệu và hướng dẫn kĩ thuật màu nước cơ bản",
      image: "/placeholder.svg"
    },
    {
      number: "02",
      title: "Tả chất liệu Denim / Jeans",
      label: "DENIM/JEANS",
      image: "/placeholder.svg"
    },
    {
      number: "03",
      title: "Tả chất liệu Sheer / vải trong suốt",
      label: "SHEER",
      image: "/placeholder.svg"
    },
    {
      number: "04",
      title: "Tả chất liệu Fur / vải lông",
      label: "FUR",
      image: "/placeholder.svg"
    },
    {
      number: "05",
      title: "Tả chất liệu Velvet / vải nhung",
      label: "VELVET",
      image: "/placeholder.svg"
    },
    {
      number: "06",
      title: "Tả chất liệu Leather / Da bóng",
      label: "LEATHER",
      image: "/placeholder.svg"
    },
    {
      number: "07",
      title: "Tả chất liệu Lace / vải ren",
      label: "LACE",
      image: "/placeholder.svg"
    },
    {
      number: "08",
      title: "Tả chất liệu Sequin / Kim sa",
      label: "SEQUIN",
      image: "/placeholder.svg"
    },
    {
      number: "09",
      title: "Tả chất liệu Tweed",
      label: "TWEED",
      image: "/placeholder.svg"
    },
    {
      number: "10",
      title: "Bài tập cuối khóa",
      label: "FINAL",
      image: "/placeholder.svg"
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="section-title">Nội dung khóa học diễn họa thời trang</h2>
            <p className="section-subtitle mt-2 text-3xl">10 chủ đề:</p>
            <div className="section-divider !mx-0 !my-4" />
          </div>

          <div className="space-y-6">
            {topics.map((topic) => (
              <div
                key={topic.number}
                className="grid md:grid-cols-[1fr_200px] gap-6 items-center py-4 border-b border-border/30 hover:border-primary/30 transition-colors"
              >
                {/* Topic Title */}
                <div className="flex items-baseline gap-4">
                  <span className="number-badge flex-shrink-0 text-2xl">{topic.number}.</span>
                  <h3 className="font-heading text-2xl italic text-foreground/80">
                    {topic.title}
                  </h3>
                </div>

                {/* Topic Image */}
                <div className="aspect-[4/3] bg-secondary/30 rounded-sm overflow-hidden border border-border/30">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-full object-cover"
                  />
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
