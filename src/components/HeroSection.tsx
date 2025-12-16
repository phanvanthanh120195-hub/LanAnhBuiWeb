import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { firestoreService } from "@/services/firestoreService";

interface YouTubeData {
  title: string;
  description: string;
  youtubeLink: string;
}

interface HeaderData {
  title: string;
  title2: string;
  description: string;
  buttonText: string;
  imageUrl: string;
}

const HeroSection = () => {
  const [youtubeData, setYoutubeData] = useState<YouTubeData>({
    title: "Vẽ thời trang không khó",
    description: "Hãy để Phan Thành giúp bạn",
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  });

  const [headerData, setHeaderData] = useState<HeaderData>({
    title: "Vẽ thời trang chuyên sâu",
    title2: "từ cơ bản đến nâng cao",
    description: "Khám phá tài năng và phong cách riêng của bạn",
    buttonText: "MUA KHÓA HỌC →",
    imageUrl: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load YouTube data
    const { data: youtubeDataFromDB } = await firestoreService.getOne("introduction", "youtube");
    if (youtubeDataFromDB) {
      setYoutubeData(youtubeDataFromDB as YouTubeData);
    }

    // Load Header data
    const { data: headerDataFromDB } = await firestoreService.getOne("introduction", "header");
    if (headerDataFromDB) {
      setHeaderData(headerDataFromDB as HeaderData);
    }
  };

  // Convert YouTube watch URL to embed URL
  const getYoutubeEmbedUrl = (url: string) => {
    if (url.includes('/embed/')) return url; // Already embed URL
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const scrollToPricing = () => {
    // Find the pricing section by looking for the heading text
    const headings = Array.from(document.querySelectorAll('h2'));
    const pricingHeading = headings.find(h => h.textContent?.includes('Chọn khóa học phù hợp với bạn'));

    if (pricingHeading) {
      const pricingSection = pricingHeading.closest('section');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-gold/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light italic text-foreground leading-tight">
                {headerData.title}
                <br />
                <span className="text-primary">{headerData.title2}</span>
              </h1>
              <p className="font-heading text-xl md:text-2xl italic text-muted-foreground">
                {headerData.description}
              </p>
            </div>

            <Button
              variant="hero"
              size="xl"
              className="mx-auto lg:mx-0 font-[family-name:var(--font-button)] tracking-wide relative z-20"
              onClick={scrollToPricing}
            >
              {headerData.buttonText}
            </Button>
          </div>

          {/* Right Content - Fashion Illustration */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-lg">
              {headerData.imageUrl ? (
                // Display actual image from Firebase
                <div className="rounded-xl overflow-hidden shadow-[var(--shadow-soft)] border border-border/30">
                  <img
                    src={headerData.imageUrl}
                    alt={headerData.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : (
                // Fallback placeholder
                <>
                  <div className="bg-foreground/5 rounded-t-xl p-2 border border-border/50">
                    <div className="bg-background rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
                      <div className="text-center p-8">
                        <div className="w-32 h-48 mx-auto bg-gradient-to-b from-accent/20 to-primary/10 rounded-lg flex items-center justify-center">
                          <span className="font-heading text-5xl text-primary/40 italic">K</span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground italic">Fashion Illustration</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-foreground/10 h-4 rounded-b-lg" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="section-title">{youtubeData.title}</h2>
            <p className="section-subtitle mt-2">{youtubeData.description}</p>
            <div className="section-divider" />
          </div>

          {/* YouTube Video Embed */}
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-[var(--shadow-soft)] border border-border/30">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={getYoutubeEmbedUrl(youtubeData.youtubeLink)}
              title="Kiquy Fashion Illustration"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
