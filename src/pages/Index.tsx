import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ForWhoSection from "@/components/ForWhoSection";
import SkillsSection from "@/components/SkillsSection";
import CourseContentSketch from "@/components/CourseContentSketch";
import PricingSketch from "@/components/PricingSketch";
import CourseContentIllustration from "@/components/CourseContentIllustration";
import PricingIllustration from "@/components/PricingIllustration";
import InstructorSection from "@/components/InstructorSection";
import FAQSection from "@/components/FAQSection";
import PricingPackages from "@/components/PricingPackages";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Section 1: Hero with Video */}
      <HeroSection />
      
      {/* Section 2: About "Xin chào" */}
      <AboutSection />
      
      {/* Section 3: For Who */}
      <ForWhoSection />
      
      {/* Section 4: Skills Grid */}
      <SkillsSection />
      
      {/* Section 5: Course Content Sketch */}
      <CourseContentSketch />
      
      {/* Section 6: Pricing Sketch */}
      <PricingSketch />
      
      {/* Section 7: Course Content Illustration */}
      <CourseContentIllustration />
      
      {/* Section 8: Pricing Illustration */}
      <PricingIllustration />
      
      {/* Section 9: Instructor */}
      <InstructorSection />
      
      {/* Section 10: FAQ */}
      <FAQSection />
      
      {/* Pricing Packages */}
      <PricingPackages />
      
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;
