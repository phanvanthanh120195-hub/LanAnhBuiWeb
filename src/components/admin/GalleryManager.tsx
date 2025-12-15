import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Trash2 } from "lucide-react";

interface GalleryData {
    images: string[]; // Array of image URLs (max 11)
}

const GalleryManager = () => {
    const [galleryData, setGalleryData] = useState<GalleryData>({ images: [] });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        setLoading(true);
        const { data } = await firestoreService.getOne("gallery", "images");
        if (data) {
            setGalleryData(data as GalleryData);
        }
        setLoading(false);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentTotal = galleryData.images.length + imageFiles.length;
        const remainingSlots = 11 - currentTotal;

        if (files.length > remainingSlots) {
            alert(`Chỉ có thể thêm tối đa ${remainingSlots} ảnh nữa. Tổng cộng tối đa 11 ảnh.`);
            return;
        }

        // Validate file sizes (5MB limit)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const invalidFiles: string[] = [];
        const validFiles: File[] = [];

        files.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
            } else {
                validFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            alert(`Các file sau vượt quá giới hạn 5MB:\n${invalidFiles.join('\n')}\n\nChỉ các file hợp lệ sẽ được thêm vào.`);
        }

        if (validFiles.length === 0) {
            return;
        }

        setImageFiles([...imageFiles, ...validFiles]);

        // Create previews for valid files only
        const newPreviews: string[] = [];
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === validFiles.length) {
                    setImagePreviews([...imagePreviews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemovePreview = (index: number) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageFiles.length === 0) {
            alert("Vui lòng chọn ít nhất 1 ảnh!");
            return;
        }

        setUploading(true);

        // Upload all images
        const uploadedUrls: string[] = [];
        for (const file of imageFiles) {
            const { url, error } = await storageService.uploadImage(file, "gallery");
            if (error) {
                alert("Lỗi khi tải ảnh: " + error);
                setUploading(false);
                return;
            }
            if (url) uploadedUrls.push(url);
        }

        // Combine with existing images
        const allImages = [...galleryData.images, ...uploadedUrls];

        // Save to Firestore
        await firestoreService.set("gallery", "images", { images: allImages });

        // Reset form
        setImageFiles([]);
        setImagePreviews([]);
        setUploading(false);
        loadGallery();
        alert("Đã tải lên thành công!");
    };

    const handleDeleteImage = async (index: number) => {
        if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

        const newImages = galleryData.images.filter((_, i) => i !== index);
        await firestoreService.set("gallery", "images", { images: newImages });
        loadGallery();
        alert("Đã xóa ảnh thành công!");
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    const remainingSlots = 11 - galleryData.images.length - imageFiles.length;

    return (
        <div className="space-y-6">
            {/* Upload Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Tải lên ảnh Gallery</CardTitle>
                    <CardDescription>
                        Tải lên tối đa 11 ảnh cho bộ sưu tập. Hiện tại: {galleryData.images.length}/11 ảnh
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="gallery-images">Chọn ảnh ({remainingSlots} ảnh còn lại)</Label>
                            <Input
                                id="gallery-images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                disabled={remainingSlots === 0 || uploading}
                            />
                            {remainingSlots === 0 && (
                                <p className="text-sm text-destructive">Đã đạt giới hạn 11 ảnh. Xóa ảnh cũ để thêm mới.</p>
                            )}
                        </div>

                        {/* Preview selected images */}
                        {imagePreviews.length > 0 && (
                            <div className="space-y-2">
                                <Label>Ảnh đã chọn ({imagePreviews.length})</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-border"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemovePreview(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={uploading || imageFiles.length === 0}>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? "Đang tải lên..." : "Tải lên Gallery"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Display current gallery */}
            <Card>
                <CardHeader>
                    <CardTitle>Bộ sưu tập hiện tại</CardTitle>
                    <CardDescription>
                        {galleryData.images.length} ảnh
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {galleryData.images.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Chưa có ảnh nào. Tải lên ảnh đầu tiên!
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {galleryData.images.map((imageUrl, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={imageUrl}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-border"
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                        #{index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default GalleryManager;
