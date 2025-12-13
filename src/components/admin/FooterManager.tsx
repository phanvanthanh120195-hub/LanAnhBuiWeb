import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FooterConfig {
    id?: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    facebook: string;
    instagram: string;
    youtube: string;
    copyright: string;
}

const FooterManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [footerData, setFooterData] = useState<FooterConfig>({
        description: "",
        email: "",
        phone: "",
        address: "",
        facebook: "",
        instagram: "",
        youtube: "",
        copyright: ""
    });

    useEffect(() => {
        loadFooterData();
    }, []);

    const loadFooterData = async () => {
        setLoading(true);
        const { data } = await firestoreService.getAll("footer");
        if (data && data.length > 0) {
            setFooterData(data[0] as FooterConfig);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (footerData.id) {
            await firestoreService.update("footer", footerData.id, footerData);
        } else {
            const { id } = await firestoreService.add("footer", footerData);
            if (id) {
                setFooterData({ ...footerData, id });
            }
        }

        setSaving(false);
        alert("Đã lưu cấu hình footer!");
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cấu hình Footer</CardTitle>
                <CardDescription>
                    Chỉnh sửa thông tin hiển thị ở footer trang web
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={footerData.description}
                            onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
                            placeholder="Mô tả ngắn về website..."
                            rows={3}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={footerData.email}
                                onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                value={footerData.phone}
                                onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                                placeholder="0123 456 789"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                            id="address"
                            value={footerData.address}
                            onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
                            placeholder="Địa chỉ văn phòng..."
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Mạng xã hội</h3>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook URL</Label>
                                <Input
                                    id="facebook"
                                    value={footerData.facebook}
                                    onChange={(e) => setFooterData({ ...footerData, facebook: e.target.value })}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram URL</Label>
                                <Input
                                    id="instagram"
                                    value={footerData.instagram}
                                    onChange={(e) => setFooterData({ ...footerData, instagram: e.target.value })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="youtube">YouTube URL</Label>
                                <Input
                                    id="youtube"
                                    value={footerData.youtube}
                                    onChange={(e) => setFooterData({ ...footerData, youtube: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="copyright">Copyright</Label>
                        <Input
                            id="copyright"
                            value={footerData.copyright}
                            onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                            placeholder="© 2024 Your Company. All rights reserved."
                        />
                    </div>

                    <Button type="submit" disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu cấu hình"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default FooterManager;
