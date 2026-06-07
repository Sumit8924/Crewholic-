/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform } from "framer-motion";

export const Route = createFileRoute("/service")({
    component: ServicePage,
});

// ─── DATA ───────────────────────────────────────────────────────────────────
const services = [
    {
        id: "01",
        title: "Web Development",
        desc: "Pixel-perfect, blazing-fast digital experiences engineered for conversion and scale.",
        longDesc: "Our web development service delivers cutting-edge, responsive websites that drive conversions. We combine modern frameworks with performance optimization to create digital experiences that load instantly and engage users deeply.",
        icon: "⬡",
        accent: "#9B51E0",
        tags: ["React", "Next.js", "TypeScript"],
        deliverables: ["Custom Website", "CMS Integration", "SEO Optimization", "Analytics Setup"],
        timeline: "4-6 weeks",
        type: "service"
    },
    {
        id: "02",
        title: "Digital Marketing",
        desc: "Data-driven campaigns that carve market share and compound returns.",
        longDesc: "Our data-driven marketing campaigns are engineered to dominate your market.",
        icon: "◎",
        accent: "#F2994A",
        tags: ["SEO", "Paid Ads", "Analytics"],
        deliverables: ["SEO Strategy", "PPC Campaigns", "Social Media", "Email Marketing"],
        timeline: "2-3 weeks",
        type: "service"
    },
    {
        id: "03",
        title: "Content Creation",
        desc: "Captivating content that tells your story and drives engagement.",
        longDesc: "From social media content to video production, we create compelling narratives that resonate with your audience.",
        icon: "✧",
        accent: "#4ecdc4",
        tags: ["Video", "Social Media", "Copywriting"],
        deliverables: ["Content Strategy", "Video Production", "Social Posts", "Blog Writing"],
        timeline: "2-4 weeks",
        type: "service"
    },
    {
        id: "04",
        title: "Event Management",
        desc: "Flawless execution of memorable events from concept to completion.",
        longDesc: "We handle every aspect of your event - from planning and coordination to execution and follow-up.",
        icon: "◈",
        accent: "#8b5cf6",
        tags: ["Planning", "Coordination", "Production"],
        deliverables: ["Event Strategy", "Vendor Management", "On-site Coordination", "Post-event Analysis"],
        timeline: "4-8 weeks",
        type: "service"
    },
];

// ─── RENTAL CATEGORIES (nested inside one Rentals parent) ───────────────────
const rentalCategories = [
    {
        id: "rental-cameras",
        title: "Cameras",
        desc: "Professional cameras from Canon, Sony, GoPro and more.",
        longDesc: "Rent high-quality cameras from our premium collection. All cameras are regularly maintained and come with essential accessories.",
        icon: "📷",
        accent: "#9B51E0",
        tags: ["Canon", "Sony", "GoPro", "4K"],
        items: [
            { id: 1, name: "Canon EOS 200d mark2", price: 700, originalPrice: 1200, image: "📷", rating: 4.5, inStock: true, specs: "24.1MP, 4K Video" },
            { id: 2, name: "Canon EOS 200d", price: 600, originalPrice: 1000, image: "📷", rating: 4.3, inStock: true, specs: "24.2MP, Full HD" },
            { id: 3, name: "Canon m50", price: 1500, originalPrice: 2500, image: "📷", rating: 4.6, inStock: true, specs: "24.1MP, 4K, Mirrorless" },
            { id: 4, name: "Sony alpha 7 mark 3", price: 2500, originalPrice: 4000, image: "📷", rating: 4.8, inStock: true, specs: "24.2MP, Full Frame, 4K" },
            { id: 5, name: "Sony alpha 7 mark 4", price: 3000, originalPrice: 5000, image: "📷", rating: 4.9, inStock: true, specs: "33MP, Full Frame, 4K 60fps" },
            { id: 6, name: "Sony zv e10", price: 2000, originalPrice: 3500, image: "📷", rating: 4.7, inStock: true, specs: "24.2MP, 4K, Vlogging" },
            { id: 7, name: "Sony fx3", price: 3500, originalPrice: 5500, image: "📷", rating: 4.9, inStock: true, specs: "10.2MP, 4K 120fps, Cinema" },
            { id: 8, name: "Sony nx100", price: 1500, originalPrice: 2800, image: "📷", rating: 4.4, inStock: true, specs: "Camcorder, 4K" },
            { id: 9, name: "Insta 360 x3", price: 1000, originalPrice: 1800, image: "📷", rating: 4.6, inStock: true, specs: "5.7K, 360° Camera" },
            { id: 10, name: "GoPro 12", price: 800, originalPrice: 1500, image: "🎥", rating: 4.5, inStock: true, specs: "5.3K, Action Camera" },
        ]
    },
    {
        id: "rental-gimbals",
        title: "Gimbals & Stabilizers",
        desc: "Smooth, professional stabilization for flawless footage.",
        longDesc: "Achieve cinema-quality stabilization with our premium gimbal collection. Perfect for dynamic shots and professional videography.",
        icon: "⚖️",
        accent: "#F2994A",
        tags: ["DJI", "Stabilizers", "Smooth Footage"],
        items: [
            { id: 11, name: "DJI RS Mini", price: 1000, originalPrice: 1800, image: "⚖️", rating: 4.7, inStock: true, specs: "Compact, Lightweight" },
            { id: 12, name: "DJI RS4", price: 1500, originalPrice: 2500, image: "⚖️", rating: 4.8, inStock: true, specs: "Professional, Payload 3kg" },
            { id: 13, name: "DJI Mobile Gimbal", price: 400, originalPrice: 800, image: "📱", rating: 4.4, inStock: true, specs: "For Smartphones" },
        ]
    },
    {
        id: "rental-drones",
        title: "Drones",
        desc: "Aerial cinematography that captures breathtaking perspectives.",
        longDesc: "Elevate your content with stunning aerial shots. Our drone fleet offers 4K+ quality and extended flight times.",
        icon: "🚁",
        accent: "#06b6d4",
        tags: ["DJI", "Aerial", "4K"],
        items: [
            { id: 14, name: "DJI Mini 4 Pro", price: 2500, originalPrice: 4500, image: "🚁", rating: 4.9, inStock: true, specs: "4K HDR, 45min Flight" },
            { id: 15, name: "DJI Air 3S", price: 2500, originalPrice: 4200, image: "🚁", rating: 4.8, inStock: true, specs: "Dual Camera, 4K" },
            { id: 16, name: "DJI Neo 2", price: 2000, originalPrice: 3500, image: "🚁", rating: 4.6, inStock: true, specs: "Compact, 4K" },
        ]
    },
];

