import { useState, useEffect } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { firestoreService } from "@/services/firestoreService";

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

interface BankInfo {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrCodeUrl: string;
  status: "active" | "inactive";
  isDisplayed: boolean;
}

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterConfig | null>(null);
  const [bankData, setBankData] = useState<BankInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFooterData();
    loadBankData();
  }, []);

  const loadFooterData = async () => {
    setLoading(true);
    const { data } = await firestoreService.getAll("footer");
    if (data && data.length > 0) {
      setFooterData(data[0] as FooterConfig);
    }
    setLoading(false);
  };

  const loadBankData = async () => {
    const { data } = await firestoreService.getAll("banks");
    if (data && data.length > 0) {
      // Find the bank that is set to be displayed
      const displayedBank = (data as BankInfo[]).find((bank: BankInfo) => bank.isDisplayed && bank.status === "active");
      if (displayedBank) {
        setBankData(displayedBank);
      }
    }
  };

  if (loading) {
    return (
      <footer id="contact" className="py-16 bg-secondary/30 border-t border-border/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Đang tải...</p>
        </div>
      </footer>
    );
  }

  if (!footerData) {
    return null;
  }

  // Extract bank abbreviation (capital letters or first letters of each word)
  const getBankAbbreviation = (bankName: string) => {
    // First, try to extract all capital letters (for names like VpBank → VPB)
    const capitals = bankName.match(/[A-Z]/g);
    if (capitals && capitals.length >= 2) {
      return capitals.join('');
    }

    // Fallback: first letters of each word (for names like "Viet Com Bank" → VCB)
    return bankName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <footer id="contact" className="py-16 bg-secondary/30 border-t border-border/30">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Left Side - Contact Info */}
          <div className="space-y-6">
            <h3 className="font-heading text-4xl italic text-primary">
              {footerData.title}
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              {footerData.description}
            </p>
            <div className="space-y-2">
              <p className="text-muted-foreground text-base">Cách khác để liên hệ:</p>
              <ul className="space-y-1 text-base">
                <li className="flex items-center gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Email: <a href={`mailto:${footerData.email}`} className="text-primary hover:underline">{footerData.email}</a></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Phone: <a href={`tel:${footerData.phone}`} className="text-primary hover:underline">{footerData.phone}</a></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Bank Info */}
          <div className="flex justify-center md:justify-end">
            {bankData ? (
              <div className="border-2 border-primary/30 rounded-lg p-8 bg-card shadow-elegant max-w-sm w-full">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-xl">{getBankAbbreviation(bankData.bankName)}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-primary text-lg">{bankData.bankName.toUpperCase()}</h4>
                  <div className="space-y-2 text-left">
                    <p className="font-semibold">Tên TK: {bankData.accountName}</p>
                    <p className="font-semibold">Số TK: {bankData.accountNumber}</p>
                    <p className="font-semibold">Nội dung chuyển: Họ Tên - Email</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-primary/30 rounded-lg p-8 bg-card shadow-elegant max-w-sm w-full">
                <p className="text-center text-muted-foreground">Chưa có thông tin ngân hàng</p>
              </div>
            )}
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {footerData.facebook && (
              <a href={footerData.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {footerData.instagram && (
              <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {footerData.youtube && (
              <a href={footerData.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            )}
            {footerData.tiktok && (
              <a href={footerData.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            )}
          </div>

          {/* Copyright */}
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{footerData.copyright}</p>
            <p className="text-xs text-muted-foreground mt-1">Powered by Lovable</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
