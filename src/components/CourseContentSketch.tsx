const CourseContentSketch = () => {
  const topics = [
    {
      number: "01",
      title: "Dáng người cơ bản trong thời trang",
      lessons: [
        "Tìm hiểu về trục và tỉ lệ cơ thể người",
        "Dáng đứng chính diện (mặt trước)",
        "Vẽ dáng người góc nhìn phía sau",
        "Vẽ dáng người góc nhìn nghiêng 1/2",
      ],
    },
    {
      number: "02",
      title: "Các dáng đứng thời trang",
      lessons: [
        "Dáng đứng góc 3/4",
        "Dáng catwalk",
        "Dáng đứng thời trang 1 (pose 1)",
        "Dáng đứng thời trang 2 (pose 2)",
      ],
    },
    {
      number: "03",
      title: "Tay & Chân",
      lessons: ["Bàn tay", "Cánh tay", "Bàn chân", "Đôi chân"],
    },
    {
      number: "04",
      title: "Khuôn mặt cơ bản & tóc",
      lessons: [
        "Tỉ lệ khuôn mặt (góc chính diện)",
        "Khuôn mặt nhỏ",
        "Những kiểu tóc cơ bản",
      ],
    },
    {
      number: "05",
      title: "Khuôn mặt góc nhìn nghiêng",
      lessons: [
        "Lý thuyết về khối trục mặt",
        "Khuôn mặt góc nghiêng 1/2",
        "Khuôn mặt góc nghiêng 3/4",
      ],
    },
    {
      number: "06",
      title: "Vẽ trang phục",
      lessons: ["Vẽ trang phục 1", "Vẽ trang phục 2", "Vẽ trang phục 3"],
    },
    {
      number: "07",
      title: "Vẽ thời trang theo cách của bạn",
      lessons: [
        "Tìm ý tưởng",
        "Vẽ phác thảo",
        "Vẽ trang phục",
        "Hoàn thiện bản vẽ",
        "Kết",
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="section-title">Nội dung khóa học phác thảo thời trang</h2>
            <p className="section-subtitle mt-2">7 chủ đề với 24 bài học:</p>
            <div className="section-divider !mx-0 !my-4" />
          </div>

          <div className="space-y-8">
            {topics.map((topic) => (
              <div
                key={topic.number}
                className="grid md:grid-cols-[200px_1fr] gap-6 items-start"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-background rounded-sm border border-border/30 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-4">
                    <span className="font-heading text-4xl text-primary/20">✎</span>
                    <p className="mt-2 text-xs text-muted-foreground italic">Lesson Preview</p>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-4 border-b border-border/50 pb-2">
                    <span className="number-badge">{topic.number}.</span>
                    <h3 className="font-heading text-xl italic text-primary">
                      {topic.title}
                    </h3>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {topic.lessons.map((lesson, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground/70">
                        <span className="text-primary/50">•</span>
                        <span className="text-sm">{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseContentSketch;
