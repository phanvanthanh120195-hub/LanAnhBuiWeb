import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";
import { storageService } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Plus, Trash2, Pencil } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";

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

interface BankInfo {
    id?: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    qrCodeUrl: string;
    status: "active" | "inactive";
    isDisplayed: boolean;
}

interface YouTubeData {
    title: string;
    description: string;
    youtubeLink: string;
}

interface HeaderData {
    title: string;
    title2: string;
    description: string;
    buttonText: string;
    imageUrl: string;
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

    // Bank info states - Multiple banks
    const [banks, setBanks] = useState<BankInfo[]>([]);
    const [currentBank, setCurrentBank] = useState<BankInfo>({
        bankName: "",
        accountNumber: "",
        accountName: "",
        qrCodeUrl: "",
        status: "active",
        isDisplayed: false
    });
    const [editingBankId, setEditingBankId] = useState<string | null>(null);
    const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
    const [qrCodePreview, setQrCodePreview] = useState<string>("");
    const [uploadingBankInfo, setUploadingBankInfo] = useState(false);

    // YouTube states
    const [youtubeData, setYoutubeData] = useState<YouTubeData>({
        title: "",
        description: "",
        youtubeLink: ""
    });
    const [uploadingYoutube, setUploadingYoutube] = useState(false);

