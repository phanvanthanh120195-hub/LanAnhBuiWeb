import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import HeroSection from "@/components/HeroSection";
import GallerySection from "@/components/GallerySection";
import AboutSection from "@/components/AboutSection";
import ForWhoSection from "@/components/ForWhoSection";
import CourseSkillsSection from "@/components/CourseSkillsSection";
import SkillsSection from "@/components/SkillsSection";
import CourseContentSketch from "@/components/CourseContentSketch";
import PricingSketch from "@/components/PricingSketch";
import CourseContentIllustration from "@/components/CourseContentIllustration";
import PricingIllustration from "@/components/PricingIllustration";
import InstructorSection from "@/components/InstructorSection";
import FAQSection from "@/components/FAQSection";
import PricingPackages from "@/components/PricingPackages";
import Footer from "@/components/Footer";
import { CourseProvider, useCourse } from "@/contexts/CourseContext";

const IndexContent = () => {
  const { selectedCourse } = useCourse();

  // Determine which content sections to show
  const showIllustrationContent = ["illustration", "ipad", "basicSewing"].includes(selectedCourse);
  const showSketchContent = ["sketch", "designThinking"].includes(selectedCourse);

  return (
    <main className="min-h-screen pt-20 lg:pt-24">
      {/* Header Navigation */}
      <Header />

      {/* Section 1: Hero with Video */}
      <HeroSection />

      {/* Section 2: Gallery Collection */}
      <GallerySection />

      {/* Section 3: About "Xin chào" */}
      <AboutSection />

      {/* Section 3: For Who */}
      <ForWhoSection />

      {/* Section 4: Course Skills with Tabs */}
      <CourseSkillsSection />

      {/* Section 5: Skills Grid */}
      <SkillsSection />

      {/* Conditional Course Content Sections */}
      {showSketchContent && (
        <>
          {/* Section: Course Content Sketch */}
          <CourseContentSketch />

          {/* Section: Pricing Sketch */}
          <PricingSketch />
        </>
      )}

      {showIllustrationContent && (
        <>
          {/* Section: Course Content Illustration */}
          <CourseContentIllustration />

          {/* Section: Pricing Illustration */}
          <PricingIllustration />
        </>
      )}

      {/* Section 9: Instructor */}
      <InstructorSection />

      {/* Section 10: FAQ */}
      <FAQSection />

      {/* Pricing Packages */}
      <PricingPackages />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </main>
  );
};

const Index = () => {
  return (
    <CourseProvider>
      <IndexContent />
    </CourseProvider>
  );
};

export default Index;
