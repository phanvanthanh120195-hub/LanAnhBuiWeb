import { useState, useEffect } from "react";
import { firestoreService } from "@/services/firestoreService";

interface MenuItem {
    id?: string;
    label: string;
    href: string;
    order: number;
}

interface LogoData {
    logoUrl: string;
}

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [logoUrl, setLogoUrl] = useState<string>("/logo.png"); // fallback
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
            setLogoUrl(logo.logoUrl || "/logo.png");
        }
    };

    const handleMenuClick = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        // Handle home separately
        if (href === "#home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // For other sections, find and scroll to the element
        const targetId = href.replace("#", "");
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const headerOffset = 100; // Offset for fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20 lg:h-24">
                    {/* Logo */}
                    <a href="#home" className="flex-shrink-0" onClick={(e) => handleLinkClick(e, "#home")}>
                        <img
                            src={logoUrl}
                            alt="THE FASHION K."
                            className="h-12 lg:h-16 w-auto object-contain border-0"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                        {menuItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleLinkClick(e, item.href)}
                                className="text-sm lg:text-base font-medium text-foreground/70 hover:text-primary transition-colors duration-200 tracking-wide uppercase"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={handleMenuClick}
                        className="md:hidden p-2 text-foreground/70 hover:text-primary transition-colors"
                        aria-label="Menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <nav className="py-4 space-y-2 border-t border-border/30">
                        {menuItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleLinkClick(e, item.href)}
                                className="block py-3 px-4 text-base font-medium text-foreground/70 hover:text-primary hover:bg-secondary/30 rounded-sm transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
