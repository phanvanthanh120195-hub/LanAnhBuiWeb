import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, GripVertical } from "lucide-react";

interface MenuItem {
    id?: string;
    label: string;
    href: string;
    order: number;
}

const MenuManager = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<MenuItem>({ label: "", href: "", order: 0 });

    useEffect(() => {
        loadMenuItems();
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
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Chỉnh sửa Menu" : "Thêm Menu mới"}</CardTitle>
                    <CardDescription>
                        Quản lý các mục menu hiển thị trên header
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                    className="flex items-center gap-3 p-3 border border-border rounded-lg"
                                >
                                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.href}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(item.id!)}
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
        </div>
    );
};

export default MenuManager;