// ─── PARENT "RENTALS" CARD ──────────────────────────────────────────────────
const rentalsParent = {
    id: "05",
    title: "Rentals",
    desc: "Professional equipment for rent — Cameras, Gimbals, and Drones. Perfect for events, films, and content creation.",
    longDesc: "Premium equipment rental service. Browse our extensive collection of professional cameras, stabilizers, and drones.",
    icon: "🎬",
    accent: "#06b6d4",
    tags: ["Cameras", "Gimbals", "Drones"],
    type: "rental",
    totalItems: rentalCategories.reduce((sum, cat) => sum + cat.items.length, 0),
    categories: rentalCategories,
};

const allCards: any[] = [...services, rentalsParent];

const navItems = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/service" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
];

interface ServiceFormData {
    name: string;
    mobile: string;
    email: string;
    requirements: string;
}

interface RentalFormData {
    name: string;
    mobile: string;
    email: string;
    productId: number;
    productName: string;
    categoryName: string;
    pricePerDay: number;
    rentalDays: number;
    totalPrice: number;
    requirements: string;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
};

const getUserData = () => {
    const user = localStorage.getItem("user");
    if (user) {
        try { return JSON.parse(user); } catch { return null; }
    }
    return null;
};

const gradientStyle = {
    background: "linear-gradient(135deg, #C0C0C0 0%, #FFFFFF 20%, #A8A8A8 40%, #E8E8E8 55%, #888 70%, #FFFFFF 85%, #C0C0C0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
};

// ─── FADE IN ────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 20, className = "", as: Component = "div" }: {
    children: React.ReactNode;
    delay?: number;
    y?: number;
    className?: string;
    as?: any;
}) {
    const MotionComponent = motion[Component as keyof typeof motion] as any || motion.div;
    return (
        <MotionComponent
            initial={{ opacity: 0, y }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </MotionComponent>
    );
}

// ─── CONTACT BUTTON ─────────────────────────────────────────────────────────
function ContactButton({ label = "CONTACT ME", href = "/contact" }: { label?: string; href?: string }) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-block rounded-full font-bold uppercase tracking-wider text-white overflow-hidden px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-xs sm:text-sm md:text-base"
            style={{
                background: "linear-gradient(135deg, #9B51E0 0%, #F2994A 100%)",
                boxShadow: "0 0 20px rgba(155, 81, 224, 0.4), 0 0 40px rgba(242, 153, 74, 0.2)",
            }}
        >
            <span className="relative z-10 whitespace-nowrap">{label}</span>
            <motion.div
                className="absolute inset-0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.4 }}
                style={{ background: "linear-gradient(135deg, #F2994A 0%, #9B51E0 100%)" }}
            />
        </motion.a>
    );
}

// ─── MAGNETIC BUTTON ────────────────────────────────────────────────────────
function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
        y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
    };

    return (
        <motion.div ref={ref} style={{ x: springX, y: springY }} onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }} className={className} onClick={onClick}>
            {children}
        </motion.div>
    );
}

