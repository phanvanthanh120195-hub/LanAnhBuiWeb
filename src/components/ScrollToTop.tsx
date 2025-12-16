import { useState, useEffect } from "react";
import { Facebook, Phone } from "lucide-react";
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

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [footerData, setFooterData] = useState<FooterConfig | null>(null);

    // Load footer data from Firebase
    useEffect(() => {
        const loadFooterData = async () => {
            const { data } = await firestoreService.getAll("footer");
            if (data && data.length > 0) {
                setFooterData(data[0] as FooterConfig);
            }
        };
        loadFooterData();
    }, []);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
            {/* Facebook Button - Always visible */}
            {footerData?.facebook && (
                <a
                    href={footerData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-[#1877F2] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
                    aria-label="Facebook"
                >
                    <Facebook className="w-6 h-6 text-white" />
                </a>
            )}

            {/* Zalo Button */}
            {footerData?.zalo && (
                <a
                    href={footerData.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0068FF] via-[#0180FF] to-[#2962FF] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
                    aria-label="Zalo"
                >
                    <svg
                        className="w-8 h-8"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10c4.722,0,8.883-2.348,11.417-5.931V36H15z" />
                        <path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z" />
                        <path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z" />
                        <path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z" />
                        <path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z" />
                        <path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z" />
                    </svg>
                </a>
            )}

            {/* Messenger Button */}
            {footerData?.messenger && (
                <a
                    href={footerData.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00B2FF] to-[#006AFF] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
                    aria-label="Messenger"
                >
                    <svg
                        className="w-7 h-7 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12,2C6.36,2,2,6.13,2,11.7c0,2.91,1.19,5.44,3.14,7.17c0.15,0.13,0.24,0.33,0.24,0.53l0.01,2.22c0,0.26,0.27,0.43,0.51,0.32l2.49-1.17c0.12-0.06,0.26-0.07,0.39-0.03c0.87,0.28,1.79,0.43,2.75,0.43c5.64,0,9.86-4.13,9.86-9.7S17.64,2,12,2z M13.03,14.41l-2.37-2.53c-0.2-0.21-0.53-0.22-0.75-0.03l-2.26,1.69c-0.29,0.22-0.65-0.11-0.48-0.43l2.37-4.53c0.11-0.21,0.38-0.26,0.56-0.11l2.37,2.53c0.2,0.21,0.53,0.22,0.75,0.03l2.26-1.69c0.29-0.22,0.65,0.11,0.48,0.43l-2.37,4.53C13.48,14.51,13.21,14.56,13.03,14.41z" />
                    </svg>
                </a>
            )}

            {/* Phone Button */}
            {footerData?.phone && (
                <a
                    href={`tel:${footerData.phone.replace(/\s/g, '')}`}
                    className="w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
                    aria-label="Phone"
                >
                    <Phone className="w-6 h-6 text-white" />
                </a>
            )}

            {/* Scroll to Top Button - Only visible when scrolled */}
            <button
                onClick={scrollToTop}
                className={`w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border border-border/20 hover:scale-110 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                    }`}
                aria-label="Scroll to top"
            >
                <svg
                    className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
};

export default ScrollToTop;
