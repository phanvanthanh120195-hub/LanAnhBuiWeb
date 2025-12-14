import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Chưa học vẽ bao giờ thì có học khoá này được không?",
      answer: "Hoàn toàn được! Khóa học được thiết kế từ cơ bản đến nâng cao, phù hợp với cả người mới bắt đầu. Kiquy sẽ hướng dẫn bạn từng bước một.",
    },
    {
      question: "Cần chuẩn bị những gì để bước vào khoá học?",
      answer: "Bạn cần chuẩn bị giấy vẽ, bút chì, tẩy và một số dụng cụ cơ bản. Danh sách chi tiết sẽ được gửi sau khi đăng ký khóa học.",
    },
    {
      question: "Học online vậy có hiệu quả như học với giáo viên tại lớp không?",
      answer: "Khóa học online cho phép bạn học theo tốc độ riêng, xem lại bài học nhiều lần. Kiquy cũng hỗ trợ giải đáp thắc mắc qua các kênh liên lạc.",
    },
    {
      question: "Nếu trong tuần bận việc ko thể học thì làm thế nào?",
      answer: "Bạn có thể học bất cứ lúc nào thuận tiện. Khóa học không giới hạn thời gian truy cập, bạn có thể xem lại bất cứ khi nào.",
    },
    {
      question: "Học xong khoá này có vẽ đẹp ko hay chỉ là quảng cáo thôi?",
      answer: "Kết quả phụ thuộc vào sự luyện tập của bạn. Nhiều học viên đã có tiến bộ rõ rệt sau khóa học. Bạn có thể xem portfolio của học viên trước khi đăng ký.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="section-title">FAQ's</h2>
            <div className="section-divider !mx-0 !my-4" />
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
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