// ─── SCROLL 3D REVEAL ───────────────────────────────────────────────────────
function Scroll3DReveal({
    children, rotateFrom = [20, 0, 0], translateFrom = [0, 80, -120], scaleFrom = 0.8, className = "",
}: {
    children: React.ReactNode;
    rotateFrom?: [number, number, number];
    translateFrom?: [number, number, number];
    scaleFrom?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
    const rotateX = useTransform(scrollYProgress, [0, 1], [rotateFrom[0], 0]);
    const rotateY = useTransform(scrollYProgress, [0, 1], [rotateFrom[1], 0]);
    const rotateZ = useTransform(scrollYProgress, [0, 1], [rotateFrom[2], 0]);
    const x = useTransform(scrollYProgress, [0, 1], [translateFrom[0], 0]);
    const y = useTransform(scrollYProgress, [0, 1], [translateFrom[1], 0]);
    const z = useTransform(scrollYProgress, [0, 1], [translateFrom[2], 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.6, 1]);

    return (
        <div ref={ref} className={className} style={{ perspective: "1200px" }}>
            <motion.div style={{ rotateX, rotateY, rotateZ, x, y, z, scale, opacity }}>
                {children}
            </motion.div>
        </div>
    );
}

// ─── SCROLL 3D CARD ─────────────────────────────────────────────────────────
function Scroll3DCard({ children, index = 0, direction = "up" }: {
    children: React.ReactNode;
    index?: number;
    direction?: "left" | "right" | "up" | "down";
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "center 55%"] });

    const dirMap: Record<string, [number, number, number, number, number, number]> = {
        left: [-8, -15, 3, -40, 30, -60],
        right: [-8, 15, -3, 40, 30, -60],
        up: [-15, 0, 0, 0, 60, -80],
        down: [15, 0, 0, 0, -60, -80],
    };
    const [frX, frY, frZ, frTX, frTY, frTZ] = dirMap[direction];

    const rotateX = useTransform(scrollYProgress, [0, 1], [frX, 0]);
    const rotateY = useTransform(scrollYProgress, [0, 1], [frY, 0]);
    const rotateZ = useTransform(scrollYProgress, [0, 1], [frZ, 0]);
    const x = useTransform(scrollYProgress, [0, 1], [frTX, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [frTY, 0]);
    const z = useTransform(scrollYProgress, [0, 1], [frTZ, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.5, 1]);

    return (
        <div ref={ref} style={{ perspective: "900px" }}>
            <motion.div style={{ rotateX, rotateY, rotateZ, x, y, z, scale, opacity }}>
                {children}
            </motion.div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── NEW: RENTAL CATEGORIES SELECTOR MODAL ──────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function RentalCategoriesModal({ isOpen, onClose, onCategorySelect }: {
    isOpen: boolean;
    onClose: () => void;
    onCategorySelect: (category: typeof rentalCategories[0]) => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-x-2 sm:inset-x-4 top-4 sm:top-16 bottom-4 sm:bottom-16 z-50 overflow-y-auto rounded-2xl sm:rounded-3xl pointer-events-auto"
                    >
                        <div className="relative w-full min-h-full rounded-2xl sm:rounded-3xl overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, rgba(25,25,35,0.98), rgba(15,15,20,0.98))",
                                backdropFilter: "blur(20px)",
                                border: `1px solid rgba(155, 81, 224, 0.5)`,
                                boxShadow: "0 0 60px rgba(155, 81, 224, 0.3)",
                            }}>
                            {/* Header */}
                            <div className="sticky top-0 z-10 p-4 sm:p-6 border-b"
                                style={{
                                    background: "rgba(15,15,20,0.95)",
                                    backdropFilter: "blur(20px)",
                                    borderColor: "rgba(155, 81, 224, 0.3)",
                                }}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                        <div className="text-3xl sm:text-4xl w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(155, 81, 224, 0.2), rgba(242, 153, 74, 0.2))",
                                                border: "1px solid rgba(155, 81, 224, 0.4)",
                                            }}>
                                            🎬
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">Equipment Rentals</h2>
                                            <p className="text-gray-300 text-xs sm:text-sm mt-1">Choose a category to explore our gear</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white text-2xl sm:text-3xl transition-colors active:scale-90 flex-shrink-0"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                                    <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                                        {rentalsParent.totalItems}+ Items Available
                                    </span>
                                    <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                                        Daily Rentals
                                    </span>
                                    <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                        ✓ In Stock
                                    </span>
                                </div>
                            </div>

                            {/* Body — 3 Category Cards */}
                            <div className="p-4 sm:p-6 md:p-8">
                                <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-center mb-6 sm:mb-8"
                                    style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                                    ─ Select Category ─
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
                                    {rentalCategories.map((category, idx) => (
                                        <motion.div
                                            key={category.id}
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onCategorySelect(category)}
                                            className="relative group cursor-pointer rounded-2xl overflow-hidden"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: `2px solid ${category.accent}33`,
                                                backdropFilter: "blur(20px)",
                                            }}
                                        >
                                            {/* Glow on hover */}
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    background: `radial-gradient(circle at center, ${category.accent}22 0%, transparent 70%)`,
                                                }}
                                            />

                                            {/* Top accent line */}
                                            <div
                                                className="absolute top-0 left-0 right-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                                                style={{ background: `linear-gradient(90deg, ${category.accent}, transparent)` }}
                                            />

                                            <div className="relative p-6 sm:p-7 md:p-8 text-center">
                                                {/* Icon */}
                                                <motion.div
                                                    className="text-6xl sm:text-7xl mb-4 sm:mb-5 inline-block"
                                                    whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    {category.icon}
                                                </motion.div>

                                                {/* Title */}
                                                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                                                    {category.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed">
                                                    {category.desc}
                                                </p>

                                                {/* Item count badge */}
                                                <div
                                                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4"
                                                    style={{
                                                        background: `${category.accent}15`,
                                                        border: `1px solid ${category.accent}33`,
                                                    }}
                                                >
                                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: category.accent }}></span>
                                                    <span className="text-xs sm:text-sm font-semibold" style={{ color: category.accent }}>
                                                        {category.items.length} Items Available
                                                    </span>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                                                    {category.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium"
                                                            style={{
                                                                background: "rgba(255,255,255,0.05)",
                                                                color: "rgba(255,255,255,0.5)",
                                                                border: "1px solid rgba(255,255,255,0.08)",
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* CTA Button */}
                                                <motion.div
                                                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white transition-all group-hover:gap-3"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${category.accent}, ${category.accent}AA)`,
                                                        boxShadow: `0 4px 20px ${category.accent}40`,
                                                    }}
                                                >
                                                    Browse {category.title}
                                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Bottom note */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 sm:mt-12 text-center"
                                >
                                    <p className="text-xs sm:text-sm text-gray-400">
                                        💡 Need help choosing? <a href="/contact" className="text-[#F2994A] hover:underline">Contact our team</a> for recommendations
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── SERVICE INQUIRY MODAL ──────────────────────────────────────────────────
function ServiceInquiryModal({ service, isOpen, onClose, onSubmit }: {
    service: typeof services[0] | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ServiceFormData) => Promise<boolean>;
}) {
    const userData = getUserData();
    const [formData, setFormData] = useState<ServiceFormData>({
        name: userData?.name || "",
        mobile: "",
        email: userData?.email || "",
        requirements: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        const user = getUserData();
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const success = await onSubmit(formData);
        setIsSubmitting(false);
        if (success) {
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                setFormData({ name: userData?.name || "", mobile: "", email: userData?.email || "", requirements: "" });
                onClose();
            }, 3000);
        }
    };

    if (!service) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />

                    <AnimatePresence>
                        {showSuccessPopup && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div className="relative max-w-md w-full rounded-2xl overflow-hidden pointer-events-auto shadow-2xl"
                                    style={{ background: "linear-gradient(135deg, rgba(30,30,40,0.98), rgba(20,20,30,0.98))", backdropFilter: "blur(20px)", border: `1px solid ${service.accent}66`, boxShadow: `0 0 60px ${service.accent}40` }}>
                                    <div className="p-5 sm:p-6 text-center">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                                            style={{ background: `${service.accent}20`, border: `2px solid ${service.accent}` }}>
                                            <span className="text-3xl sm:text-4xl">🎉</span>
                                        </motion.div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Thank You!</h3>
                                        <p className="text-gray-300 text-sm sm:text-base mb-2">Thank you for being a part of Crewholic!</p>
                                        <p className="text-gray-400 text-xs sm:text-sm mb-4">Our team will contact you soon.</p>
                                        <div className="p-3 rounded-xl mb-4" style={{ background: `${service.accent}10` }}>
                                            <p className="text-white font-semibold text-sm sm:text-base">{service.title}</p>
                                            <p className="text-xs sm:text-sm" style={{ color: service.accent }}>Timeline: {service.timeline}</p>
                                        </div>
                                    </div>
                                    <motion.div className="h-1 w-full" initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 2.8, ease: "linear" }} style={{ background: service.accent }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none overflow-y-auto"
                    >
                        <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-auto my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                            style={{ background: "linear-gradient(135deg, rgba(25,25,35,0.98), rgba(15,15,20,0.98))", backdropFilter: "blur(20px)", border: `1px solid ${service.accent}66`, boxShadow: `0 25px 50px -12px ${service.accent}40` }}>
                            <div className="sticky top-0 z-10 relative p-4 sm:p-6 border-b" style={{ borderColor: `${service.accent}33`, background: `linear-gradient(90deg, ${service.accent}08, rgba(15,15,20,0.95))`, backdropFilter: "blur(20px)" }}>
                                <div className="flex items-center gap-3 sm:gap-4 pr-10">
                                    <div className="text-3xl sm:text-4xl w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${service.accent}20`, border: `1px solid ${service.accent}44` }}>{service.icon}</div>
                                    <div>
                                        <h2 className="text-lg sm:text-2xl font-bold text-white">{service.title}</h2>
                                        <p className="text-gray-300 text-xs sm:text-sm">Fill out the form to get started</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white text-xl sm:text-2xl transition-colors active:scale-90">×</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Full Name *</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white placeholder-gray-400 text-sm" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Mobile Number *</label>
                                    <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white placeholder-gray-400 text-sm" placeholder="+91 98765 43210" />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Email Address *</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white placeholder-gray-400 text-sm" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Your Requirements *</label>
                                    <textarea name="requirements" required rows={4} value={formData.requirements} onChange={handleChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white placeholder-gray-400 resize-none text-sm" placeholder="Tell us about your project, timeline, and budget..." />
                                </div>
                                <div className="p-3 sm:p-4 rounded-xl" style={{ background: `${service.accent}15`, border: `1px solid ${service.accent}33` }}>
                                    <p className="text-xs text-gray-300 mb-2">Selected Service:</p>
                                    <p className="font-semibold text-white text-sm sm:text-base" style={{ color: service.accent }}>{service.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">Timeline: {service.timeline}</p>
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-full font-bold uppercase tracking-wider text-white text-sm transition-all"
                                    style={{
                                        background: "linear-gradient(135deg, #9B51E0 0%, #F2994A 100%)",
                                        boxShadow: "0 0 30px rgba(155, 81, 224, 0.4)",
                                    }}
                                >
                                    {isSubmitting ? "Sending..." : "Submit Inquiry →"}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── RENTAL PRODUCTS MODAL (with Back button) ───────────────────────────────
function RentalProductsModal({ category, isOpen, onClose, onBack, onRentClick }: {
    category: typeof rentalCategories[0] | null;
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onRentClick: (product: any) => void;
}) {
    if (!category) return null;
    const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-md z-50" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-x-2 sm:inset-x-4 top-4 sm:top-20 bottom-4 sm:bottom-20 z-50 overflow-y-auto rounded-2xl sm:rounded-3xl pointer-events-auto"
                    >
                        <div className="relative w-full min-h-full rounded-2xl sm:rounded-3xl overflow-hidden"
                            style={{ background: "linear-gradient(135deg, rgba(25,25,35,0.98), rgba(15,15,20,0.98))", backdropFilter: "blur(20px)", border: `1px solid ${category.accent}66` }}>
                            <div className="sticky top-0 z-10 p-4 sm:p-6 border-b" style={{ background: "rgba(15,15,20,0.95)", backdropFilter: "blur(20px)", borderColor: `${category.accent}33` }}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                        {/* Back button */}
                                        <button
                                            onClick={onBack}
                                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors active:scale-90 flex-shrink-0"
                                            title="Back to categories"
                                        >
                                            ←
                                        </button>
                                        <div className="text-3xl sm:text-4xl w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${category.accent}20`, border: `1px solid ${category.accent}44` }}>{category.icon}</div>
                                        <div className="min-w-0">
                                            <h2 className="text-lg sm:text-2xl font-bold text-white">{category.title}</h2>
                                            <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-2">{category.longDesc}</p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white text-2xl sm:text-3xl transition-colors active:scale-90 flex-shrink-0">×</button>
                                </div>
                                <p className="text-gray-300 text-xs sm:text-sm mt-3 sm:mt-4">{category.items.length} equipment available for rent</p>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                                    {category.items.map((product, idx) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                            whileTap={{ scale: 0.98 }}
                                            className="rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer"
                                            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)" }}
                                            onClick={() => onRentClick(product)}
                                        >
                                            <div className="p-4 sm:p-5">
                                                <div className="text-5xl sm:text-6xl text-center py-3 sm:py-4">{product.image}</div>
                                                <h3 className="font-bold text-base sm:text-lg text-white mb-2">{product.name}</h3>
                                                <p className="text-gray-300 text-xs mb-3">{product.specs}</p>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-yellow-400 text-xs sm:text-sm">★ {product.rating}</span>
                                                    <span className="text-gray-300 text-[10px] sm:text-xs">(120+ reviews)</span>
                                                </div>
                                                <div className="mb-2 sm:mb-3">
                                                    <span className="text-xl sm:text-2xl font-bold" style={{ color: category.accent }}>{formatPrice(product.price)}</span>
                                                    <span className="text-gray-400 line-through text-xs sm:text-sm ml-2">{formatPrice(product.originalPrice)}</span>
                                                </div>
                                                <span className="text-green-400 text-xs block mb-1">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
                                                <p className="text-gray-300 text-xs mb-3">per day</p>
                                                {product.inStock && <span className="inline-block text-green-400 text-xs mb-3 font-medium">✓ In Stock</span>}
                                                <motion.button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRentClick(product);
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all text-white"
                                                    style={{ background: `linear-gradient(135deg, ${category.accent}, ${category.accent}CC)` }}
                                                >
                                                    Rent Now →
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── RENTAL CHECKOUT MODAL ──────────────────────────────────────────────────
function RentalCheckoutModal({ product, category, isOpen, onClose, onSubmit }: {
    product: any;
    category: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RentalFormData) => Promise<boolean>;
}) {
    const userData = getUserData();
    const [rentalDays, setRentalDays] = useState(1);
    const [formData, setFormData] = useState({
        name: userData?.name || "",
        mobile: "",
        email: userData?.email || "",
        requirements: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const totalPrice = product ? product.price * rentalDays : 0;
    const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

    useEffect(() => {
        const user = getUserData();
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !product) return;
        setIsSubmitting(true);
        const success = await onSubmit({ ...formData, productId: product.id, productName: product.name, categoryName: category.title, pricePerDay: product.price, rentalDays, totalPrice });
        setIsSubmitting(false);
        if (success) {
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                setFormData({ name: userData?.name || "", mobile: "", email: userData?.email || "", requirements: "" });
                setRentalDays(1);
                onClose();
            }, 3000);
        }
    };

    if (!product || !category) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />

                    <AnimatePresence>
                        {showSuccessPopup && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div className="relative max-w-md w-full rounded-2xl overflow-hidden pointer-events-auto shadow-2xl"
                                    style={{ background: "linear-gradient(135deg, rgba(30,30,40,0.98), rgba(20,20,30,0.98))", backdropFilter: "blur(20px)", border: `1px solid ${category.accent}66`, boxShadow: `0 0 60px ${category.accent}40` }}>
                                    <div className="p-5 sm:p-6 text-center">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                                            style={{ background: `${category.accent}20`, border: `2px solid ${category.accent}` }}>
                                            <span className="text-3xl sm:text-4xl">🎉</span>
                                        </motion.div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Thank You!</h3>
                                        <p className="text-gray-300 text-sm sm:text-base mb-2">Thank you for being a part of Crewholic!</p>
                                        <p className="text-gray-400 text-xs sm:text-sm mb-4">Our team will contact you soon.</p>
                                        <div className="p-3 rounded-xl mb-4" style={{ background: `${category.accent}10` }}>
                                            <p className="text-xs text-gray-400">Order Summary</p>
                                            <p className="text-white font-semibold text-sm sm:text-base">{product.name}</p>
                                            <p className="text-xs sm:text-sm" style={{ color: category.accent }}>{formatPrice(totalPrice)} for {rentalDays} day(s)</p>
                                        </div>
                                    </div>
                                    <motion.div className="h-1 w-full" initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 2.8, ease: "linear" }} style={{ background: category.accent }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 pointer-events-none overflow-y-auto"
                    >
                        <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-auto my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
                            style={{ background: "linear-gradient(135deg, rgba(25,25,35,0.98), rgba(15,15,20,0.98))", backdropFilter: "blur(20px)", border: `1px solid ${category.accent}66`, boxShadow: `0 0 40px ${category.accent}20` }}>
                            <div className="sticky top-0 z-10 relative p-4 sm:p-6 border-b" style={{ borderColor: `${category.accent}33`, background: `linear-gradient(90deg, ${category.accent}08, rgba(15,15,20,0.95))`, backdropFilter: "blur(20px)" }}>
                                <div className="flex items-center gap-3 pr-10">
                                    <div className="text-2xl sm:text-3xl flex-shrink-0">{product.image}</div>
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-2xl font-bold text-white">Complete Your Rental</h2>
                                        <p className="text-gray-300 text-xs sm:text-sm mt-0.5 truncate">{product.name}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white text-2xl sm:text-3xl transition-colors active:scale-90">×</button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="text-6xl sm:text-8xl bg-white/10 rounded-2xl p-6 sm:p-8 text-center" style={{ border: `1px solid ${category.accent}44` }}>{product.image}</div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white text-center">{product.name}</h3>
                                    <div className="text-center">
                                        <span className="text-yellow-400 text-sm sm:text-base">★ {product.rating}</span>
                                        <span className="text-gray-300 ml-2 text-xs sm:text-sm">(120+ reviews)</span>
                                        {product.inStock && <div className="text-green-400 text-xs sm:text-sm mt-2 font-medium">✓ In Stock</div>}
                                    </div>
                                    <div className="text-center p-3 sm:p-4 rounded-xl" style={{ background: `${category.accent}15` }}>
                                        <span className="text-2xl sm:text-3xl font-bold" style={{ color: category.accent }}>{formatPrice(product.price)}</span>
                                        <span className="text-gray-400 line-through ml-2 text-sm">{formatPrice(product.originalPrice)}</span>
                                        <div className="text-green-400 mt-1 text-xs sm:text-sm font-medium">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</div>
                                        <p className="text-gray-300 text-xs sm:text-sm mt-1">per day</p>
                                    </div>
                                    <div className="p-3 sm:p-4 rounded-xl bg-white/10">
                                        <h4 className="text-white text-xs sm:text-sm font-semibold mb-2">Key Features:</h4>
                                        <p className="text-gray-300 text-xs sm:text-sm">{product.specs}</p>
                                    </div>
                                </div>
                                <div>
                                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Full Name *</label>
                                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white placeholder-gray-400 transition-all text-sm" placeholder="Enter your full name" />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Mobile Number *</label>
                                            <input type="tel" required value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white placeholder-gray-400 transition-all text-sm" placeholder="+91 98765 43210" />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Email Address *</label>
                                            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white placeholder-gray-400 transition-all text-sm" placeholder="you@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Rental Duration (Days) *</label>
                                            <input type="number" min="1" max="30" required value={rentalDays} onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white transition-all text-sm" />
                                        </div>
                                        <div className="p-3 sm:p-4 rounded-xl" style={{ background: `${category.accent}15`, border: `1px solid ${category.accent}33` }}>
                                            <p className="text-white text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Price Summary</p>
                                            <div className="flex justify-between py-1.5 sm:py-2 text-xs sm:text-sm"><span className="text-gray-300">Daily Rate:</span><span className="text-white font-medium">{formatPrice(product.price)}</span></div>
                                            <div className="flex justify-between py-1.5 sm:py-2 text-xs sm:text-sm"><span className="text-gray-300">Number of Days:</span><span className="text-white font-medium">{rentalDays}</span></div>
                                            <div className="flex justify-between pt-2 sm:pt-3 mt-1 border-t" style={{ borderColor: `${category.accent}33` }}>
                                                <span className="text-white font-semibold text-sm sm:text-base">Total Amount:</span>
                                                <span className="font-bold text-xl sm:text-2xl" style={{ color: category.accent }}>{formatPrice(totalPrice)}</span>
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3">⚠️ Security deposit may be required</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-200">Special Requests</label>
                                            <textarea rows={3} value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 focus:border-[#9B51E0] focus:outline-none focus:ring-1 focus:ring-[#9B51E0] text-white placeholder-gray-400 resize-none transition-all text-sm" placeholder="Delivery location, pickup time, special instructions..." />
                                        </div>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-wider text-white text-sm transition-all"
                                            style={{
                                                background: "linear-gradient(135deg, #9B51E0 0%, #F2994A 100%)",
                                                boxShadow: "0 0 30px rgba(155, 81, 224, 0.4)",
                                            }}
                                        >
                                            {isSubmitting ? "Processing..." : "Confirm Rental →"}
                                        </motion.button>
                                        <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2 sm:mt-3">By confirming, you agree to our rental terms and conditions</p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── SERVICE CARD ───────────────────────────────────────────────────────────
function ServiceCard({ item, index, onClick }: { item: any; index: number; onClick: () => void }) {
    const [hovered, setHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 12);
        rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 12);
    };

    const isRental = item.type === "rental";
    const dirs: Array<"left" | "right" | "up" | "down"> = ["left", "up", "right", "down", "left"];

    return (
        <Scroll3DCard index={index} direction={dirs[index % dirs.length]}>
            <motion.div
                ref={cardRef}
                style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 800 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => { rotateX.set(0); rotateY.set(0); setHovered(false); }}
                onClick={onClick}
                className="relative group cursor-pointer h-full active:scale-95 transition-transform"
            >
                <motion.div animate={{ opacity: hovered ? 1 : 0 }} className="absolute inset-0 rounded-2xl blur-xl -z-10" style={{ background: `radial-gradient(ellipse at center, ${item.accent}33 0%, transparent 70%)` }} />
                <div className="relative rounded-2xl p-4 sm:p-5 md:p-6 h-full border transition-all duration-300 flex flex-col"
                    style={{
                        background: isRental
                            ? "linear-gradient(135deg, rgba(155, 81, 224, 0.08), rgba(242, 153, 74, 0.08))"
                            : "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(20px)",
                        borderColor: hovered ? item.accent + "55" : isRental ? "rgba(155, 81, 224, 0.3)" : "rgba(255,255,255,0.1)"
                    }}>

                    {/* Special badge for Rentals */}
                    {isRental && (
                        <div
                            className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
                            style={{
                                background: "linear-gradient(135deg, #9B51E0, #F2994A)",
                                color: "#fff",
                                boxShadow: "0 4px 15px rgba(155, 81, 224, 0.4)",
                            }}
                        >
                            New
                        </div>
                    )}

                    <div className="text-[10px] sm:text-xs font-mono mb-3 sm:mb-4 tracking-widest" style={{ color: item.accent + "cc" }}>{item.id}</div>
                    <motion.div animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 10 : 0 }} className="text-3xl sm:text-4xl mb-3 sm:mb-5" style={{ color: item.accent }}>{item.icon}</motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 tracking-tight text-white">{item.title}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-5 text-gray-300 flex-1">{item.desc}</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        {item.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase font-medium" style={{ background: item.accent + "20", color: item.accent, border: `1px solid ${item.accent}33` }}>{tag}</span>
                        ))}
                    </div>
                    {isRental && (
                        <div className="text-[11px] sm:text-xs text-gray-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.accent }}></span>
                            {item.totalItems}+ items across 3 categories
                        </div>
                    )}
                    <motion.div animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }} className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-xs sm:text-sm" style={{ color: item.accent }}>
                        {isRental ? "Browse Categories →" : "Inquire →"}
                    </motion.div>
                </div>
            </motion.div>
        </Scroll3DCard>
    );
}