    // Header states
    const [headerData, setHeaderData] = useState<HeaderData>({
        title: "",
        title2: "",
        description: "",
        buttonText: "",
        imageUrl: ""
    });
    const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);
    const [headerImagePreview, setHeaderImagePreview] = useState<string>("");
    const [uploadingHeader, setUploadingHeader] = useState(false);

    const [loading, setLoading] = useState(true);
    const [mainTab, setMainTab] = useState<"header" | "intro" | "forWho" | "bankInfo" | "youtube">("header");

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

        // Load Banks
        const { data: banksFromDB } = await firestoreService.getAll("banks");
        if (banksFromDB) {
            setBanks(banksFromDB as BankInfo[]);
        }

        // Load YouTube data
        const { data: youtubeDataFromDB } = await firestoreService.getOne("introduction", "youtube");
        if (youtubeDataFromDB) {
            setYoutubeData(youtubeDataFromDB as YouTubeData);
        }

        // Load Header data
        const { data: headerDataFromDB } = await firestoreService.getOne("introduction", "header");
        if (headerDataFromDB) {
            const data = headerDataFromDB as HeaderData;
            setHeaderData(data);
            setHeaderImagePreview(data.imageUrl || "");
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

    // Bank info handlers
    const handleQRCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setQrCodeFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setQrCodePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Bank handlers - Multiple banks management
    const handleBankSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingBankInfo(true);

        let qrCodeUrl = currentBank.qrCodeUrl;
        if (qrCodeFile) {
            const { url, error } = await storageService.uploadImage(qrCodeFile, "banks");
            if (error) {
                alert("Lỗi khi tải ảnh QR: " + error);
                setUploadingBankInfo(false);
                return;
            }
            qrCodeUrl = url || "";
        }

        const dataToSave = {
            ...currentBank,
            qrCodeUrl
        };

        // Auto-set isDisplayed logic
        const activeBanks = banks.filter(b => b.status === "active" && (!editingBankId || b.id !== editingBankId));
        const willBeActive = dataToSave.status === "active";

        // If this is the only active bank, auto-set isDisplayed = true
        if (willBeActive && activeBanks.length === 0) {
            dataToSave.isDisplayed = true;
        }

        // If setting this bank as displayed, unset others
        if (dataToSave.isDisplayed && willBeActive) {
            const otherActiveBanks = banks.filter(b =>
                b.status === "active" &&
                b.isDisplayed &&
                (!editingBankId || b.id !== editingBankId)
            );

            for (const bank of otherActiveBanks) {
                await firestoreService.update("banks", bank.id!, { isDisplayed: false });
            }
        }

        if (editingBankId) {
            await firestoreService.update("banks", editingBankId, dataToSave);
        } else {
            await firestoreService.add("banks", dataToSave);
        }

        resetBankForm();
        loadData();
        setUploadingBankInfo(false);
        alert("Đã lưu ngân hàng thành công!");
    };

    const handleEditBank = (bank: BankInfo) => {
        setCurrentBank(bank);
        setEditingBankId(bank.id || null);
        setQrCodePreview(bank.qrCodeUrl || "");
    };

    const handleDeleteBank = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa ngân hàng này?")) {
            await firestoreService.delete("banks", id);
            loadData();
        }
    };

    const handleToggleStatus = async (id: string) => {
        const bank = banks.find(b => b.id === id);
        if (!bank) return;

        const newStatus = bank.status === "active" ? "inactive" : "active";
        const updates: Partial<BankInfo> = { status: newStatus };

        // If changing to inactive and it was displayed, unset isDisplayed
        if (newStatus === "inactive" && bank.isDisplayed) {
            updates.isDisplayed = false;
        }

        // If changing to active and it's the only active bank, auto-set isDisplayed
        if (newStatus === "active") {
            const otherActiveBanks = banks.filter(b => b.id !== id && b.status === "active");
            if (otherActiveBanks.length === 0) {
                updates.isDisplayed = true;
            }
        }

        await firestoreService.update("banks", id, updates);
        loadData();
    };

    const handleSetDisplayed = async (id: string) => {
        // Unset all other active banks
        const activeBanks = banks.filter(b => b.status === "active" && b.id !== id && b.isDisplayed);
        for (const bank of activeBanks) {
            await firestoreService.update("banks", bank.id!, { isDisplayed: false });
        }

        // Set this bank as displayed
        await firestoreService.update("banks", id, { isDisplayed: true });
        loadData();
    };

    const resetBankForm = () => {
        setCurrentBank({
            bankName: "",
            accountNumber: "",
            accountName: "",
            qrCodeUrl: "",
            status: "active",
            isDisplayed: false
        });
        setEditingBankId(null);
        setQrCodeFile(null);
        setQrCodePreview("");
    };

    // YouTube handlers
    const handleSubmitYoutube = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingYoutube(true);

        await firestoreService.set("introduction", "youtube", youtubeData);
        setUploadingYoutube(false);
        loadData();
        alert("Đã lưu thông tin YouTube thành công!");
    };

    // Header handlers
    const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeaderImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setHeaderImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitHeader = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingHeader(true);

        let imageUrl = headerData.imageUrl;
        if (headerImageFile) {
            const { url, error } = await storageService.uploadImage(headerImageFile, "introduction/header");
            if (error) {
                alert("Lỗi khi tải ảnh: " + error);
                setUploadingHeader(false);
                return;
            }
            imageUrl = url || "";
        }

        const dataToSave = {
            ...headerData,
            imageUrl
        };

        await firestoreService.set("introduction", "header", dataToSave);
        setHeaderImageFile(null);
        setUploadingHeader(false);
        loadData();
        alert("Đã lưu thông tin đầu trang thành công!");
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="space-y-6">
            <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as "header" | "intro" | "forWho" | "bankInfo" | "youtube")}>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0 h-auto flex-nowrap sm:flex-wrap">
                        <TabsTrigger value="header" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Đầu trang</TabsTrigger>
                        <TabsTrigger value="youtube" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Youtube</TabsTrigger>
                        <TabsTrigger value="intro" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Xin chào</TabsTrigger>
                        <TabsTrigger value="forWho" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Dành cho ai</TabsTrigger>
                        <TabsTrigger value="bankInfo" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">Ngân hàng</TabsTrigger>
                    </TabsList>
                </div>

                {/* Header Tab */}
                <TabsContent value="header" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quản lý Đầu trang</CardTitle>
                            <CardDescription>
                                Chỉnh sửa nội dung hiển thị ở đầu trang chủ
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitHeader} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="headerTitle">Tiêu đề</Label>
                                    <Input
                                        id="headerTitle"
                                        value={headerData.title}
                                        onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                                        placeholder="Nhập tiêu đề..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="headerTitle2">Tiêu đề 2</Label>
                                    <Input
                                        id="headerTitle2"
                                        value={headerData.title2}
                                        onChange={(e) => setHeaderData({ ...headerData, title2: e.target.value })}
                                        placeholder="Nhập tiêu đề 2..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="headerDescription">Mô tả</Label>
                                    <Textarea
                                        id="headerDescription"
                                        value={headerData.description}
                                        onChange={(e) => setHeaderData({ ...headerData, description: e.target.value })}
                                        placeholder="Nhập mô tả..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="headerButtonText">Text Button</Label>
                                    <Input
                                        id="headerButtonText"
                                        value={headerData.buttonText}
                                        onChange={(e) => setHeaderData({ ...headerData, buttonText: e.target.value })}
                                        placeholder="Nhập text button..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Hình ảnh</Label>
                                    <div className="space-y-4">
                                        {headerImagePreview && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={headerImagePreview}
                                                    alt="Header Preview"
                                                    className="max-w-full max-h-[400px] object-contain rounded-lg border border-border"
                                                />
                                                {headerImageFile && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => {
                                                            setHeaderImageFile(null);
                                                            setHeaderImagePreview(headerData.imageUrl);
                                                        }}
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
                                                onChange={handleHeaderImageChange}
                                                className="max-w-sm"
                                            />
                                            <Upload className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" disabled={uploadingHeader}>
                                    {uploadingHeader ? "Đang lưu..." : "Lưu thông tin"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

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
                                            <RichTextEditor
                                                value={section1.description}
                                                onChange={(value) => setSection1({ ...section1, description: value })}
                                                placeholder="Nhập mô tả..."
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
                                                            className="max-w-[200px] max-h-[300px] object-contain rounded-lg border border-border"
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

                                    {/* Display current data - Always visible */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Danh sách Xin chào 1</CardTitle>
                                            <CardDescription>
                                                {section1.title ? "1 mục" : "0 mục"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {section1.title ? (
                                                <div className="p-3 border border-border rounded-lg space-y-2">
                                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0 w-full space-y-2">
                                                            <div>
                                                                <span className="text-xs text-muted-foreground">Tiêu đề:</span>
                                                                <p className="text-sm">{section1.title}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-muted-foreground">Mô tả:</span>
                                                                <p className="text-sm">{section1.description}</p>
                                                            </div>
                                                            {section1.imageUrl && (
                                                                <div>
                                                                    <span className="text-xs text-muted-foreground">Hình ảnh:</span>
                                                                    <img src={section1.imageUrl} alt="Preview" className="mt-2 w-full sm:w-32 h-32 object-cover rounded border" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    // Data is already loaded
                                                                }}
                                                                className="flex-1 sm:flex-none"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={async () => {
                                                                    if (confirm("Bạn có chắc muốn xóa Xin chào 1?")) {
                                                                        await firestoreService.delete("introduction", "section1");
                                                                        setSection1({ title: "", description: "", imageUrl: "" });
                                                                        setImagePreview1("");
                                                                        alert("Đã xóa thành công!");
                                                                    }
                                                                }}
                                                                className="flex-1 sm:flex-none"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-center text-muted-foreground py-8">
                                                    Chưa có dữ liệu. Thêm dữ liệu đầu tiên!
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
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
                                            <RichTextEditor
                                                value={section2.description}
                                                onChange={(value) => setSection2({ ...section2, description: value })}
                                                placeholder="Nhập mô tả..."
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
                                                            className="max-w-[200px] max-h-[300px] object-contain rounded-lg border border-border"
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

                                    {/* Display current data - Always visible */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Danh sách Xin chào 2</CardTitle>
                                            <CardDescription>
                                                {section2.title ? "1 mục" : "0 mục"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {section2.title ? (
                                                <div className="p-3 border border-border rounded-lg space-y-2">
                                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0 w-full space-y-2">
                                                            <div>
                                                                <span className="text-xs text-muted-foreground">Tiêu đề:</span>
                                                                <p className="text-sm">{section2.title}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-muted-foreground">Mô tả:</span>
                                                                <p className="text-sm">{section2.description}</p>
                                                            </div>
                                                            {section2.imageUrl && (
                                                                <div>
                                                                    <span className="text-xs text-muted-foreground">Hình ảnh:</span>
                                                                    <img src={section2.imageUrl} alt="Preview" className="mt-2 w-full sm:w-32 h-32 object-cover rounded border" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    // Data is already loaded
                                                                }}
                                                                className="flex-1 sm:flex-none"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={async () => {
                                                                    if (confirm("Bạn có chắc muốn xóa Xin chào 2?")) {
                                                                        await firestoreService.delete("introduction", "section2");
                                                                        setSection2({ title: "", description: "", imageUrl: "" });
                                                                        setImagePreview2("");
                                                                        alert("Đã xóa thành công!");
                                                                    }
                                                                }}
                                                                className="flex-1 sm:flex-none"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-center text-muted-foreground py-8">
                                                    Chưa có dữ liệu. Thêm dữ liệu đầu tiên!
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
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
                        <CardContent className="space-y-6">
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

                            {/* Display current data - Always visible */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Danh sách Dành cho ai</CardTitle>
                                    <CardDescription>
                                        {forWhoData.title ? "1 mục" : "0 mục"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {forWhoData.title ? (
                                        <div className="p-3 border border-border rounded-lg space-y-2">
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0 w-full space-y-2">
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">Tiêu đề:</span>
                                                        <p className="text-sm">{forWhoData.title}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">Danh sách:</span>
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            {forWhoData.items.map((item, idx) => (
                                                                <li key={idx}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">Hình ảnh:</span>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {forWhoData.image1 && <img src={forWhoData.image1} alt="Image 1" className="w-24 h-24 object-cover rounded border" />}
                                                            {forWhoData.image2 && <img src={forWhoData.image2} alt="Image 2" className="w-24 h-24 object-cover rounded border" />}
                                                            {forWhoData.image3 && <img src={forWhoData.image3} alt="Image 3" className="w-24 h-24 object-cover rounded border" />}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            // Data is already loaded
                                                        }}
                                                        className="flex-1 sm:flex-none"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={async () => {
                                                            if (confirm("Bạn có chắc muốn xóa Dành cho ai?")) {
                                                                await firestoreService.delete("introduction", "forWho");
                                                                setForWhoData({ title: "", items: [""], image1: "", image2: "", image3: "" });
                                                                setForWhoPreviews({ preview1: "", preview2: "", preview3: "" });
                                                                alert("Đã xóa thành công!");
                                                            }
                                                        }}
                                                        className="flex-1 sm:flex-none"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">
                                            Chưa có dữ liệu. Thêm dữ liệu đầu tiên!
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bank Info Tab */}
                <TabsContent value="bankInfo" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin ngân hàng</CardTitle>
                            <CardDescription>
                                Quản lý thông tin tài khoản ngân hàng để nhận thanh toán
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">


                            <form onSubmit={handleBankSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName">Ngân hàng</Label>
                                    <Select
                                        value={currentBank.bankName}
                                        onValueChange={(value) => setCurrentBank({ ...currentBank, bankName: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn ngân hàng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Techcombank">Techcombank</SelectItem>
                                            <SelectItem value="TPBank">TPBank</SelectItem>
                                            <SelectItem value="Vietcombank">Vietcombank</SelectItem>
                                            <SelectItem value="VietinBank">VietinBank</SelectItem>
                                            <SelectItem value="BIDV">BIDV</SelectItem>
                                            <SelectItem value="Agribank">Agribank</SelectItem>
                                            <SelectItem value="MB Bank">MB Bank</SelectItem>
                                            <SelectItem value="ACB">ACB</SelectItem>
                                            <SelectItem value="VPBank">VPBank</SelectItem>
                                            <SelectItem value="Sacombank">Sacombank</SelectItem>
                                            <SelectItem value="HDBank">HDBank</SelectItem>
                                            <SelectItem value="VIB">VIB</SelectItem>
                                            <SelectItem value="SHB">SHB</SelectItem>
                                            <SelectItem value="SeABank">SeABank</SelectItem>
                                            <SelectItem value="OCB">OCB</SelectItem>
                                            <SelectItem value="MSB">MSB</SelectItem>
                                            <SelectItem value="Eximbank">Eximbank</SelectItem>
                                            <SelectItem value="Khác">Khác</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="accountNumber">Số tài khoản</Label>
                                    <Input
                                        id="accountNumber"
                                        value={currentBank.accountNumber}
                                        onChange={(e) => setCurrentBank({ ...currentBank, accountNumber: e.target.value })}
                                        placeholder="Nhập số tài khoản..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="accountName">Tên tài khoản</Label>
                                    <Input
                                        id="accountName"
                                        value={currentBank.accountName}
                                        onChange={(e) => setCurrentBank({ ...currentBank, accountName: e.target.value })}
                                        placeholder="Nhập tên tài khoản..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Trạng thái</Label>
                                    <Select
                                        value={currentBank.status}
                                        onValueChange={(value: "active" | "inactive") => setCurrentBank({ ...currentBank, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Ảnh QR Code</Label>
                                    <div className="space-y-4">
                                        {qrCodePreview && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={qrCodePreview}
                                                    alt="QR Code Preview"
                                                    className="w-full max-w-xs h-auto rounded-lg border border-border"
                                                />
                                                {qrCodeFile && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => {
                                                            setQrCodeFile(null);
                                                            setQrCodePreview(currentBank.qrCodeUrl);
                                                        }}
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
                                                onChange={handleQRCodeChange}
                                                className="max-w-sm"
                                            />
                                            <Upload className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={uploadingBankInfo}>
                                        {uploadingBankInfo ? "Đang lưu..." : editingBankId ? "Cập nhật" : "Thêm ngân hàng"}
                                    </Button>
                                    {editingBankId && (
                                        <Button type="button" variant="outline" onClick={resetBankForm}>
                                            Hủy
                                        </Button>
                                    )}
                                </div>
                            </form>

                            {/* Bank List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Danh sách ngân hàng</CardTitle>
                                    <CardDescription>
                                        {banks.length} ngân hàng
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {banks.length > 0 ? (
                                        <div className="space-y-3">
                                            {banks.map(bank => {
                                                const activeBanks = banks.filter(b => b.status === "active");
                                                const showDisplayRadio = activeBanks.length >= 2 && bank.status === "active";

                                                return (
                                                    <div key={bank.id} className="p-3 border border-border rounded-lg space-y-2">
                                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0 w-full space-y-2">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-xs text-muted-foreground">Ngân hàng:</span>
                                                                    <p className="font-medium text-sm">{bank.bankName}</p>
                                                                    <span className={`text-xs px-2 py-1 rounded ${bank.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                                                        {bank.status}
                                                                    </span>
                                                                    {bank.isDisplayed && (
                                                                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                                                                            Đang hiển thị
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-muted-foreground">Số tài khoản:</span>
                                                                    <p className="text-sm">{bank.accountNumber}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-muted-foreground">Tên tài khoản:</span>
                                                                    <p className="text-sm">{bank.accountName}</p>
                                                                </div>
                                                                {bank.qrCodeUrl && (
                                                                    <div>
                                                                        <span className="text-xs text-muted-foreground">QR Code:</span>
                                                                        <img src={bank.qrCodeUrl} alt="QR" className="w-32 h-32 object-cover rounded border mt-2" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                                                {showDisplayRadio && (
                                                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                                        <input
                                                                            type="radio"
                                                                            name="displayedBank"
                                                                            checked={bank.isDisplayed}
                                                                            onChange={() => handleSetDisplayed(bank.id!)}
                                                                            className="cursor-pointer"
                                                                        />
                                                                        <span>Hiển thị</span>
                                                                    </label>
                                                                )}
                                                                <div className="flex gap-2 w-full sm:w-auto">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleToggleStatus(bank.id!)}
                                                                        className="flex-1 sm:flex-none"
                                                                    >
                                                                        {bank.status === "active" ? "Inactive" : "Active"}
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleEditBank(bank)}
                                                                        className="flex-1 sm:flex-none"
                                                                    >
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleDeleteBank(bank.id!)}
                                                                        className="flex-1 sm:flex-none"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">
                                            Chưa có ngân hàng nào. Thêm ngân hàng đầu tiên!
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* YouTube Tab */}
                <TabsContent value="youtube" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>YouTube</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmitYoutube} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="youtubeTitle">Tiêu đề</Label>
                                    <Input
                                        id="youtubeTitle"
                                        value={youtubeData.title}
                                        onChange={(e) => setYoutubeData({ ...youtubeData, title: e.target.value })}
                                        placeholder="Tiêu đề video..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="youtubeDescription">Mô tả</Label>
                                    <Textarea
                                        id="youtubeDescription"
                                        value={youtubeData.description}
                                        onChange={(e) => setYoutubeData({ ...youtubeData, description: e.target.value })}
                                        placeholder="Mô tả video..."
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="youtubeLink">Link YouTube</Label>
                                    <Input
                                        id="youtubeLink"
                                        type="url"
                                        value={youtubeData.youtubeLink}
                                        onChange={(e) => setYoutubeData({ ...youtubeData, youtubeLink: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={uploadingYoutube}>
                                    {uploadingYoutube ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </form>

                            {/* Display current data - Always visible */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Danh sách YouTube</CardTitle>
                                    <CardDescription>
                                        {youtubeData.title ? "1 mục" : "0 mục"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {youtubeData.title ? (
                                        <div className="p-3 border border-border rounded-lg space-y-2">
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0 w-full space-y-2">
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">Tiêu đề:</span>
                                                        <p className="text-sm">{youtubeData.title}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">Mô tả:</span>
                                                        <p className="text-sm">{youtubeData.description}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground">Link:</span>
                                                        <a
                                                            href={youtubeData.youtubeLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary hover:underline break-all"
                                                        >
                                                            {youtubeData.youtubeLink}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            // Data is already loaded
                                                        }}
                                                        className="flex-1 sm:flex-none"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={async () => {
                                                            if (confirm("Bạn có chắc muốn xóa thông tin YouTube?")) {
                                                                await firestoreService.delete("introduction", "youtube");
                                                                setYoutubeData({ title: "", description: "", youtubeLink: "" });
                                                                alert("Đã xóa thành công!");
                                                            }
                                                        }}
                                                        className="flex-1 sm:flex-none"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">
                                            Chưa có dữ liệu. Thêm dữ liệu đầu tiên!
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default IntroductionManager;
