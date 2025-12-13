const ForWhoSection = () => {
  const targets = [
    "Bạn muốn trở thành nhà thiết kế thời trang nổi tiếng",
    "Bạn muốn thành công trong lĩnh vực kinh doanh thời trang và họa cụ",
    "Bạn muốn kiếm tiền từ nghề minh họa tự do (freelance)",
    "Bạn quan tâm đến thời trang và nghệ thuật và muốn khám phá một sở thích mới",
    "Đơn giản bạn là fan của Kiquy :)",
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="section-title">Khóa học này dành cho ai?</h2>
              <div className="section-divider !mx-0 !my-4" />
            </div>

            <ul className="space-y-4">
              {targets.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fashion Illustration Grid */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="aspect-[2/3] bg-gradient-to-b from-background to-secondary rounded-sm border border-border/30 flex items-center justify-center overflow-hidden"
                >
                  <div className="text-center p-2">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-heading text-4xl text-primary/20 italic">♀</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Decorative */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForWhoSection;
