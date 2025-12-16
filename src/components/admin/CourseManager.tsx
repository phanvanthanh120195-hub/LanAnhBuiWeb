import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Upload, Image as ImageIcon, Plus } from "lucide-react";

interface CourseTopic {
    id?: string;
    number: string;
    title: string;
    description?: string;
    label?: string;
    image?: string;
    courseType: "sketch" | "illustration" | "ipad" | "designThinking" | "basicSewing";
    lessons?: string[];
}

interface CourseTuition {
    id?: string;
    mode: "online" | "offline";
    originalPrice: number;
    discountPercent: number;
    imageUrl: string;
}

type CourseTypeUnion = "sketch" | "illustration" | "ipad" | "designThinking" | "basicSewing";

interface CourseContent {
    id?: string;
    items: string[];
    imageUrl: string;
    courseType: "sketch" | "illustration" | "ipad" | "designThinking" | "basicSewing";
}

const CourseManager = () => {
    const [topics, setTopics] = useState<CourseTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [courseType, setCourseType] = useState<"sketch" | "illustration" | "ipad" | "designThinking" | "basicSewing">("illustration");
    const [formData, setFormData] = useState<CourseTopic>({
        number: "",
        title: "",
        description: "",
        image: "",
        courseType: "illustration",
        lessons: []
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    // Tuition states
    const [tuitions, setTuitions] = useState<CourseTuition[]>([]);
    const [editingTuitionId, setEditingTuitionId] = useState<string | null>(null);
    const [tuition, setTuition] = useState<CourseTuition>({
        mode: "online",
        originalPrice: 0,
        discountPercent: 0,
        imageUrl: ""
    });
    const [tuitionImageFile, setTuitionImageFile] = useState<File | null>(null);
    const [tuitionImagePreview, setTuitionImagePreview] = useState<string>("");
    const [uploadingTuition, setUploadingTuition] = useState(false);

    // Course Content states
    const [courseContent, setCourseContent] = useState<CourseContent>({
        items: [""],
        imageUrl: "",
        courseType: "illustration"
    });
    const [contentImageFile, setContentImageFile] = useState<File | null>(null);
    const [contentImagePreview, setContentImagePreview] = useState<string>("");
    const [uploadingContent, setUploadingContent] = useState(false);
    const [courseContents, setCourseContents] = useState<CourseContent[]>([]);
    const [editingContentId, setEditingContentId] = useState<string | null>(null);

    useEffect(() => {
        loadTopics();
        loadTuition();
        loadCourseContent();
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

    const loadTuition = async () => {
        const { data } = await firestoreService.getAll("tuition");
        if (data) {
            const filtered = (data as CourseTuition[]).filter((t: any) => {
                // Filter by courseType stored in the document
                return t.courseType === courseType;
            });
            setTuitions(filtered);
        }
    };

    const loadCourseContent = async () => {
        const { data } = await firestoreService.getAll("courseContent");
        if (data) {
            const filtered = (data as CourseContent[]).filter((c: any) => c.courseType === courseType);
            setCourseContents(filtered);
        }
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
            description: "",
            label: "",
            image: "",
            courseType,
            lessons: []
        });
        setEditingId(null);
        setImageFile(null);
        setImagePreview("");
    };

    const handleTuitionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTuitionImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setTuitionImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleTuitionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingTuition(true);

        let imageUrl = tuition.imageUrl;
        if (tuitionImageFile) {
            const { url, error } = await storageService.uploadImage(tuitionImageFile, "tuition");
            if (url) {
                imageUrl = url;
            } else {
                alert("Lỗi upload ảnh: " + error);
                setUploadingTuition(false);
                return;
            }
        }

        const dataToSave = {
            ...tuition,
            imageUrl,
            courseType // Add courseType to the document
        };

        if (editingTuitionId) {
            await firestoreService.update("tuition", editingTuitionId, dataToSave);
        } else {
            await firestoreService.add("tuition", dataToSave);
        }

        resetTuitionForm();
        loadTuition();
        setUploadingTuition(false);
        alert("Đã lưu học phí thành công!");
    };

    const handleEditTuition = (tuitionItem: CourseTuition) => {
        setTuition(tuitionItem);
        setEditingTuitionId(tuitionItem.id || null);
        setTuitionImagePreview(tuitionItem.imageUrl || "");
    };

    const handleDeleteTuition = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa học phí này?")) {
            await firestoreService.delete("tuition", id);
            loadTuition();
        }
    };

    const resetTuitionForm = () => {
        setTuition({
            mode: "online",
            originalPrice: 0,
            discountPercent: 0,
            imageUrl: ""
        });
        setEditingTuitionId(null);
        setTuitionImageFile(null);
        setTuitionImagePreview("");
    };

    // Course Content handlers
    const handleContentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setContentImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setContentImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAddContentItem = () => {
        setCourseContent(prev => ({ ...prev, items: [...prev.items, ""] }));
    };

    const handleRemoveContentItem = (index: number) => {
        setCourseContent(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleContentItemChange = (index: number, value: string) => {
        setCourseContent(prev => ({
            ...prev,
            items: prev.items.map((item, i) => i === index ? value : item)
        }));
    };

    const handleContentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingContent(true);

        let imageUrl = courseContent.imageUrl;
        if (contentImageFile) {
            const { url, error } = await storageService.uploadImage(contentImageFile, "courseContent");
            if (error) {
                alert("Lỗi khi tải ảnh lên: " + error);
                setUploadingContent(false);
                return;
            }
            imageUrl = url || "";
        }

        const dataToSave = { ...courseContent, imageUrl, courseType };

        if (editingContentId) {
            await firestoreService.update("courseContent", editingContentId, dataToSave);
        } else {
            await firestoreService.add("courseContent", dataToSave);
        }

        resetContentForm();
        loadCourseContent();
        setUploadingContent(false);
        alert("Đã lưu nội dung thành công!");
    };

    const handleEditContent = (content: CourseContent) => {
        setCourseContent(content);
        setEditingContentId(content.id || null);
        setContentImagePreview(content.imageUrl || "");
    };

    const handleDeleteContent = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa nội dung này?")) {
            await firestoreService.delete("courseContent", id);
            loadCourseContent();
        }
    };

    const resetContentForm = () => {
        setCourseContent({ items: [""], imageUrl: "", courseType });
        setEditingContentId(null);
        setContentImageFile(null);
        setContentImagePreview("");
    };

    const calculateDiscountedPrice = () => {
        const discounted = tuition.originalPrice * (1 - tuition.discountPercent / 100);
        return discounted.toLocaleString('vi-VN');
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <Tabs value={courseType} onValueChange={(v) => setCourseType(v as CourseTypeUnion)}>
                <TabsList>
                    <TabsTrigger value="illustration">Diễn họa thời trang</TabsTrigger>
                    <TabsTrigger value="sketch">Phác thảo thời trang</TabsTrigger>
                    <TabsTrigger value="ipad">Diễn họa iPad</TabsTrigger>
                    <TabsTrigger value="designThinking">Tư duy thiết kế</TabsTrigger>
                    <TabsTrigger value="basicSewing">Cắt may cơ bản</TabsTrigger>
                </TabsList>

                <TabsContent value={courseType} className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingContentId ? "Chỉnh sửa nội dung" : editingId ? "Chỉnh sửa chủ đề" : "Thêm chủ đề mới"}</CardTitle>
                            <CardDescription>
                                Quản lý nội dung khóa học {courseType === "illustration" ? "Diễn họa" : courseType === "sketch" ? "Phác thảo" : courseType === "ipad" ? "Diễn họa iPad" : courseType === "designThinking" ? "Tư duy thiết kế" : "Cắt may cơ bản"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="skills" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
                                    <TabsTrigger value="content">Nội dung</TabsTrigger>
                                </TabsList>

                                {/* Kỹ năng Tab */}
                                <TabsContent value="skills" className="space-y-4">
                                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                            <Label htmlFor="description">Mô tả</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description || ""}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Nhập mô tả chi tiết về chủ đề..."
                                                rows={4}
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
                                </TabsContent>

                                {/* Nội dung Tab */}
                                <TabsContent value="content" className="space-y-4">
                                    <form onSubmit={handleContentSubmit} className="space-y-4">

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Danh sách nội dung</Label>
                                                <Button type="button" size="sm" variant="outline" onClick={handleAddContentItem}>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Thêm mục
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {courseContent.items.map((item, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            value={item}
                                                            onChange={(e) => handleContentItemChange(index, e.target.value)}
                                                            placeholder={`Mục ${index + 1}...`}
                                                            required
                                                        />
                                                        {courseContent.items.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleRemoveContentItem(index)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contentImage">Hình ảnh</Label>
                                            <div className="space-y-4">
                                                {contentImagePreview && (
                                                    <img
                                                        src={contentImagePreview}
                                                        alt="Preview"
                                                        className="w-full max-w-xs h-auto rounded border"
                                                    />
                                                )}
                                                <Input
                                                    id="contentImage"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleContentImageChange}
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={uploadingContent}>
                                            {uploadingContent ? "Đang lưu..." : editingContentId ? "Cập nhật" : "Lưu nội dung"}
                                        </Button>
                                        {editingContentId && (
                                            <Button type="button" variant="outline" onClick={resetContentForm}>
                                                Hủy
                                            </Button>
                                        )}
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>


                    {/* Học phí Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingTuitionId ? "Chỉnh sửa học phí" : "Thêm học phí mới"}</CardTitle>
                            <CardDescription>
                                Quản lý giá khóa học {courseType === "illustration" ? "Diễn họa" : courseType === "sketch" ? "Phác thảo" : courseType === "ipad" ? "Diễn họa iPad" : courseType === "designThinking" ? "Tư duy thiết kế" : "Cắt may cơ bản"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleTuitionSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mode">Hình thức học</Label>
                                    <select
                                        id="mode"
                                        value={tuition.mode}
                                        onChange={(e) => setTuition({ ...tuition, mode: e.target.value as "online" | "offline" })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    >
                                        {courseType !== "basicSewing" && <option value="online">Online</option>}
                                        <option value="offline">Offline</option>
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="originalPrice">Số tiền gốc (VNĐ)</Label>
                                        <Input
                                            id="originalPrice"
                                            type="number"
                                            value={tuition.originalPrice || ""}
                                            onChange={(e) => setTuition({ ...tuition, originalPrice: Number(e.target.value) })}
                                            placeholder="4700000"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="discountPercent">% Giảm giá</Label>
                                        <Input
                                            id="discountPercent"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={tuition.discountPercent || ""}
                                            onChange={(e) => setTuition({ ...tuition, discountPercent: Number(e.target.value) })}
                                            placeholder="15"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Số tiền sau giảm giá</Label>
                                    <div className="text-2xl font-bold text-primary">
                                        {calculateDiscountedPrice()} VNĐ
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tuitionImage">Hình ảnh</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="tuitionImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleTuitionImageChange}
                                            className="flex-1"
                                        />
                                        {tuitionImagePreview && (
                                            <div className="w-20 h-20 border rounded overflow-hidden">
                                                <img src={tuitionImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={uploadingTuition}>
                                        {uploadingTuition ? "Đang lưu..." : editingTuitionId ? "Cập nhật" : "Thêm mới"}
                                    </Button>
                                    {editingTuitionId && (
                                        <Button type="button" variant="outline" onClick={resetTuitionForm}>
                                            Hủy
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách kỹ năng</CardTitle>
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

                    {/* Danh sách nội dung */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách nội dung</CardTitle>
                            <CardDescription>
                                {courseContents.length} nội dung
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {courseContents.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        Chưa có nội dung nào. Thêm nội dung đầu tiên!
                                    </p>
                                ) : (
                                    courseContents.map((content) => (
                                        <div
                                            key={content.id}
                                            className="flex items-center gap-4 p-4 border border-border rounded-lg"
                                        >
                                            {content.imageUrl ? (
                                                <img
                                                    src={content.imageUrl}
                                                    alt="Content image"
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center">
                                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium mb-2">
                                                    {content.items.length} mục nội dung
                                                </p>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                                    {content.items.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditContent(content)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteContent(content.id!)}
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

                    {/* Danh sách học phí */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách học phí</CardTitle>
                            <CardDescription>
                                {tuitions.length} gói học phí
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {tuitions.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        Chưa có học phí nào. Thêm học phí đầu tiên!
                                    </p>
                                ) : (
                                    tuitions.map((tuitionItem) => (
                                        <div
                                            key={tuitionItem.id}
                                            className="flex items-center gap-4 p-4 border border-border rounded-lg"
                                        >
                                            {tuitionItem.imageUrl ? (
                                                <img
                                                    src={tuitionItem.imageUrl}
                                                    alt="Tuition"
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center">
                                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {tuitionItem.mode === "online" ? "Online" : "Offline"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {tuitionItem.originalPrice.toLocaleString('vi-VN')} VNĐ
                                                    {tuitionItem.discountPercent > 0 && (
                                                        <span className="text-primary ml-2">
                                                            (-{tuitionItem.discountPercent}%) → {(tuitionItem.originalPrice * (1 - tuitionItem.discountPercent / 100)).toLocaleString('vi-VN')} VNĐ
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditTuition(tuitionItem)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteTuition(tuitionItem.id!)}
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