// ─── MAIN SERVICE PAGE ──────────────────────────────────────────────────────
function ServicePage() {
    const navigate = useNavigate();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

    // NEW: Rental flow states
    const [isRentalCategoriesOpen, setIsRentalCategoriesOpen] = useState(false);
    const [selectedRentalCategory, setSelectedRentalCategory] = useState<typeof rentalCategories[0] | null>(null);
    const [isRentalProductsModalOpen, setIsRentalProductsModalOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap";
        document.head.appendChild(link);
        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleCardClick = (item: any) => {
        if (!isUserLoggedIn()) {
            navigate({
                to: "/login",
                state: {
                    returnTo: "/service",
                    message: "Please login or signup to continue with your inquiry."
                }
            });
            return;
        }

        if (item.type === "service") {
            setSelectedService(item);
            setIsServiceModalOpen(true);
        } else if (item.type === "rental") {
            // Open the categories selector first
            setIsRentalCategoriesOpen(true);
        }
    };

    // NEW: When a category is selected from the categories modal
    const handleCategorySelect = (category: typeof rentalCategories[0]) => {
        setSelectedRentalCategory(category);
        setIsRentalCategoriesOpen(false);
        setIsRentalProductsModalOpen(true);
    };

    // NEW: Back to categories from products
    const handleBackToCategories = () => {
        setIsRentalProductsModalOpen(false);
        setSelectedRentalCategory(null);
        setIsRentalCategoriesOpen(true);
    };

    const handleRentClick = (product: any) => {
        if (!isUserLoggedIn()) {
            navigate({
                to: "/login",
                state: {
                    returnTo: "/service",
                    message: "Please login or signup to continue with your rental."
                }
            });
            return;
        }
        setSelectedProduct(product);
        setIsRentalProductsModalOpen(false);
        setIsCheckoutModalOpen(true);
    };

    const handleServiceSubmit = async (data: ServiceFormData): Promise<boolean> => {
        try {
            if (!selectedService) return false;
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiUrl}/api/service-inquiry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ service: selectedService.title, timeline: selectedService.timeline, ...data }),
            });
            return res.ok;
        } catch { return false; }
    };

    // Replace your existing handleRentalSubmit function
    const handleRentalSubmit = async (data: RentalFormData): Promise<boolean> => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

            const payload = {
                name: data.name,
                mobile: data.mobile,
                email: data.email,
                productId: data.productId,
                productName: data.productName,
                categoryName: data.categoryName,
                pricePerDay: data.pricePerDay,
                rentalDays: data.rentalDays,
                totalPrice: data.totalPrice,
                requirements: data.requirements,
            };

            const res = await fetch(`${apiUrl}/api/rental-inquiry`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Include auth token if available
                    ...(localStorage.getItem("token") && {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    })
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                console.error("Rental submission failed:", result.message);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Network error:", error);
            return false;
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}>
            <motion.div
                className="fixed pointer-events-none z-50 rounded-full hidden md:block"
                style={{
                    width: 400, height: 400,
                    background: "radial-gradient(circle, rgba(155,81,224,0.08) 0%, transparent 70%)",
                    x: mousePos.x - 200, y: mousePos.y - 200,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
            />

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col" style={{ overflowX: "clip" }}>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="fixed top-4 right-4 z-50 md:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 active:scale-95 transition-transform"
                    aria-label="Menu"
                >
                    <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                    <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
                                {navItems.map((item, idx) => (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="text-2xl font-medium uppercase tracking-wider hover:text-[#F2994A] transition-colors duration-200"
                                        style={{
                                            color: item.label === "Services" ? "#F2994A" : "#D7E2EA",
                                        }}
                                    >
                                        {item.label}
                                    </motion.a>
                                ))}
                                <motion.a
                                    href="/login"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-2xl font-medium uppercase tracking-wider hover:text-[#F2994A] transition-colors duration-200"
                                    style={{ color: "#D7E2EA" }}
                                >
                                    Signup/Login
                                </motion.a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <FadeIn
                    as="nav"
                    delay={0}
                    y={-20}
                    className="hidden md:flex justify-between px-6 md:px-10 pt-6 md:pt-8"
                >
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200"
                            style={{
                                color: item.label === "Services" ? "#F2994A" : "#D7E2EA",
                            }}
                        >
                            {item.label}
                        </a>
                    ))}

                    <a
                        href="/login"
                        className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200 flex items-center gap-2"
                        style={{ color: "#D7E2EA" }}
                    >
                        👋 SUMIT
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </a>
                </FadeIn>

                <div className="flex-1 flex flex-col justify-center relative px-4 pt-16 md:pt-0">
                    <div className="w-full overflow-hidden flex justify-center">
                        <FadeIn delay={0.15} y={40} className="w-full flex justify-center">
                            <h1
                                className="hero-heading font-black uppercase tracking-tight leading-none text-center"
                                style={{
                                    ...gradientStyle,
                                    fontSize: "min(15vw, 10vw, 280px)",
                                    fontFamily: "'Syne', sans-serif",
                                    letterSpacing: "-0.04em",
                                    whiteSpace: "nowrap",
                                    lineHeight: "0.9",
                                    padding: "0 8px",
                                }}
                            >
                                Services
                            </h1>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.4} y={20} className="flex justify-center mt-4 sm:mt-6">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-px w-8 sm:w-12 md:w-24" style={{ background: "linear-gradient(90deg, transparent, #9B51E0)" }} />
                            <span className="text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                                Services & Rentals
                            </span>
                            <div className="h-px w-8 sm:w-12 md:w-24" style={{ background: "linear-gradient(90deg, #F2994A, transparent)" }} />
                        </div>
                    </FadeIn>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 sm:px-6 md:px-10 pb-5 sm:pb-7 md:pb-10 relative z-20 gap-4">
                    <FadeIn delay={0.35} y={20} className="w-full sm:w-auto">
                        <p
                            className="font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[260px] text-[10px] sm:text-xs md:text-sm lg:text-base"
                            style={{ color: "#D7E2EA" }}
                        >
                            PREMIUM DIGITAL SERVICES + PROFESSIONAL EQUIPMENT RENTAL
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.5} y={20} className="w-full sm:w-auto flex justify-end">
                        <ContactButton label="GET STARTED" href="#all-services" />
                    </FadeIn>
                </div>
            </section>

            {/* STATS */}
            <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, 0, 0]} translateFrom={[0, 60, -80]} scaleFrom={0.85}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
                        {[
                            { value: "4", label: "Core Services", icon: "⚡" },
                            { value: "16+", label: "Equipment Items", icon: "📷" },
                            { value: "24/7", label: "Support", icon: "💬" },
                            { value: "100%", label: "Satisfaction", icon: "⭐" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="p-4 sm:p-6 rounded-2xl text-center"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1"
                                    style={{
                                        background: "linear-gradient(135deg, #9B51E0, #F2994A)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-[10px] sm:text-xs md:text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </Scroll3DReveal>
            </section>

            {/* SERVICES & RENTALS GRID */}
            <section id="all-services" className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, -8, 0]} translateFrom={[40, 60, -80]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Explore All ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            What We Offer
                        </h2>
                    </div>
                </Scroll3DReveal>

                {/* 5 cards now: 4 services + 1 unified Rentals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 max-w-7xl mx-auto">
                    {allCards.map((item, i) => (
                        <ServiceCard key={item.id} item={item} index={i} onClick={() => handleCardClick(item)} />
                    ))}
                </div>
            </section>

            {/* PROCESS */}
            <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[0, 30, 0]} translateFrom={[-60, 40, -80]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ How It Works ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Simple Process
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {[
                        { step: "01", title: "Choose Service", description: "Select a service or rental that fits your project needs." },
                        { step: "02", title: "Fill Form", description: "Provide your details and requirements through our simple form." },
                        { step: "03", title: "We Connect", description: "Our team reaches out within 24 hours to discuss your project." },
                        { step: "04", title: "Get Started", description: "We deliver high-quality results on time, every time." },
                    ].map((item, index) => {
                        const rotations: Array<[number, number, number]> = [[-15, 20, 5], [-15, -20, -5], [15, 20, -5], [15, -20, 5]];
                        return (
                            <Scroll3DReveal
                                key={index}
                                rotateFrom={rotations[index % rotations.length]}
                                translateFrom={[index % 2 === 0 ? -40 : 40, 60, -90]}
                                scaleFrom={0.7}
                            >
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="p-4 sm:p-5 md:p-6 rounded-2xl text-center h-full"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <div
                                        className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-3"
                                        style={{
                                            background: "linear-gradient(135deg, #9B51E0, #F2994A)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            opacity: 0.8,
                                        }}
                                    >
                                        {item.step}
                                    </div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3" style={{ color: "#F2994A" }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            </Scroll3DReveal>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at center, #9B51E0 0%, transparent 65%)" }} />

                <Scroll3DReveal rotateFrom={[30, 0, 0]} translateFrom={[0, 100, -200]} scaleFrom={0.65}>
                    <div className="relative z-10">
                        <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-4 sm:mb-6" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Need Custom Requirements? ─
                        </p>
                        <h2
                            className="font-black leading-[1.1] sm:leading-[1.2] tracking-tighter mb-6 sm:mb-8 md:mb-10 uppercase"
                            style={{ ...gradientStyle, fontSize: "clamp(1.75rem, 7vw, 5rem)", fontFamily: "'Syne', sans-serif" }}
                        >
                            Let's Talk<br />About Your<br />Project.
                        </h2>
                        <ContactButton label="Contact Us" href="/contact" />
                    </div>
                </Scroll3DReveal>
            </section>

            {/* FOOTER */}
            <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-center" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}>
                    © 2025 Crewholic. All rights reserved.
                </span>
                <div className="flex gap-4 sm:gap-6">
                    <a href="#" className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:text-[#F2994A] transition-colors" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>Privacy</a>
                    <a href="#" className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:text-[#F2994A] transition-colors" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>Terms</a>
                </div>
            </div>

            {/* MODALS — NEW FLOW: Rentals → Categories → Products → Checkout */}
            <ServiceInquiryModal
                service={selectedService}
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                onSubmit={handleServiceSubmit}
            />

            {/* NEW: Categories selector modal */}
            <RentalCategoriesModal
                isOpen={isRentalCategoriesOpen}
                onClose={() => setIsRentalCategoriesOpen(false)}
                onCategorySelect={handleCategorySelect}
            />

            {/* Products list (with Back button) */}
            <RentalProductsModal
                category={selectedRentalCategory}
                isOpen={isRentalProductsModalOpen}
                onClose={() => setIsRentalProductsModalOpen(false)}
                onBack={handleBackToCategories}
                onRentClick={handleRentClick}
            />

            <RentalCheckoutModal
                product={selectedProduct}
                category={selectedRentalCategory}
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                onSubmit={handleRentalSubmit}
            />
        </div>
    );
}

export default ServicePage;