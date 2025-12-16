import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    coursePrice: string;
}

interface BankInfo {
    id?: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    qrCodeUrl: string;
    status: "active" | "inactive";
    isDisplayed: boolean;
}

const PaymentModal = ({ isOpen, onClose, courseTitle, coursePrice }: PaymentModalProps) => {
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBankInfo = async () => {
            setLoading(true);
            const { data: banksFromDB } = await firestoreService.getAll("banks");

            if (banksFromDB) {
                const banks = banksFromDB as BankInfo[];
                // Find the bank that is active and displayed
                const displayedBank = banks.find(b => b.status === "active" && b.isDisplayed);

                if (displayedBank) {
                    setBankInfo(displayedBank);
                } else {
                    // Fallback: find any active bank
                    const activeBank = banks.find(b => b.status === "active");
                    setBankInfo(activeBank || null);
                }
            }

            setLoading(false);
        };

        if (isOpen) {
            loadBankInfo();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                {/* Custom Header with aligned close button */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h2 className="text-2xl font-heading italic text-primary">
                        Thông Tin Thanh Toán
                    </h2>
                    <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </div>

                <div className="space-y-6 py-4">
                    {/* Course Info */}
                    <div className="text-center space-y-2 pb-4 border-b border-border">
                        <h3 className="font-heading text-lg italic text-foreground/80">
                            {courseTitle}
                        </h3>
                        <p className="text-3xl font-heading font-light text-primary">
                            {coursePrice} VNĐ
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Đang tải thông tin...</p>
                        </div>
                    ) : !bankInfo ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Chưa có thông tin ngân hàng</p>
                        </div>
                    ) : (
                        <>
                            {/* QR Code */}
                            <div className="flex flex-col items-center space-y-3">
                                <p className="text-sm font-medium text-foreground/70">Quét mã QR để thanh toán</p>
                                <div className="w-64 h-64 bg-gradient-to-br from-secondary/30 to-cream border-2 border-primary/20 rounded-lg flex items-center justify-center overflow-hidden">
                                    {bankInfo.qrCodeUrl ? (
                                        <img
                                            src={bankInfo.qrCodeUrl}
                                            alt="QR Code"
                                            className="w-full h-full object-contain p-2"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="w-48 h-48 bg-white border border-border rounded-sm flex items-center justify-center">
                                                <span className="text-4xl">📱</span>
                                            </div>
                                            <p className="mt-2 text-xs text-muted-foreground italic">
                                                Chưa có QR Code
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bank Information */}
                            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                                <h4 className="font-heading text-base italic text-primary border-b border-border pb-2">
                                    Thông tin chuyển khoản
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-foreground/60">Ngân hàng:</span>
                                        <span className="font-medium">{bankInfo.bankName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground/60">Số tài khoản:</span>
                                        <span className="font-medium font-mono">{bankInfo.accountNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground/60">Chủ tài khoản:</span>
                                        <span className="font-medium">{bankInfo.accountName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground/60">Số tiền:</span>
                                        <span className="font-medium text-primary">{coursePrice} VNĐ</span>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                                <p className="text-sm text-foreground/80 text-center leading-relaxed">
                                    <span className="font-medium">Lưu ý:</span> Sau khi chuyển khoản, vui lòng{" "}
                                    <span className="font-medium text-primary">chụp bill</span> và gửi tin nhắn cho page
                                    hoặc gọi điện trực tiếp để xác nhận.
                                </p>
                            </div>

                            {/* Contact Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href="https://m.me/Dienhoathoitrang.vevai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#00B2FF] to-[#006AFF] text-white px-4 py-3 rounded-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="font-medium">Messenger</span>
                                </a>
                                <a
                                    href="tel:0368088868"
                                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span className="font-medium">Gọi điện</span>
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
