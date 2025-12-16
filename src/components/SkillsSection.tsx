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

interface Skill {
  id?: string;
  number: string;
  title: string;
  courseType: string;
  description?: string;
  image?: string;
  lessons?: any;
}

const SkillsSection = () => {
  const { selectedCourse } = useCourse();
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const { data } = await firestoreService.getAll("courses");
      console.log("All skills data:", data);
      console.log("Selected course:", selectedCourse);
      if (data) {
        setAllSkills(data as Skill[]);
        console.log("Skills set to state:", data);
      }
    } catch (error) {
      console.error("Error loading skills:", error);
    }
    setLoading(false);
  };

  // Filter skills based on selected course
  const filteredSkills = allSkills
    .filter(skill => skill.courseType === selectedCourse)
    .sort((a, b) => parseInt(a.number) - parseInt(b.number)); // Sort by number field

  console.log("Filtered skills:", filteredSkills);
  console.log("All skills count:", allSkills.length);
  console.log("Filtered skills count:", filteredSkills.length);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="section-title">Kỹ năng bạn có được từ khóa học {courseNames[selectedCourse as CourseType]}</h2>
          <div className="section-divider" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
          {filteredSkills.map((skill) => (
            <div key={skill.id || skill.number} className="skill-card p-6 bg-card rounded-sm border border-border/30 hover:border-primary/30 transition-all duration-300">
              <div className="space-y-3">
                <span className="number-badge text-2xl">{skill.number.padStart(2, '0')}.</span>
                <h3 className="font-heading text-2xl font-medium text-foreground h-[64px] line-clamp-2">{skill.title}</h3>
                {skill.description && (
                  <p className="text-base text-muted-foreground italic">{skill.description}</p>
                )}
              </div>

              {/* Skill illustration */}
              <div className="mt-6 aspect-square bg-gradient-to-b from-secondary/50 to-cream rounded-sm flex items-center justify-center overflow-hidden">
                {skill.image ? (
                  <img
                    src={skill.image}
                    alt={skill.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-2/3 h-2/3 border border-primary/10 rounded-sm flex items-center justify-center">
                    <span className="font-heading text-3xl text-primary/20">✎</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
