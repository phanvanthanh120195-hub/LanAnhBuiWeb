import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order?: number;
}

const defaultFaqs: FAQ[] = [
  {
    question: "Chưa học vẽ bao giờ thì có học khoá này được không?",
    answer: "Hoàn toàn được! Khóa học được thiết kế từ cơ bản đến nâng cao, phù hợp với cả người mới bắt đầu. Kiquy sẽ hướng dẫn bạn từng bước một.",
  },
  {
    question: "Cần chuẩn bị những gì để bước vào khoá học?",
    answer: "Bạn cần chuẩn bị giấy vẽ, bút chì, tẩy và một số dụng cụ cơ bản. Danh sách chi tiết sẽ được gửi sau khi đăng ký khóa học.",
  },
];

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const { data } = await firestoreService.getAll("faqs");
      console.log("FAQ data from Firestore:", data);
      if (data && data.length > 0) {
        // Sort by order field if it exists
        const sortedFaqs = (data as FAQ[]).sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return 0;
        });
        setFaqs(sortedFaqs);
      }
    } catch (error) {
      console.error("Error loading FAQs:", error);
      // Keep using defaultFaqs
    }
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12" data-aos="fade-up">
            <h2 className="section-title">FAQ's</h2>
            <div className="section-divider !mx-0 !my-4" />
          </div>

          <Accordion type="single" collapsible className="space-y-4" data-aos="fade-up">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id || index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-sm px-6 data-[state=open]:shadow-[var(--shadow-card)]"
              >
                <AccordionTrigger className="text-left font-heading text-2xl italic text-foreground/80 hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-5 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
