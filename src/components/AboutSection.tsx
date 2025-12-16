import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";

interface IntroductionData {
    id?: string;
    title: string;
    description: string;
    imageUrl?: string;
}

const defaultData: IntroductionData = {
    title: "Xin chào",
    description: 'Nếu mơ ước của bạn là trở thành nhà thiết kế thời trang nổi tiếng hay thành công với việc kinh doanh thời trang, thì bạn đã đến đúng nơi rồi. Khóa học của Kiquy là nơi giúp bạn tiếp cận với lĩnh vực về thiết kế thời trang. Đừng lo lắng nếu bạn không có kinh nghiệm, Kiquy sẽ hướng dẫn bạn tất cả các kiến thức cần có, giúp bạn phác thảo nên những hình mẫu theo chuẩn thời trang, biết về trang phục và nhiều loại chất liệu khác nhau. Nếu bạn đã có kinh nghiệm, Kiquy sẽ giúp bạn nâng cao kỹ năng bằng những lời khuyên và mẹo về được tích lũy trong suốt 10 năm Kiquy học tập và làm việc trong ngành vẽ thời trang.',
    imageUrl: ""
};

const AboutSection = () => {
    const [introData, setIntroData] = useState<IntroductionData>(defaultData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIntroduction();
    }, []);

    const loadIntroduction = async () => {
        setLoading(true);
        try {
            // Fetch section1 specifically by document ID
            const { data, error } = await firestoreService.getOne("introduction", "section1");
            if (data && !error) {
                console.log("AboutSection data (section1):", data);
                setIntroData(data as IntroductionData);
            } else {
                console.log("No section1 data found, using default");
            }
        } catch (error) {
            console.error("Error loading introduction:", error);
            // Keep using defaultData
        }
        setLoading(false);
    };

    if (loading) {
        return null; // Don't show loading state, just render nothing briefly
    }

    return (
        <section className="py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-[3/4] max-w-sm mx-auto bg-gradient-to-b from-blush/30 to-cream rounded-sm overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {introData.imageUrl ? (
                                    <img
                                        src={introData.imageUrl}
                                        alt={introData.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="w-40 h-56 mx-auto border-2 border-primary/20 rounded-sm flex items-center justify-center bg-background/50">
                                            <span className="font-heading text-7xl text-primary/30 italic">✿</span>
                                        </div>
                                        <p className="mt-4 font-heading text-sm italic text-muted-foreground">
                                            Fashion Sketch
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/10 rounded-full blur-xl"></div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="section-title">{introData.title}</h2>
                        <div className="section-divider !mx-0 !my-4"></div>
                        <div className="space-y-4 text-foreground/80 leading-relaxed">
                            <p dangerouslySetInnerHTML={{ __html: introData.description }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
