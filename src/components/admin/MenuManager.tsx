import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, GripVertical, Upload, X } from "lucide-react";

interface MenuItem {
    id?: string;
    label: string;
    href: string;
    order: number;
}

interface LogoData {
    logoUrl: string;
}

const MenuManager = () => {
    // Menu Items State
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<MenuItem>({ label: "", href: "", order: 0 });

    // Logo State
    const [logoData, setLogoData] = useState<LogoData>({ logoUrl: "" });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const [uploadingLogo, setUploadingLogo] = useState(false);

    useEffect(() => {
        loadMenuItems();
        loadLogo();
    }, []);

    const loadMenuItems = async () => {
        setLoading(true);
        const { data } = await firestoreService.getAll("menu");
        if (data) {
            const sorted = (data as MenuItem[]).sort((a, b) => a.order - b.order);
            setMenuItems(sorted);
        }
        setLoading(false);
    };

    const loadLogo = async () => {
        const { data } = await firestoreService.getOne("settings", "logo");
        if (data) {
            const logo = data as LogoData;
            setLogoData(logo);
            setLogoPreview(logo.logoUrl || "");
        }
    };

    // Logo Handlers
    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert(`Kích thước file không được vượt quá 5MB. File hiện tại: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            return;
        }

        setLogoFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview("");
        setLogoData({ logoUrl: "" });
    };

    const handleLogoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingLogo(true);

        let logoUrl = logoData.logoUrl;

        // Upload new logo if selected
        if (logoFile) {
            const { url, error } = await storageService.uploadImage(logoFile, "logo");
            if (error) {
                alert("Lỗi khi tải logo: " + error);
                setUploadingLogo(false);
                return;
            }
            logoUrl = url || "";
        }

        // Save to Firestore
        await firestoreService.set("settings", "logo", { logoUrl });

        setLogoFile(null);
        setUploadingLogo(false);
        loadLogo();
        alert("Đã cập nhật logo thành công!");
    };

    // Menu Handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            await firestoreService.update("menu", editingId, formData);
        } else {
            const newOrder = menuItems.length;
            await firestoreService.add("menu", { ...formData, order: newOrder });
        }

        setFormData({ label: "", href: "", order: 0 });
        setEditingId(null);
        loadMenuItems();
    };

    const handleEdit = (item: MenuItem) => {
        setFormData({ label: item.label, href: item.href, order: item.order });
        setEditingId(item.id || null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa mục menu này?")) {
            await firestoreService.delete("menu", id);
            loadMenuItems();
        }
    };

    const handleCancel = () => {
        setFormData({ label: "", href: "", order: 0 });
        setEditingId(null);
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Logo Management Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Quản lý Logo</CardTitle>
                    <CardDescription>
                        Upload logo cho website (hiển thị ở header)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogoSubmit} className="space-y-4">
                        {/* Logo Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo (Tối đa 5MB)</Label>
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoSelect}
                                disabled={uploadingLogo}
                            />
                        </div>

                        {/* Logo Preview */}
                        {logoPreview && (
                            <div className="space-y-2">
                                <div className="relative inline-block">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="h-20 w-auto object-contain border border-border rounded-lg p-2 bg-white"
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2"
                                        onClick={handleRemoveLogo}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={uploadingLogo || !logoFile}>
                            {uploadingLogo ? (
                                <>
                                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tải lên...
                                </>
                            ) : (
                                "Cập nhật Logo"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Menu Items Management Section */}
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Chỉnh sửa Menu" : "Thêm Menu mới"}</CardTitle>
                    <CardDescription>
                        Quản lý các mục menu hiển thị trên header
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Tên menu</Label>
                                <Input
                                    id="label"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="VD: TRANG CHỦ"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="href">Đường dẫn</Label>
                                <Input
                                    id="href"
                                    value={formData.href}
                                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                                    placeholder="VD: #home"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button type="submit" className="w-full sm:w-auto">
                                {editingId ? "Cập nhật" : "Thêm mới"}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                                    Hủy
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Menu</CardTitle>
                    <CardDescription>
                        {menuItems.length} mục menu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {menuItems.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                Chưa có menu nào. Thêm mục menu đầu tiên!
                            </p>
                        ) : (
                            menuItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3 border border-border rounded-lg space-y-2"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <GripVertical className="w-5 h-5 text-muted-foreground hidden sm:block" />
                                        <div className="flex-1 min-w-0 w-full space-y-1">
                                            <div>
                                                <span className="text-xs text-muted-foreground">Tên menu:</span>
                                                <p className="font-medium text-sm sm:text-base">{item.label}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground">Link:</span>
                                                <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.href}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(item)}
                                                className="flex-1 sm:flex-none"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(item.id!)}
                                                className="flex-1 sm:flex-none"
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

export default MenuManager;
