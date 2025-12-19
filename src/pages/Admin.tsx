import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GalleryManager from "@/components/admin/GalleryManager";
import CourseManager from "@/components/admin/CourseManager";
import FAQManager from "@/components/admin/FAQManager";
import MenuManager from "@/components/admin/MenuManager";
import FooterManager from "@/components/admin/FooterManager";
import IntroductionManager from "@/components/admin/IntroductionManager";

const Admin = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Load active tab from localStorage, default to "menu"
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem("adminActiveTab");
        return saved || "menu";
    });

    // Save active tab to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("adminActiveTab", activeTab);
    }, [activeTab]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-secondary/30">
            {/* Admin Header */}
            <header className="bg-background border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-heading font-bold text-primary">
                                Trang Quản Trị
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate sm:max-w-none">
                                Xin chào, {user?.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/")}
                                className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-10"
                            >
                                Về trang chủ
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-10"
                            >
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Admin Content */}
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                        <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0 h-auto flex-nowrap sm:flex-wrap p-1">
                            <TabsTrigger value="menu" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Menu</TabsTrigger>
                            <TabsTrigger value="introduction" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Giới thiệu</TabsTrigger>
                            <TabsTrigger value="gallery" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Bộ sưu tập</TabsTrigger>
                            <TabsTrigger value="courses" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Khóa học</TabsTrigger>
                            <TabsTrigger value="faq" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">FAQ</TabsTrigger>
                            <TabsTrigger value="footer" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Footer</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="gallery" className="space-y-4">
                        <GalleryManager />
                    </TabsContent>

                    <TabsContent value="courses" className="space-y-4">
                        <CourseManager />
                    </TabsContent>

                    <TabsContent value="faq" className="space-y-4">
                        <FAQManager />
                    </TabsContent>

                    <TabsContent value="menu" className="space-y-4">
                        <MenuManager />
                    </TabsContent>

                    <TabsContent value="footer" className="space-y-4">
                        <FooterManager />
                    </TabsContent>

                    <TabsContent value="introduction" className="space-y-4">
                        <IntroductionManager />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Admin;
