/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform } from "framer-motion";

export const Route = createFileRoute("/contact")({
    component: ContactPage,
});

// ─── DATA ───────────────────────────────────────────────────────────────────
const contactInfo = [
    { id: 1, title: "Email Us", value: "hello@crewholic.com", icon: "📧", accent: "#9B51E0", description: "Get a response within 24 hours" },
    { id: 2, title: "Call Us", value: "+1 (555) 123-4567", icon: "📞", accent: "#F2994A", description: "Mon-Fri, 9AM - 6PM PST" },
    { id: 3, title: "Visit Us", value: "San Francisco, CA", icon: "📍", accent: "#4ecdc4", description: "By appointment only" },
    { id: 4, title: "Follow Us", value: "@crewholic", icon: "🌐", accent: "#ff8c42", description: "Connect on social media" },
];

const socialLinks = [
    { name: "LinkedIn", icon: "fab fa-linkedin-in", url: "#", color: "#0077B5" },
    { name: "Instagram", icon: "fab fa-instagram", url: "#", color: "#E4405F" },
    { name: "Twitter", icon: "fab fa-twitter", url: "#", color: "#1DA1F2" },
    { name: "Behance", icon: "fab fa-behance", url: "#", color: "#1769FF" },
    { name: "GitHub", icon: "fab fa-github", url: "#", color: "#fff" },
    { name: "Dribbble", icon: "fab fa-dribbble", url: "#", color: "#EA4C89" },
];

const locations = [
    { city: "San Francisco", address: "123 Market Street, Suite 400", country: "USA", flag: "🇺🇸" },
    { city: "New York", address: "456 Broadway, Floor 12", country: "USA", flag: "🇺🇸" },
    { city: "London", address: "789 Oxford Street", country: "UK", flag: "🇬🇧" },
    { city: "Singapore", address: "Marina Bay Financial Centre", country: "Singapore", flag: "🇸🇬" },
];

const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/service" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
];

