const SkillsSection = () => {
  const skills = [
    { number: "01", title: "Thành thạo vẽ tỉ lệ cơ thể người", course: "Khóa phác thảo thời trang" },
    { number: "02", title: "Thành thạo các tư thế thời trang khác nhau", course: "Khóa phác thảo thời trang" },
    { number: "03", title: "Thành thạo vẽ gương mặt", course: "Khóa phác thảo thời trang" },
    { number: "04", title: "Thành thạo vẽ tóc", course: "Khóa phác thảo thời trang" },
    { number: "05", title: "Thành thạo vẽ tay/chân", course: "Khóa phác thảo thời trang" },
    { number: "06", title: "Phác họa trang phục bằng bút chì + mỡ tả nếp gấp vải", course: "Khóa phác thảo thời trang" },
    { number: "07", title: "Biết vẽ màu nước cơ bản", course: "Khóa diễn họa thời trang" },
    { number: "08", title: "Tả chất liệu denim/jeans", course: "Khóa diễn họa thời trang" },
    { number: "09", title: "Tả chất liệu sheer/vải trong suốt", course: "Khóa diễn họa thời trang" },
    { number: "10", title: "Tả chất liệu fur/vải lông", course: "Khóa diễn họa thời trang" },
    { number: "11", title: "Tả chất liệu velvet/vải nhung", course: "Khóa diễn họa thời trang" },
    { number: "12", title: "Tả chất liệu leather/da bóng", course: "Khóa diễn họa thời trang" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Kỹ năng bạn có được từ khóa học</h2>
          <div className="section-divider" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill) => (
            <div key={skill.number} className="skill-card p-6 bg-card rounded-sm border border-border/30 hover:border-primary/30 transition-all duration-300">
              <div className="space-y-3">
                <span className="number-badge">{skill.number}.</span>
                <h3 className="font-heading text-lg font-medium text-foreground">{skill.title}</h3>
                <p className="text-sm text-muted-foreground italic">({skill.course})</p>
              </div>
              
              {/* Skill illustration placeholder */}
              <div className="mt-6 aspect-square bg-gradient-to-b from-secondary/50 to-cream rounded-sm flex items-center justify-center">
                <div className="w-2/3 h-2/3 border border-primary/10 rounded-sm flex items-center justify-center">
                  <span className="font-heading text-3xl text-primary/20">✎</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
