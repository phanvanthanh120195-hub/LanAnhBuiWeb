import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Upload, Image as ImageIcon } from "lucide-react";

interface CourseTopic {
    id?: string;
    number: string;
    title: string;
    label?: string;
    image?: string;
    courseType: "sketch" | "illustration";
    lessons?: string[];
}

const CourseManager = () => {
    const [topics, setTopics] = useState<CourseTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [courseType, setCourseType] = useState<"sketch" | "illustration">("illustration");
    const [formData, setFormData] = useState<CourseTopic>({
        number: "",
        title: "",
        label: "",
        image: "",
        courseType: "illustration",
        lessons: []
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        loadTopics();
    }, [courseType]);

    const loadTopics = async () => {
        setLoading(true);
        const { data } = await firestoreService.getAll("courses");
        if (data) {
            const filtered = (data as CourseTopic[]).filter(t => t.courseType === courseType);
            const sorted = filtered.sort((a, b) => parseInt(a.number) - parseInt(b.number));
            setTopics(sorted);
        }
        setLoading(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        let imageUrl = formData.image;

        // Upload image if new file selected
        if (imageFile) {
            const { url, error } = await storageService.uploadImage(imageFile, "courses");
            if (url) {
                imageUrl = url;
            } else {
                alert("Lỗi upload ảnh: " + error);
                setUploading(false);
                return;
            }
        }

        const dataToSave = {
            ...formData,
            image: imageUrl,
            courseType
        };

        if (editingId) {
            await firestoreService.update("courses", editingId, dataToSave);
        } else {
            await firestoreService.add("courses", dataToSave);
        }

        resetForm();
        loadTopics();
        setUploading(false);
    };

    const handleEdit = (topic: CourseTopic) => {
        setFormData(topic);
        setEditingId(topic.id || null);
        setImagePreview(topic.image || "");
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa chủ đề này?")) {
            await firestoreService.delete("courses", id);
            loadTopics();
        }
    };

    const resetForm = () => {
        setFormData({
            number: "",
            title: "",
            label: "",
            image: "",
            courseType,
            lessons: []
        });
        setEditingId(null);
        setImageFile(null);
        setImagePreview("");
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <Tabs value={courseType} onValueChange={(v) => setCourseType(v as "sketch" | "illustration")}>
                <TabsList>
                    <TabsTrigger value="illustration">Diễn họa thời trang</TabsTrigger>
                    <TabsTrigger value="sketch">Phác thảo thời trang</TabsTrigger>
                </TabsList>

                <TabsContent value={courseType} className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingId ? "Chỉnh sửa chủ đề" : "Thêm chủ đề mới"}</CardTitle>
                            <CardDescription>
                                Quản lý nội dung khóa học {courseType === "illustration" ? "Diễn họa" : "Phác thảo"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="number">Số thứ tự</Label>
                                        <Input
                                            id="number"
                                            value={formData.number}
                                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                            placeholder="01, 02, 03..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="label">Label (tùy chọn)</Label>
                                        <Input
                                            id="label"
                                            value={formData.label}
                                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                            placeholder="DENIM, SHEER..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Tiêu đề</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Tả chất liệu Denim / Jeans"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Hình ảnh</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="flex-1"
                                        />
                                        {imagePreview && (
                                            <div className="w-20 h-20 border rounded overflow-hidden">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Chọn ảnh mới hoặc giữ nguyên ảnh hiện tại
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={uploading}>
                                        {uploading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm mới"}
                                    </Button>
                                    {editingId && (
                                        <Button type="button" variant="outline" onClick={resetForm}>
                                            Hủy
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách chủ đề</CardTitle>
                            <CardDescription>
                                {topics.length} chủ đề
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topics.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        Chưa có chủ đề nào. Thêm chủ đề đầu tiên!
                                    </p>
                                ) : (
                                    topics.map((topic) => (
                                        <div
                                            key={topic.id}
                                            className="flex items-center gap-4 p-4 border border-border rounded-lg"
                                        >
                                            {topic.image ? (
                                                <img
                                                    src={topic.image}
                                                    alt={topic.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center">
                                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {topic.number}. {topic.title}
                                                </p>
                                                {topic.label && (
                                                    <p className="text-sm text-muted-foreground">{topic.label}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(topic)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(topic.id!)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CourseManager;
