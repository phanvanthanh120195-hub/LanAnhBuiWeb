import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: {
        title: string;
        price: string;
        discount?: string;
        features: string[];
        description?: string;
    } | null;
}

const CourseModal = ({ isOpen, onClose, course }: CourseModalProps) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    if (!course) return null;

    const handleRegister = () => {
        onClose(); // Close course modal first
        setTimeout(() => {
            setIsPaymentModalOpen(true); // Then open payment modal
        }, 300); // Wait for close animation
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-2xl text-primary pr-8">
                            {course.title}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Thông tin chi tiết về khóa học
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Price Section */}
                        <div className="bg-secondary/30 rounded-sm p-6 text-center">
                            <p className="font-heading text-5xl font-light text-primary mb-2">
                                {course.price}
                            </p>
                            {course.discount && (
                                <p className="text-lg text-accent font-medium mb-1">
                                    {course.discount}
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground">VNĐ</p>
                        </div>

                        {/* Features Section */}
                        <div>
                            <h4 className="font-heading text-lg text-foreground mb-4">
                                Nội dung khóa học:
                            </h4>
                            <ul className="space-y-3">
                                {course.features.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 text-foreground/80"
                                    >
                                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Description Section */}
                        {course.description && (
                            <div>
                                <h4 className="font-heading text-lg text-foreground mb-3">
                                    Mô tả:
                                </h4>
                                <p className="text-foreground/70 leading-relaxed">
                                    {course.description}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="elegant"
                                size="lg"
                                className="flex-1 font-[family-name:var(--font-button)] tracking-wide"
                                onClick={handleRegister}
                            >
                                ĐĂNG KÝ NGAY
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={onClose}
                                className="font-[family-name:var(--font-button)]"
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                courseTitle={course.title}
                coursePrice={course.price}
            />
        </>
    );
};

export default CourseModal;