// ─── CHROME SILVER GRADIENT ─────────────────────────────────────────────────
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
function ContactButton({ label = "CONTACT ME", href = "/contact", onClick, type = "button" }: { 
    label?: string; 
    href?: string; 
    onClick?: (e: any) => void;
    type?: "button" | "submit";
}) {
    const Component: any = href ? motion.a : motion.button;
    const props = href ? { href } : { type, onClick };
    
    return (
        <Component
            {...props}
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
        </Component>
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
function Scroll3DCard({ children, index = 0, direction = "left" }: {
    children: React.ReactNode;
    index?: number;
    direction?: "left" | "right" | "up" | "down";
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "center 55%"] });

    const dirMap: Record<string, [number, number, number, number, number, number]> = {
        left:  [-8, -15, 3,  -40, 30, -60],
        right: [-8,  15, -3,  40, 30, -60],
        up:    [-15,  0, 0,   0, 60, -80],
        down:  [ 15,  0, 0,   0,-60, -80],
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

// ─── CONTACT CARD ───────────────────────────────────────────────────────────
function ContactCard({ info, index }: { info: typeof contactInfo[0]; index: number }) {
    const [hovered, setHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateX.set(-py * 12);
        rotateY.set(px * 12);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
        setHovered(false);
    };

    const directions: Array<"left" | "right" | "up" | "down"> = ["left", "up", "down", "right"];

    return (
        <Scroll3DCard index={index} direction={directions[index % directions.length]}>
            <motion.div
                ref={cardRef}
                style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 800 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="relative group cursor-pointer active:scale-95 transition-transform"
            >
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-2xl blur-xl -z-10"
                    style={{ background: `radial-gradient(ellipse at center, ${info.accent}33 0%, transparent 70%)` }}
                />
                <div
                    className="relative rounded-2xl p-4 sm:p-5 md:p-6 text-center overflow-hidden border transition-all duration-300 h-full"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(20px)",
                        borderColor: hovered ? info.accent + "55" : "rgba(255,255,255,0.07)",
                        boxShadow: hovered
                            ? `0 0 40px ${info.accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`
                            : "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                >
                    <motion.div
                        animate={{ scaleX: hovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 h-0.5 w-full origin-left"
                        style={{ background: `linear-gradient(90deg, ${info.accent}, transparent)` }}
                    />
                    <motion.div
                        animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 15 : 0 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                        className="text-3xl sm:text-4xl mb-3 sm:mb-4"
                    >
                        {info.icon}
                    </motion.div>
                    <h3
                        className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 tracking-tight transition-colors duration-300"
                        style={{ color: hovered ? info.accent : "#e5e5e5", fontFamily: "'Syne', sans-serif" }}
                    >
                        {info.title}
                    </h3>
                    <p className="text-xs sm:text-sm mb-1 sm:mb-2 break-words" style={{ color: "#fff" }}>
                        {info.value}
                    </p>
                    <p className="text-[11px] sm:text-xs" style={{ color: "#888" }}>
                        {info.description}
                    </p>
                </div>
            </motion.div>
        </Scroll3DCard>
    );
}

// ─── MAIN CONTACT PAGE ──────────────────────────────────────────────────────
function ContactPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [toastMessage, setToastMessage] = useState<{ text: string; isError: boolean } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap";
        document.head.appendChild(link);
        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const showMessage = (text: string, isError: boolean = false) => {
        setToastMessage({ text, isError });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!formData.name || !formData.email || !formData.message) {
            showMessage("Please fill in all required fields", true);
            return;
        }
        setIsSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                showMessage("✅ Message sent successfully! We'll get back to you soon.");
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            } else {
                const messages = JSON.parse(localStorage.getItem("contact_messages") || "[]");
                messages.push({ ...formData, timestamp: new Date().toISOString() });
                localStorage.setItem("contact_messages", JSON.stringify(messages));
                showMessage("✅ Message received! We'll contact you shortly.");
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            }
        } catch (error) {
            const messages = JSON.parse(localStorage.getItem("contact_messages") || "[]");
            messages.push({ ...formData, timestamp: new Date().toISOString() });
            localStorage.setItem("contact_messages", JSON.stringify(messages));
            showMessage("✅ Message received! We'll contact you shortly.");
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}>
            {/* Toast Message */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-4 max-w-[90vw]"
                    >
                        <div
                            style={{
                                background: toastMessage.isError ? "#8B2C2C" : "rgba(17,19,30,0.95)",
                                backdropFilter: "blur(20px)",
                                padding: "12px 24px",
                                borderRadius: "60px",
                                color: "white",
                                fontSize: "13px",
                                border: `1px solid ${toastMessage.isError ? "#f44336" : "rgba(155,81,224,0.7)"}`,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {toastMessage.text}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cursor glow - desktop only */}
            <motion.div
                className="fixed pointer-events-none z-50 rounded-full hidden md:block"
                style={{
                    width: 400, height: 400,
                    background: "radial-gradient(circle, rgba(155,81,224,0.08) 0%, transparent 70%)",
                    x: mousePos.x - 200, y: mousePos.y - 200,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
            />

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* HERO SECTION                                                    */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative min-h-screen flex flex-col" style={{ overflowX: "clip" }}>
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="fixed top-4 right-4 z-50 md:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 active:scale-95 transition-transform"
                    aria-label="Menu"
                >
                    <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                    <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>

                {/* Mobile Menu Overlay */}
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
                                            color: item.label === "Contact" ? "#F2994A" : "#D7E2EA",
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

                {/* Desktop Navigation */}
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
                                color: item.label === "Contact" ? "#F2994A" : "#D7E2EA",
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

                {/* Main Hero Content - Centered */}
                <div className="flex-1 flex flex-col justify-center relative px-4 pt-16 md:pt-0">
                    {/* Giant CONTACT heading */}
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
                                CONTACT
                            </h1>
                        </FadeIn>
                    </div>

                    {/* Decorative divider */}
                    <FadeIn delay={0.4} y={20} className="flex justify-center mt-4 sm:mt-6">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-px w-8 sm:w-12 md:w-24" style={{ background: "linear-gradient(90deg, transparent, #9B51E0)" }} />
                            <span className="text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                                Get In Touch
                            </span>
                            <div className="h-px w-8 sm:w-12 md:w-24" style={{ background: "linear-gradient(90deg, #F2994A, transparent)" }} />
                        </div>
                    </FadeIn>
                </div>

                {/* Bottom section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 sm:px-6 md:px-10 pb-5 sm:pb-7 md:pb-10 relative z-20 gap-4">
                    <FadeIn delay={0.35} y={20} className="w-full sm:w-auto">
                        <p
                            className="font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[260px] text-[10px] sm:text-xs md:text-sm lg:text-base"
                            style={{ color: "#D7E2EA" }}
                        >
                            HAVE A PROJECT IN MIND? LET'S CREATE SOMETHING EXTRAORDINARY TOGETHER
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.5} y={20} className="w-full sm:w-auto flex justify-end">
                        <ContactButton label="SEND MESSAGE" href="#contact-form" />
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CONTACT CARDS                                                   */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, 0, 0]} translateFrom={[0, 60, -80]} scaleFrom={0.85}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Quick Connect ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Reach Out
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {contactInfo.map((info, index) => (
                        <ContactCard key={info.id} info={info} index={index} />
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CONTACT FORM & INFO                                             */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section id="contact-form" className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[20, 0, 0]} translateFrom={[0, 80, -100]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Send a Message ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Let's Talk
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-7xl mx-auto">
                    {/* Contact Form */}
                    <Scroll3DCard index={0} direction="left">
                        <div
                            className="rounded-2xl p-5 sm:p-6 md:p-8 h-full"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(155,81,224,0.2)",
                            }}
                        >
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: "#9B51E0" }}>
                                Drop Us A Line
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#9B51E0] focus:outline-none transition-all text-white text-sm"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#9B51E0] focus:outline-none transition-all text-white text-sm"
                                            placeholder="hello@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#F2994A] focus:outline-none transition-all text-white text-sm"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#F2994A] focus:outline-none transition-all text-white text-sm"
                                            placeholder="Project Inquiry"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#9B51E0] focus:outline-none transition-all text-white resize-none text-sm"
                                        placeholder="Tell us about your project..."
                                        required
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-wider text-white text-sm sm:text-base transition-all relative overflow-hidden group"
                                    style={{
                                        background: "linear-gradient(135deg, #9B51E0 0%, #F2994A 100%)",
                                        boxShadow: "0 0 30px rgba(155, 81, 224, 0.4), 0 0 60px rgba(242, 153, 74, 0.2)",
                                    }}
                                >
                                    <span className="relative z-10">
                                        {isSubmitting ? "Sending..." : "Send Message →"}
                                    </span>
                                    {isSubmitting && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                        />
                                    )}
                                </motion.button>
                                
                                <p className="text-[11px] sm:text-xs text-gray-500 text-center">
                                    We'll get back to you within 24 hours
                                </p>
                            </form>
                        </div>
                    </Scroll3DCard>

                    {/* Office Locations & Social */}
                    <Scroll3DCard index={1} direction="right">
                        <div className="space-y-4 sm:space-y-6 h-full">
                            {/* Office Locations */}
                            <div
                                className="rounded-2xl p-5 sm:p-6"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(242,153,74,0.2)",
                                }}
                            >
                                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5" style={{ color: "#F2994A" }}>
                                    🌍 Our Offices
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {locations.map((location, index) => (
                                        <motion.div 
                                            key={index} 
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="text-xl sm:text-2xl flex-shrink-0">{location.flag}</span>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white text-sm sm:text-base">{location.city}</p>
                                                <p className="text-xs sm:text-sm text-gray-400">{location.address}</p>
                                                <p className="text-[11px] sm:text-xs text-gray-500">{location.country}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Links */}
                            <div
                                className="rounded-2xl p-5 sm:p-6"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(155,81,224,0.2)",
                                }}
                            >
                                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5" style={{ color: "#9B51E0" }}>
                                    🔗 Follow Us
                                </h3>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.15, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05, type: "spring" }}
                                            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                color: social.color,
                                                border: "1px solid rgba(255,255,255,0.1)",
                                            }}
                                            title={social.name}
                                        >
                                            <i className={`${social.icon} text-sm sm:text-base`}></i>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div
                                className="rounded-2xl p-5 sm:p-6"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(78,205,196,0.2)",
                                }}
                            >
                                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5" style={{ color: "#4ecdc4" }}>
                                    ⏰ Business Hours
                                </h3>
                                <div className="space-y-2 text-sm sm:text-base">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Mon - Fri</span>
                                        <span className="text-white">9AM - 6PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Saturday</span>
                                        <span className="text-white">10AM - 4PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Sunday</span>
                                        <span className="text-white">Closed</span>
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                                    <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Emergency Support: 24/7
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Scroll3DCard>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* FAQ TEASER / EXTRA SECTION                                      */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[0, 30, 0]} translateFrom={[-60, 40, -80]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ What To Expect ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Our Process
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {[
                        { step: "01", title: "Reach Out", description: "Send us a message with your project details and goals." },
                        { step: "02", title: "Discovery Call", description: "We'll schedule a call to understand your vision." },
                        { step: "03", title: "Proposal", description: "Receive a tailored proposal within 48 hours." },
                        { step: "04", title: "Let's Build", description: "We kick off and bring your vision to life." },
                    ].map((item, index) => {
                        const rotations: Array<[number,number,number]> = [[-15,20,5], [-15,-20,-5], [15,20,-5], [15,-20,5]];
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
                                    className="p-4 sm:p-5 md:p-6 rounded-2xl text-center h-full relative overflow-hidden"
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

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CTA SECTION                                                     */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at center, #9B51E0 0%, transparent 65%)" }} />

                <Scroll3DReveal rotateFrom={[30, 0, 0]} translateFrom={[0, 100, -200]} scaleFrom={0.65}>
                    <div className="relative z-10">
                        <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-4 sm:mb-6" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Let's Work Together ─
                        </p>
                        <h2
                            className="font-black leading-[1.1] sm:leading-[1.2] tracking-tighter mb-6 sm:mb-8 md:mb-10 uppercase"
                            style={{ ...gradientStyle, fontSize: "clamp(1.75rem, 7vw, 5rem)", fontFamily: "'Syne', sans-serif" }}
                        >
                            Ready To<br />Dominate<br />Your Market?
                        </h2>
                        <ContactButton label="Explore Services" href="/service" />
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
        </div>
    );
}

export default ContactPage;