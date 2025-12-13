import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";

interface FAQ {
    id?: string;
    question: string;
    answer: string;
}

const FAQManager = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FAQ>({ question: "", answer: "" });

    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        setLoading(true);
        const { data } = await firestoreService.getAll("faqs");
        if (data) {
            setFaqs(data as FAQ[]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            await firestoreService.update("faqs", editingId, formData);
        } else {
            await firestoreService.add("faqs", formData);
        }

        setFormData({ question: "", answer: "" });
        setEditingId(null);
        loadFAQs();
    };

    const handleEdit = (faq: FAQ) => {
        setFormData({ question: faq.question, answer: faq.answer });
        setEditingId(faq.id || null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
            await firestoreService.delete("faqs", id);
            loadFAQs();
        }
    };

    const handleCancel = () => {
        setFormData({ question: "", answer: "" });
        setEditingId(null);
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Chỉnh sửa FAQ" : "Thêm FAQ mới"}</CardTitle>
                    <CardDescription>
                        Quản lý các câu hỏi thường gặp hiển thị trên trang chủ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question">Câu hỏi</Label>
                            <Input
                                id="question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                placeholder="Nhập câu hỏi..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="answer">Câu trả lời</Label>
                            <Textarea
                                id="answer"
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                placeholder="Nhập câu trả lời..."
                                rows={4}
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit">
                                {editingId ? "Cập nhật" : "Thêm mới"}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Hủy
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách FAQ</CardTitle>
                    <CardDescription>
                        {faqs.length} câu hỏi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {faqs.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                Chưa có FAQ nào. Thêm câu hỏi đầu tiên!
                            </p>
                        ) : (
                            faqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className="p-4 border border-border rounded-lg space-y-2"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-foreground">{faq.question}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(faq)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(faq.id!)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FAQManager;
