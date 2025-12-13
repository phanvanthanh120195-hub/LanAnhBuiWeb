const InstructorSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="section-title">Xin chào!</h2>
            <div className="section-divider !mx-0 !my-4" />

            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                Chào bạn, mình là <span className="text-primary font-medium">Kiquy Pham</span>, hiện đang là họa sĩ về <span className="text-primary">thiết kế & diễn họa thời trang</span>. Kiquy cũng đã từng có kinh nghiệm là giảng viên bộ môn Vẽ phác thảo và Diễn họa thuộc khoa Thiết kế thời trang Đại học Hoa Sen - Tp. Hồ Chí Minh.
              </p>
              <p>
                Kiquy đã có hơn 10 năm kinh nghiệm học tập và làm việc trong lĩnh vực thời trang với những nhãn hàng và nhà thiết kế trong và ngoài nước như <span className="text-primary">Prada, Viktor&Rolf, Mỗi Điền</span>...
              </p>
              <p>
                Nếu bạn đam mê về thời trang hay định hướng theo học ngành thiết kế thời trang, Kiquy mong muốn truyền đạt lại những kiến thức và kinh nghiệm qua các khóa học vẽ để giúp bạn đạt được ước mơ của mình.
              </p>
            </div>
          </div>

          {/* Photo */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto rounded-sm overflow-hidden border border-border/30 bg-gradient-to-b from-secondary/50 to-cream">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-heading text-5xl text-primary/40 italic">K</span>
                  </div>
                  <p className="mt-4 font-heading text-lg italic text-muted-foreground">Kiquy Pham</p>
                  <p className="text-sm text-muted-foreground">Fashion Illustrator</p>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gold/10 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
