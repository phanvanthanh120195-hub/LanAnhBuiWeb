import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import AOS from "aos";

interface GalleryData {
    images: string[];
}

const GallerySection = () => {
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        setLoading(true);
        const { data } = await firestoreService.getOne("gallery", "images");
        if (data) {
            const galleryData = data as GalleryData;
            setGalleryImages(galleryData.images || []);
        }
        setLoading(false);
        // Refresh AOS after loading data to ensure animations work
        setTimeout(() => AOS.refresh(), 100);
    };

    // Define grid spans for irregular layout (repeating pattern for up to 11 images)
    const spanPattern = [
        "row-span-2", "row-span-1", "row-span-2", "row-span-1",
        "row-span-1", "row-span-1", "row-span-1", "row-span-2",
        "row-span-1", "row-span-2", "row-span-1"
    ];

    const galleryItems = galleryImages.map((imageUrl, index) => ({
        id: index + 1,
        span: spanPattern[index % spanPattern.length],
        image: imageUrl,
        alt: `Gallery image ${index + 1}`
    }));

    return (
        <section id="portfolio" className="py-20 lg:py-28 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="section-title">Bộ sưu tập</h2>
                    <div className="section-divider" />
                </div>

                {/* Irregular Grid Gallery */}
                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Đang tải bộ sưu tập...
                    </div>
                ) : galleryItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Chưa có ảnh nào. Tải lên ảnh đầu tiên!
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4 max-w-7xl mx-auto">
                        {galleryItems.map((item) => (
                            <div
                                key={item.id}
                                className={`${item.span} group relative overflow-hidden rounded-sm border border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer`}
                            >
                                {/* Actual image */}
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default GallerySection;
