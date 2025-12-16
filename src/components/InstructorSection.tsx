import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";

interface IntroductionData {
    id?: string;
    title: string;
    description: string;
    imageUrl?: string;
}

const defaultData: IntroductionData = {
    title: "Xin chào!",
    description: 'Chào bạn, mình là <span class="text-primary font-medium">Kiquy Pham</span>, hiện đang là họa sĩ về <span class="text-primary">thiết kế & diễn họa thời trang</span>.',
    imageUrl: ""
};

const InstructorSection = () => {
    const [introData, setIntroData] = useState<IntroductionData>(defaultData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIntroduction();
    }, []);

    const loadIntroduction = async () => {
        setLoading(true);
        try {
            const { data } = await firestoreService.getAll("introduction");
            console.log("All introduction data for Instructor:", data);
            if (data && data.length > 0) {
                // Get first document (section1) - contains long instructor bio
                console.log("InstructorSection data (section1 - index 0):", data[0]);
                setIntroData(data[0] as IntroductionData);
            }
        } catch (error) {
            console.error("Error loading introduction:", error);
            // Keep using defaultData
        }
        setLoading(false);
    };

    if (loading) {
        return null;
    }

    return (
        <section className="py-20 lg:py-28 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                    {/* Content */}
                    <div className="space-y-6" data-aos="fade-left">
                        <h2 className="section-title">{introData.title}</h2>
                        <div className="section-divider !mx-0 !my-4" />

                        <div className="space-y-4 text-foreground/80 leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: introData.description }} />
                        </div>
                    </div>

                    {/* Photo */}
                    <div className="relative" data-aos="fade-right">
                        <div className="aspect-square mx-auto rounded-sm overflow-hidden border border-border/30 bg-gradient-to-b from-secondary/50 to-cream">
                            {introData.imageUrl ? (
                                <img
                                    src={introData.imageUrl}
                                    alt={introData.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-40 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-heading text-5xl text-primary/40 italic">K</span>
                                        </div>
                                        <p className="mt-4 font-heading text-lg italic text-muted-foreground">Kiquy Pham</p>
                                        <p className="text-sm text-muted-foreground">Fashion Illustrator</p>
                                    </div>
                                </div>
                            )}
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