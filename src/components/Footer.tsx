import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-secondary/30 border-t border-border/30">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Left Side - Contact Info */}
          <div className="space-y-6">
            <h3 className="font-heading text-4xl italic text-primary">
              Vui lòng chuyển khoản theo thông tin bên cạnh
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              Nếu bạn có thắc mắc hay câu hỏi gì vui lòng sử dụng chat messenger bên góc phải màn hình để nhanh chóng được giải đáp.
            </p>
            <div className="space-y-2">
              <p className="text-muted-foreground text-base">Cách khác để liên hệ Kiquy:</p>
              <ul className="space-y-1 text-base">
                <li className="flex items-center gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Email: <a href="mailto:kiquypham111@gmail.com" className="text-primary hover:underline">kiquypham111@gmail.com</a></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Phone: <a href="tel:0937219111" className="text-primary hover:underline">0937219111</a></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Bank Info */}
          <div className="flex justify-center md:justify-end">
            <div className="border-2 border-primary/30 rounded-lg p-8 bg-card shadow-elegant max-w-sm w-full">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">TCB</span>
                  </div>
                </div>
                <h4 className="font-bold text-primary text-lg">TECHCOMBANK</h4>
                <div className="space-y-2 text-left">
                  <p className="font-semibold">Tên TK: Phạm Thị Kim Quyên</p>
                  <p className="font-semibold">Số TK: 19029727948022</p>
                  <p className="font-semibold">Nội dung chuyển: Họ Tên - Email</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-right">
            <p className="text-sm text-muted-foreground">© 2025 Kiquy Phạm</p>
            <p className="text-xs text-muted-foreground mt-1">Powered by Lovable</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
