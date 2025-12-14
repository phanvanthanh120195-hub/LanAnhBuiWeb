import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Plus, Trash2 } from "lucide-react";

interface IntroSection {
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
}

interface ForWhoData {
    title: string;
    items: string[];
    image1: string;
    image2: string;
    image3: string;
}

const IntroductionManager = () => {
    // Giới thiệu states
    const [section1, setSection1] = useState<IntroSection>({ title: "", description: "", imageUrl: "" });
    const [section2, setSection2] = useState<IntroSection>({ title: "", description: "", imageUrl: "" });
    const [imageFile1, setImageFile1] = useState<File | null>(null);
    const [imageFile2, setImageFile2] = useState<File | null>(null);
    const [imagePreview1, setImagePreview1] = useState<string>("");
    const [imagePreview2, setImagePreview2] = useState<string>("");
    const [uploading1, setUploading1] = useState(false);
    const [uploading2, setUploading2] = useState(false);

    // Dành cho ai states
    const [forWhoData, setForWhoData] = useState<ForWhoData>({
        title: "",
        items: [""],
        image1: "",
        image2: "",
        image3: ""
    });
    const [forWhoImages, setForWhoImages] = useState<{
        file1: File | null;
        file2: File | null;
        file3: File | null;
    }>({ file1: null, file2: null, file3: null });
    const [forWhoPreviews, setForWhoPreviews] = useState<{
        preview1: string;
        preview2: string;
        preview3: string;
    }>({ preview1: "", preview2: "", preview3: "" });
    const [uploadingForWho, setUploadingForWho] = useState(false);

    const [loading, setLoading] = useState(true);
    const [mainTab, setMainTab] = useState<"intro" | "forWho">("intro");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        // Load Giới thiệu sections
        const { data: data1 } = await firestoreService.getOne("introduction", "section1");
        if (data1) {
            setSection1(data1 as IntroSection);
            setImagePreview1(data1.imageUrl || "");
        }

        const { data: data2 } = await firestoreService.getOne("introduction", "section2");
        if (data2) {
            setSection2(data2 as IntroSection);
            setImagePreview2(data2.imageUrl || "");
        }

        // Load Dành cho ai
        const { data: forWhoDataFromDB } = await firestoreService.getOne("introduction", "forWho");
        if (forWhoDataFromDB) {
            const data = forWhoDataFromDB as ForWhoData;
            setForWhoData(data);
            setForWhoPreviews({
                preview1: data.image1 || "",
                preview2: data.image2 || "",
                preview3: data.image3 || ""
            });
        }

        setLoading(false);
    };

    // Giới thiệu handlers
    const handleImageChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile1(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview1(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleImageChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile2(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview2(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading1(true);

        let imageUrl = section1.imageUrl;
        if (imageFile1) {
            const { url, error } = await storageService.uploadImage(imageFile1, "introduction");
            if (error) {
                alert("Lỗi khi tải ảnh lên: " + error);
                setUploading1(false);
                return;
            }
            imageUrl = url || "";
        }

        await firestoreService.set("introduction", "section1", { ...section1, imageUrl });
        setImageFile1(null);
        setUploading1(false);
        loadData();
        alert("Đã lưu Xin chào 1 thành công!");
    };

    const handleSubmit2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading2(true);

        let imageUrl = section2.imageUrl;
        if (imageFile2) {
            const { url, error } = await storageService.uploadImage(imageFile2, "introduction");
            if (error) {
                alert("Lỗi khi tải ảnh lên: " + error);
                setUploading2(false);
                return;
            }
            imageUrl = url || "";
        }

        await firestoreService.set("introduction", "section2", { ...section2, imageUrl });
        setImageFile2(null);
        setUploading2(false);
        loadData();
        alert("Đã lưu Xin chào 2 thành công!");
    };

    // Dành cho ai handlers
    const handleForWhoImageChange = (imageNumber: 1 | 2 | 3, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForWhoImages(prev => ({ ...prev, [`file${imageNumber}`]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setForWhoPreviews(prev => ({ ...prev, [`preview${imageNumber}`]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = () => {
        setForWhoData(prev => ({ ...prev, items: [...prev.items, ""] }));
    };

    const handleRemoveItem = (index: number) => {
        setForWhoData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, value: string) => {
        setForWhoData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => i === index ? value : item)
        }));
    };

    const handleSubmitForWho = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingForWho(true);

        let image1Url = forWhoData.image1;
        let image2Url = forWhoData.image2;
        let image3Url = forWhoData.image3;

        // Upload images
        if (forWhoImages.file1) {
            const { url, error } = await storageService.uploadImage(forWhoImages.file1, "introduction/forWho");
            if (error) {
                alert("Lỗi khi tải ảnh 1: " + error);
                setUploadingForWho(false);
                return;
            }
            image1Url = url || "";
        }

        if (forWhoImages.file2) {
            const { url, error } = await storageService.uploadImage(forWhoImages.file2, "introduction/forWho");
            if (error) {
                alert("Lỗi khi tải ảnh 2: " + error);
                setUploadingForWho(false);
                return;
            }
            image2Url = url || "";
        }

        if (forWhoImages.file3) {
            const { url, error } = await storageService.uploadImage(forWhoImages.file3, "introduction/forWho");
            if (error) {
                alert("Lỗi khi tải ảnh 3: " + error);
                setUploadingForWho(false);
                return;
            }
            image3Url = url || "";
        }

        const dataToSave = {
            ...forWhoData,
            image1: image1Url,
            image2: image2Url,
            image3: image3Url
        };

        await firestoreService.set("introduction", "forWho", dataToSave);
        setForWhoImages({ file1: null, file2: null, file3: null });
        setUploadingForWho(false);
        loadData();
        alert("Đã lưu Dành cho ai thành công!");
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as "intro" | "forWho")}>
                <TabsList>
                    <TabsTrigger value="intro">Xin chào</TabsTrigger>
                    <TabsTrigger value="forWho">Dành cho ai</TabsTrigger>
                </TabsList>

                {/* Giới thiệu Tab */}
                <TabsContent value="intro" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quản lý Giới thiệu</CardTitle>
                            <CardDescription>
                                Chỉnh sửa nội dung giới thiệu hiển thị trên trang chủ
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="section1" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="section1">Xin chào 1</TabsTrigger>
                                    <TabsTrigger value="section2">Xin chào 2</TabsTrigger>
                                </TabsList>

                                {/* Section 1 */}
                                <TabsContent value="section1" className="space-y-4">
                                    <form onSubmit={handleSubmit1} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title1">Tiêu đề</Label>
                                            <Input
                                                id="title1"
                                                value={section1.title}
                                                onChange={(e) => setSection1({ ...section1, title: e.target.value })}
                                                placeholder="Nhập tiêu đề..."
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description1">Mô tả</Label>
                                            <Textarea
                                                id="description1"
                                                value={section1.description}
                                                onChange={(e) => setSection1({ ...section1, description: e.target.value })}
                                                placeholder="Nhập mô tả..."
                                                rows={6}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Hình ảnh</Label>
                                            <div className="space-y-4">
                                                {imagePreview1 && (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={imagePreview1}
                                                            alt="Preview"
                                                            className="w-full max-w-md h-auto rounded-lg border border-border"
                                                        />
                                                        {imageFile1 && (
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                className="absolute top-2 right-2"
                                                                onClick={() => setImageFile1(null)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange1}
                                                        className="max-w-sm"
                                                    />
                                                    <Upload className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={uploading1}>
                                            {uploading1 ? "Đang lưu..." : "Lưu Xin chào 1"}
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* Section 2 */}
                                <TabsContent value="section2" className="space-y-4">
                                    <form onSubmit={handleSubmit2} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title2">Tiêu đề</Label>
                                            <Input
                                                id="title2"
                                                value={section2.title}
                                                onChange={(e) => setSection2({ ...section2, title: e.target.value })}
                                                placeholder="Nhập tiêu đề..."
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description2">Mô tả</Label>
                                            <Textarea
                                                id="description2"
                                                value={section2.description}
                                                onChange={(e) => setSection2({ ...section2, description: e.target.value })}
                                                placeholder="Nhập mô tả..."
                                                rows={6}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Hình ảnh</Label>
                                            <div className="space-y-4">
                                                {imagePreview2 && (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={imagePreview2}
                                                            alt="Preview"
                                                            className="w-full max-w-md h-auto rounded-lg border border-border"
                                                        />
                                                        {imageFile2 && (
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                className="absolute top-2 right-2"
                                                                onClick={() => setImageFile2(null)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange2}
                                                        className="max-w-sm"
                                                    />
                                                    <Upload className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={uploading2}>
                                            {uploading2 ? "Đang lưu..." : "Lưu Xin chào 2"}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Dành cho ai Tab */}
                <TabsContent value="forWho" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dành cho ai</CardTitle>
                            <CardDescription>
                                Quản lý đối tượng học viên và hình ảnh minh họa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitForWho} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="forWhoTitle">Tiêu đề</Label>
                                    <Input
                                        id="forWhoTitle"
                                        value={forWhoData.title}
                                        onChange={(e) => setForWhoData({ ...forWhoData, title: e.target.value })}
                                        placeholder="Khóa học này dành cho ai?"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Danh sách đối tượng</Label>
                                        <Button type="button" size="sm" variant="outline" onClick={handleAddItem}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Thêm mục
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {forWhoData.items.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => handleItemChange(index, e.target.value)}
                                                    placeholder={`Mục ${index + 1}...`}
                                                    required
                                                />
                                                {forWhoData.items.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleRemoveItem(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label>Hình ảnh minh họa</Label>

                                    {[1, 2, 3].map((num) => (
                                        <div key={num} className="space-y-2 p-4 border rounded-lg">
                                            <Label className="text-sm font-medium">Ảnh {num}</Label>
                                            {forWhoPreviews[`preview${num}` as keyof typeof forWhoPreviews] && (
                                                <img
                                                    src={forWhoPreviews[`preview${num}` as keyof typeof forWhoPreviews]}
                                                    alt={`Preview ${num}`}
                                                    className="w-full max-w-xs h-auto rounded border"
                                                />
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleForWhoImageChange(num as 1 | 2 | 3, e)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button type="submit" disabled={uploadingForWho}>
                                    {uploadingForWho ? "Đang lưu..." : "Lưu Dành cho ai"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default IntroductionManager;
