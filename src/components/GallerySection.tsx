const GallerySection = () => {
    // Placeholder images - these will be replaced with actual images from admin
    const galleryItems = [
        { id: 1, span: "row-span-2", image: "/placeholder-1.jpg", alt: "Fashion sketch 1" },
        { id: 2, span: "row-span-1", image: "/placeholder-2.jpg", alt: "Fashion sketch 2" },
        { id: 3, span: "row-span-2", image: "/placeholder-3.jpg", alt: "Fashion sketch 3" },
        { id: 4, span: "row-span-1", image: "/placeholder-4.jpg", alt: "Fashion sketch 4" },
        { id: 5, span: "row-span-1", image: "/placeholder-5.jpg", alt: "Fashion sketch 5" },
        { id: 6, span: "row-span-1", image: "/placeholder-6.jpg", alt: "Fashion sketch 6" },
        { id: 7, span: "row-span-1", image: "/placeholder-7.jpg", alt: "Fashion sketch 7" },
        { id: 8, span: "row-span-2", image: "/placeholder-8.jpg", alt: "Fashion sketch 8" },
        { id: 9, span: "row-span-1", image: "/placeholder-9.jpg", alt: "Fashion sketch 9" },
        { id: 10, span: "row-span-2", image: "/placeholder-10.jpg", alt: "Fashion sketch 10" },
        { id: 11, span: "row-span-1", image: "/placeholder-11.jpg", alt: "Fashion sketch 11" },
        { id: 12, span: "row-span-1", image: "/placeholder-12.jpg", alt: "Fashion sketch 12" },
    ];

    return (
        <section id="portfolio" className="py-20 lg:py-28 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16" data-aos="fade-left">
                    <h2 className="section-title">Bộ sưu tập</h2>
                    <div className="section-divider" />
                </div>

                {/* Irregular Grid Gallery */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4 max-w-7xl mx-auto" data-aos="fade-right">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className={`${item.span} group relative overflow-hidden rounded-sm border border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer`}
                        >
                            {/* Placeholder gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-cream/50 to-primary/20" />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                            {/* Image placeholder icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-heading text-6xl text-primary/10 group-hover:text-primary/30 transition-colors duration-300">
                                    ✿
                                </span>
                            </div>

                            {/* Future: Actual image will be displayed here */}
                            {/* <img 
                src={item.image} 
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              /> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
