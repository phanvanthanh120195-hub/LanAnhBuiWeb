import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { useCourse } from "@/contexts/CourseContext";

interface CourseTopic {
    id?: string;
    number: string;
    title: string;
    description?: string;
    image?: string;
    courseType: string;
}

interface CourseContent {
    id?: string;
    title: string;
    items: string[];
    imageUrl: string;
    courseType: string;
}

interface CourseTuition {
    id?: string;
    mode: "online" | "offline";
    originalPrice: number;
    discountPercent: number;
    imageUrl: string;
}

type CourseType = "illustration" | "sketch" | "ipad" | "designThinking" | "basicSewing";

const courseNames: Record<CourseType, string> = {
    illustration: "Diễn họa thời trang",
    sketch: "Phác thảo thời trang",
    ipad: "Diễn họa iPad",
    designThinking: "Tư duy thiết kế",
    basicSewing: "Cắt may cơ bản"
};

const CourseSkillsSection = () => {
    const { selectedCourse, setSelectedCourse } = useCourse();
    const [allTopics, setAllTopics] = useState<CourseTopic[]>([]);
    const [allContents, setAllContents] = useState<CourseContent[]>([]);
    const [allTuitions, setAllTuitions] = useState<CourseTuition[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMode, setSelectedMode] = useState<"online" | "offline">("online");

    useEffect(() => {
        loadAllCourseData();
    }, []);

    const loadAllCourseData = async () => {
        setLoading(true);

        // Load all topics
        const { data: topicsData } = await firestoreService.getAll("courses");
        if (topicsData) {
            setAllTopics(topicsData as CourseTopic[]);
        }

        // Load all course contents
        const { data: contentsData } = await firestoreService.getAll("courseContent");
        if (contentsData) {
            setAllContents(contentsData as CourseContent[]);
        }

        // Load all tuitions
        const { data: tuitionsData } = await firestoreService.getAll("tuition");
        if (tuitionsData) {
            setAllTuitions(tuitionsData as CourseTuition[]);
        }

        setLoading(false);
    };

    // Filter data by selected course
    const topics = allTopics
        .filter((t) => t.courseType === selectedCourse)
        .sort((a, b) => parseInt(a.number) - parseInt(b.number));

    const contents = allContents.filter((c: any) => c.courseType === selectedCourse);
    const tuitions = allTuitions.filter((t: any) =>
        t.courseType === selectedCourse && t.mode === selectedMode
    );

    const calculateDiscountedPrice = (original: number, discount: number) => {
        return (original * (1 - discount / 100)).toLocaleString("vi-VN");
    };

    return (
        <section id="courses" className="pt-20 lg:pt-28 bg-background">
            <div className="container mx-auto px-4">
                {/* Title */}
                <div className="text-center mb-16">
                    <h2 className="section-title">Khóa học</h2>
                    <div className="section-divider" />
                </div>

                {/* Course Type Tabs */}
                <div className="flex flex-wrap justify-center gap-4">
                    {(Object.keys(courseNames) as CourseType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedCourse(type)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCourse === type
                                ? "bg-primary text-primary-foreground shadow-lg border border-primary"
                                : "bg-card text-foreground hover:bg-secondary border border-border"
                                }`}
                        >
                            {courseNames[type]}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CourseSkillsSection;
