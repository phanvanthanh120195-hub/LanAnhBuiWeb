import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface FooterConfig {
    id?: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    zalo: string;
    messenger: string;
    copyright: string;
}

const FooterManager = () => {
    const [footers, setFooters] = useState<FooterConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FooterConfig>({
        title: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        facebook: "",
        instagram: "",
        youtube: "",
        tiktok: "",
        zalo: "",
        messenger: "",
        copyright: ""
    });

    useEffect(() => {
        loadFooters();
    }, []);

    const loadFooters = async () => {
        setLoading(true);
        const { data } = await firestoreService.getAll("footer");
        if (data) {
            setFooters(data as FooterConfig[]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (editingId) {
            await firestoreService.update("footer", editingId, formData);
        } else {
            await firestoreService.add("footer", formData);
        }

        setFormData({
            title: "",
            description: "",
            email: "",
            phone: "",
            address: "",
            facebook: "",
            instagram: "",
            youtube: "",
            tiktok: "",
            zalo: "",
            messenger: "",
            copyright: ""
        });
        setEditingId(null);
        setSaving(false);
        loadFooters();
    };

    const handleEdit = (footer: FooterConfig) => {
        setFormData({
            title: footer.title,
            description: footer.description,
            email: footer.email,
            phone: footer.phone,
            address: footer.address,
            facebook: footer.facebook,
            instagram: footer.instagram,
            youtube: footer.youtube,
            tiktok: footer.tiktok || "",
            zalo: footer.zalo || "",
            messenger: footer.messenger || "",
            copyright: footer.copyright
        });
        setEditingId(footer.id || null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa cấu hình footer này?")) {
            await firestoreService.delete("footer", id);
            loadFooters();
        }
    };

    const handleCancel = () => {
        setFormData({
            title: "",
            description: "",
            email: "",
            phone: "",
            address: "",
            facebook: "",
            instagram: "",
            youtube: "",
            tiktok: "",
            zalo: "",
            messenger: "",
            copyright: ""
        });
        setEditingId(null);
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Chỉnh sửa Footer" : "Thêm Footer mới"}</CardTitle>
                    <CardDescription>
                        Quản lý thông tin hiển thị ở footer trang web
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tiêu đề</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Tiêu đề footer..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả ngắn về website..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0123 456 789"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Địa chỉ văn phòng..."
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium">Mạng xã hội</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="facebook">Facebook URL</Label>
                                    <Input
                                        id="facebook"
                                        value={formData.facebook}
                                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram URL</Label>
                                    <Input
                                        id="instagram"
                                        value={formData.instagram}
                                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="youtube">YouTube URL</Label>
                                    <Input
                                        id="youtube"
                                        value={formData.youtube}
                                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tiktok">TikTok URL</Label>
                                    <Input
                                        id="tiktok"
                                        value={formData.tiktok}
                                        onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                                        placeholder="https://tiktok.com/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zalo">Zalo URL</Label>
                                    <Input
                                        id="zalo"
                                        value={formData.zalo}
                                        onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                                        placeholder="https://zalo.me/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="messenger">Messenger URL</Label>
                                    <Input
                                        id="messenger"
                                        value={formData.messenger}
                                        onChange={(e) => setFormData({ ...formData, messenger: e.target.value })}
                                        placeholder="https://m.me/..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="copyright">Copyright</Label>
                            <Input
                                id="copyright"
                                value={formData.copyright}
                                onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
                                placeholder="© 2024 Your Company. All rights reserved."
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={saving}>
                                {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm mới"}
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
                    <CardTitle>Danh sách Footer</CardTitle>
                    <CardDescription>
                        {footers.length} cấu hình
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {footers.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                Chưa có cấu hình footer nào. Thêm cấu hình đầu tiên!
                            </p>
                        ) : (
                            footers.map((footer) => (
                                <div
                                    key={footer.id}
                                    className="p-3 border border-border rounded-lg space-y-2"
                                >
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0 w-full space-y-2">
                                            <div>
                                                <span className="text-xs text-muted-foreground">Tiêu đề:</span>
                                                <p className="text-sm font-semibold">{footer.title}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground">Mô tả:</span>
                                                <p className="text-sm">{footer.description}</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div>
                                                    <span className="text-xs text-muted-foreground">Email:</span>
                                                    <p className="text-sm truncate">{footer.email}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-muted-foreground">Phone:</span>
                                                    <p className="text-sm">{footer.phone}</p>
                                                </div>
                                            </div>
                                            {footer.address && (
                                                <div>
                                                    <span className="text-xs text-muted-foreground">Địa chỉ:</span>
                                                    <p className="text-sm">{footer.address}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-xs text-muted-foreground">Copyright:</span>
                                                <p className="text-sm">{footer.copyright}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground mb-2 block">Mạng xã hội:</span>
                                                <div className="space-y-2">
                                                    {footer.facebook && (
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">Facebook:</span>
                                                            <a
                                                                href={footer.facebook}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline truncate block"
                                                            >
                                                                {footer.facebook}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {footer.instagram && (
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">Instagram:</span>
                                                            <a
                                                                href={footer.instagram}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline truncate block"
                                                            >
                                                                {footer.instagram}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {footer.youtube && (
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">YouTube:</span>
                                                            <a
                                                                href={footer.youtube}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline truncate block"
                                                            >
                                                                {footer.youtube}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {footer.tiktok && (
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">TikTok:</span>
                                                            <a
                                                                href={footer.tiktok}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline truncate block"
                                                            >
                                                                {footer.tiktok}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {footer.zalo && (
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">Zalo:</span>
                                                            <a
                                                                href={footer.zalo}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline truncate block"
                                                            >
                                                                {footer.zalo}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {footer.messenger && (
                                                        <div>
                                                            <span className="text-xs text-muted-foreground">Messenger:</span>
                                                            <a
                                                                href={footer.messenger}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline truncate block"
                                                            >
                                                                {footer.messenger}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(footer)}
                                                className="flex-1 sm:flex-none"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(footer.id!)}
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

export default FooterManager;
