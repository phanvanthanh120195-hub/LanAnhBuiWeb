import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseManager from "@/components/admin/CourseManager";
import FAQManager from "@/components/admin/FAQManager";
import MenuManager from "@/components/admin/MenuManager";
import FooterManager from "@/components/admin/FooterManager";
import IntroductionManager from "@/components/admin/IntroductionManager";

const Admin = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("courses");

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-secondary/30">
            {/* Admin Header */}
            <header className="bg-background border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-primary">
                                Trang Quản Trị
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Xin chào, {user?.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" onClick={() => navigate("/")}>
                                Về trang chủ
                            </Button>
                            <Button variant="destructive" onClick={handleLogout}>
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Admin Content */}
            <div className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="courses">Khóa học</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                        <TabsTrigger value="menu">Menu</TabsTrigger>
                        <TabsTrigger value="footer">Footer</TabsTrigger>
                        <TabsTrigger value="introduction">Giới thiệu</TabsTrigger>
                    </TabsList>

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
