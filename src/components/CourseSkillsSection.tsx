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
    const tuitions = allTuitions.filter((t: any) => t.courseType === selectedCourse);

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

                {loading ? (
                    <div className="space-y-16">
                        {/* Show empty state while loading initially */}
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Content Section */}
                        {contents.length > 0 && (
                            <div>
                                <h3 className="font-heading text-3xl font-medium text-center mb-8 text-foreground">
                                    Nội dung
                                </h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {contents.map((content) => (
                                        <div
                                            key={content.id}
                                            className="bg-card rounded-sm border border-border/30 p-8 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
                                        >
                                            <h4 className="font-heading text-2xl font-medium mb-6 text-foreground">
                                                {content.title}
                                            </h4>
                                            <ul className="space-y-3 mb-6">
                                                {content.items.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <span className="text-primary mt-1">✓</span>
                                                        <span className="text-foreground">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {content.imageUrl && (
                                                <img
                                                    src={content.imageUrl}
                                                    alt={content.title}
                                                    className="w-full rounded-lg"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tuition Section */}
                        {tuitions.length > 0 && (
                            <div>
                                <h3 className="font-heading text-3xl font-medium text-center mb-8 text-foreground">
                                    Học phí
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {tuitions.map((tuition) => (
                                        <div
                                            key={tuition.id}
                                            className="bg-gradient-to-br from-primary to-primary/80 rounded-sm shadow-lg p-8 text-primary-foreground hover:shadow-xl transition-shadow duration-300"
                                        >
                                            <div className="text-center mb-6">
                                                <span className="inline-block bg-white text-pink-600 px-4 py-2 rounded-full font-bold text-sm mb-4">
                                                    {tuition.mode === "online" ? "Online" : "Offline"}
                                                </span>
                                                {tuition.imageUrl && (
                                                    <img
                                                        src={tuition.imageUrl}
                                                        alt="Tuition"
                                                        className="w-full rounded-lg mb-4"
                                                    />
                                                )}
                                            </div>
                                            <div className="text-center">
                                                {tuition.discountPercent > 0 && (
                                                    <div className="mb-2">
                                                        <span className="line-through text-pink-200 text-lg">
                                                            {tuition.originalPrice.toLocaleString("vi-VN")} VNĐ
                                                        </span>
                                                        <span className="ml-2 bg-yellow-400 text-pink-900 px-2 py-1 rounded text-sm font-bold">
                                                            -{tuition.discountPercent}%
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-4xl font-bold">
                                                    {tuition.discountPercent > 0
                                                        ? calculateDiscountedPrice(
                                                            tuition.originalPrice,
                                                            tuition.discountPercent
                                                        )
                                                        : tuition.originalPrice.toLocaleString("vi-VN")}{" "}
                                                    VNĐ
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CourseSkillsSection;
