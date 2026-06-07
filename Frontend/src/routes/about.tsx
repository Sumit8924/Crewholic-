/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform } from "framer-motion";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

// ─── DATA ───────────────────────────────────────────────────────────────────
const teamMembers = [
    { id: 1, name: "Ronit Kumar Mishra", position: "Founder & CEO", bio: "Visionary leader with 8+ years of experience in digital innovation and brand strategy.", icon: "👨‍💻", accent: "#9B51E0", tags: ["Leadership", "Strategy", "Innovation"] },
    { id: 2, name: "Shakti Prasad Sahoo", position: "Creative Director", bio: "Award-winning designer specializing in immersive brand experiences and visual storytelling.", icon: "🎨", accent: "#F2994A", tags: ["Branding", "Design", "Creativity"] },
    { id: 3, name: "Sumit Kumar Rout", position: "Tech Lead", bio: "Full-stack architect with expertise in React, Three.js, and scalable web applications.", icon: "⚡", accent: "#4ecdc4", tags: ["React", "Three.js", "Architecture"] },
    { id: 4, name: "Ashutosh Parthasarathi", position: "Marketing Head", bio: "Data-driven strategist who has delivered 4.8x ROI for 500+ campaigns globally.", icon: "📈", accent: "#ff6b35", tags: ["SEO", "Analytics", "Strategy"] },
    { id: 5, name: "Swaraj Singh", position: "Lead Developer", bio: "Expert in modern frameworks, 3D web experiences, and performance optimization.", icon: "🖥️", accent: "#8b5cf6", tags: ["Full Stack", "3D", "Optimization"] },
    { id: 6, name: "Suraj jena", position: "UI/UX Designer", bio: "Creating intuitive, user-centered designs that delight and engage audiences.", icon: "✨", accent: "#06b6d4", tags: ["UI/UX", "Prototyping", "Research"] }
];

const milestones = [
    { year: "2016", title: "Founded", description: "Crewholic began its journey with a vision to dominate digital markets." },
    { year: "2018", title: "First Award", description: "Received industry recognition for innovative web solutions." },
    { year: "2020", title: "Global Expansion", description: "Expanded operations to serve international clients." },
    { year: "2022", title: "100+ Projects", description: "Celebrated completing over 100 successful projects." },
    { year: "2024", title: "Fusion Ecosystem", description: "Launched integrated service ecosystem for complete digital solutions." }
];

const values = [
    { icon: "🎯", title: "Excellence", description: "We strive for perfection in every project we undertake." },
    { icon: "🤝", title: "Integrity", description: "Transparent communication and honest partnerships." },
    { icon: "💡", title: "Innovation", description: "Pushing boundaries with cutting-edge solutions." },
    { icon: "🚀", title: "Impact", description: "Creating measurable results that drive growth." }
];

const stats = [
    { value: "150+", label: "Projects Completed", icon: "🚀" },
    { value: "98%", label: "Client Satisfaction", icon: "⭐" },
    { value: "50+", label: "Team Members", icon: "👥" },
    { value: "12", label: "Industry Awards", icon: "🏆" },
    { value: "8+", label: "Years Experience", icon: "⏰" },
    { value: "25+", label: "Global Clients", icon: "🌍" },
    { value: "4.8x", label: "Avg ROI", icon: "📈" },
    { value: "24/7", label: "Support", icon: "💬" }
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
function ContactButton({ label = "CONTACT ME", href = "/contact", small = false }: { label?: string; href?: string; small?: boolean }) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative inline-block rounded-full font-bold uppercase tracking-wider text-white overflow-hidden ${
                small 
                    ? "px-4 py-2.5 text-[10px] sm:text-xs" 
                    : "px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-xs sm:text-sm md:text-base"
            }`}
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

// ─── MILESTONE NODE (Mobile-friendly stacked layout) ────────────────────────
function MilestoneNode({ milestone, index }: { milestone: typeof milestones[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "center 60%"] });
    const isEven = index % 2 === 0;
    const rotateY = useTransform(scrollYProgress, [0, 1], [isEven ? -60 : 60, 0]);
    const x = useTransform(scrollYProgress, [0, 1], [isEven ? -40 : 40, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.4, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const oppositeRotateY = useTransform(scrollYProgress, [0, 1], [isEven ? 60 : -60, 0]);
    const oppositeX = useTransform(scrollYProgress, [0, 1], [isEven ? 40 : -40, 0]);

    return (
        <div
            ref={ref}
            className={`relative flex flex-row md:flex-row items-center mb-8 md:mb-12 gap-3 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            style={{ perspective: "1000px" }}
        >
            {/* Mobile: Year first (left), Desktop: Title */}
            <motion.div 
                style={{ rotateY, x, scale, opacity }} 
                className="flex-1 text-left md:text-right p-2 md:p-6 order-2 md:order-1"
            >
                <h3 className="text-base md:text-xl font-bold" style={{ color: "#F2994A" }}>{milestone.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2 leading-relaxed">{milestone.description}</p>
            </motion.div>

            {/* Center circle */}
            <motion.div 
                style={{ scale, opacity }} 
                className="relative z-10 flex-shrink-0 order-1 md:order-2"
            >
                <div 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center" 
                    style={{ 
                        background: "linear-gradient(135deg, #9B51E0, #F2994A)",
                        boxShadow: "0 0 20px rgba(155, 81, 224, 0.5)",
                    }}
                >
                    <span className="text-white font-bold text-xs md:text-sm">{milestone.year.slice(-2)}</span>
                </div>
            </motion.div>

            {/* Year (right on desktop, hidden on mobile - shown in main text) */}
            <motion.div 
                style={{ rotateY: oppositeRotateY, x: oppositeX, scale, opacity }} 
                className="hidden md:block flex-1 text-center md:text-left p-2 md:p-6 order-3"
            >
                <span className="text-2xl font-bold" style={{ color: "#9B51E0" }}>{milestone.year}</span>
            </motion.div>

            {/* Mobile year - inline */}
            <motion.div 
                style={{ scale, opacity }} 
                className="md:hidden absolute -top-2 left-16 text-[10px] font-bold tracking-widest"
                style={{ color: "#9B51E0" }}
            >
                {milestone.year}
            </motion.div>
        </div>
    );
}

// ─── TEAM CARD ──────────────────────────────────────────────────────────────
function TeamCard({ member, index, onClick }: {
    member: typeof teamMembers[0];
    index: number;
    onClick: () => void;
}) {
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

    const directions: Array<"left" | "right" | "up"> = ["left", "right", "left", "right", "up", "up"];

    return (
        <Scroll3DCard index={index} direction={directions[index % directions.length]}>
            <motion.div
                ref={cardRef}
                style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 800 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                className="relative group cursor-pointer active:scale-95 transition-transform"
            >
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-2xl blur-xl -z-10"
                    style={{ background: `radial-gradient(ellipse at center, ${member.accent}33 0%, transparent 70%)` }}
                />
                <div
                    className="relative rounded-2xl p-4 sm:p-5 md:p-6 h-full overflow-hidden border transition-all duration-300"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(20px)",
                        borderColor: hovered ? member.accent + "55" : "rgba(255,255,255,0.07)",
                        boxShadow: hovered
                            ? `0 0 40px ${member.accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`
                            : "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                >
                    <motion.div
                        animate={{ scaleX: hovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 h-0.5 w-full origin-left"
                        style={{ background: `linear-gradient(90deg, ${member.accent}, transparent)` }}
                    />
                    <div className="text-[10px] sm:text-xs font-mono mb-2 sm:mb-3 md:mb-4 tracking-widest" style={{ color: member.accent + "99" }}>
                        {String(index + 1).padStart(2, "0")}
                    </div>
                    <motion.div
                        animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 15 : 0 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                        className="text-3xl sm:text-4xl mb-3 sm:mb-4"
                        style={{ color: member.accent }}
                    >
                        {member.icon}
                    </motion.div>
                    <h3
                        className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 tracking-tight transition-colors duration-300"
                        style={{ color: hovered ? "#fff" : "#e5e5e5", fontFamily: "'Syne', sans-serif" }}
                    >
                        {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: member.accent }}>{member.position}</p>
                    <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4" style={{ color: "#888" }}>{member.bio}</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {member.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full tracking-widest uppercase font-medium"
                                style={{
                                    background: member.accent + "15",
                                    color: member.accent + "cc",
                                    border: `1px solid ${member.accent}22`,
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </Scroll3DCard>
    );
}

// ─── MAIN ABOUT PAGE ────────────────────────────────────────────────────────
function AboutPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const handleTeamClick = (member: typeof teamMembers[0]) => {
        setSelectedMember(member);
        setShowTeamModal(true);
    };

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}>
            {/* Cursor glow - hidden on mobile (touch devices) */}
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
                                            color: item.label === "About" ? "#F2994A" : "#D7E2EA",
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
                                color: item.label === "About" ? "#F2994A" : "#D7E2EA",
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
                    {/* Giant ABOUT heading - FIXED to fit screen */}
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
                                ABOUT
                            </h1>
                        </FadeIn>
                    </div>

                    {/* Decorative divider */}
                    <FadeIn delay={0.4} y={20} className="flex justify-center mt-4 sm:mt-6">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-px w-8 sm:w-12 md:w-24" style={{ background: "linear-gradient(90deg, transparent, #9B51E0)" }} />
                            <span className="text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                                Our Story
                            </span>
                            <div className="h-px w-8 sm:w-12 md:w-24" style={{ background: "linear-gradient(90deg, #F2994A, transparent)" }} />
                        </div>
                    </FadeIn>
                </div>

                {/* Bottom section - Mobile: stacked, Desktop: split */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 sm:px-6 md:px-10 pb-5 sm:pb-7 md:pb-10 relative z-20 gap-4 sm:gap-4">
                    <FadeIn delay={0.35} y={20} className="w-full sm:w-auto">
                        <p
                            className="font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[260px] text-[10px] sm:text-xs md:text-sm lg:text-base"
                            style={{ color: "#D7E2EA" }}
                        >
                            DOMINATE YOUR MARKET DOMINATE YOUR MARKET DIGITAL EXPERIENCES
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.5} y={20} className="w-full sm:w-auto flex justify-end">
                        <ContactButton />
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MISSION & VISION                                                */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, 0, 0]} translateFrom={[0, 60, -80]} scaleFrom={0.85}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Our Story ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Who We Are
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
                    <Scroll3DCard index={0} direction="left">
                        <div className="p-5 sm:p-6 md:p-8 rounded-2xl text-center h-full" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(155,81,224,0.2)" }}>
                            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎯</div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{ color: "#9B51E0" }}>Our Mission</h3>
                            <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                                To empower businesses with cutting-edge digital solutions that drive measurable growth, create unforgettable experiences, and dominate their markets.
                            </p>
                        </div>
                    </Scroll3DCard>

                    <Scroll3DCard index={1} direction="right">
                        <div className="p-5 sm:p-6 md:p-8 rounded-2xl text-center h-full" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(242,153,74,0.2)" }}>
                            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">👁️</div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{ color: "#F2994A" }}>Our Vision</h3>
                            <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                                To become the world's most innovative digital agency, recognized for transforming ideas into extraordinary digital realities that shape the future.
                            </p>
                        </div>
                    </Scroll3DCard>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* STATS                                                           */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[20, 0, 0]} translateFrom={[0, 80, -100]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ By The Numbers ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Our Impact
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {stats.map((stat, index) => {
                        const dirs: Array<"left"|"right"|"up"|"down"> = ["up","down","left","right","up","down","left","right"];
                        return (
                            <Scroll3DCard key={index} index={index} direction={dirs[index % dirs.length]}>
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="p-3 sm:p-4 md:p-6 rounded-2xl text-center h-full"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2 md:mb-3">{stat.icon}</div>
                                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2"
                                        style={{ 
                                            background: "linear-gradient(135deg, #9B51E0, #F2994A)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-400 text-[9px] sm:text-[10px] md:text-sm leading-tight">{stat.label}</div>
                                </motion.div>
                            </Scroll3DCard>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* VALUES                                                          */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[0, 30, 0]} translateFrom={[-60, 40, -80]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Core Principles ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Our Values
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {values.map((value, index) => {
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
                                    className="p-4 sm:p-5 md:p-6 rounded-2xl text-center h-full"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4">{value.icon}</div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 md:mb-3" style={{ color: "#F2994A" }}>{value.title}</h3>
                                    <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm leading-relaxed">{value.description}</p>
                                </motion.div>
                            </Scroll3DReveal>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MILESTONES                                                      */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[25, 0, 0]} translateFrom={[0, 80, -100]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Our Journey ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Milestones
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical line - left on mobile, center on desktop */}
                    <div 
                        className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 w-px h-full" 
                        style={{ background: "linear-gradient(180deg, transparent, #9B51E0, #F2994A, transparent)" }} 
                    />
                    {milestones.map((milestone, index) => (
                        <MilestoneNode key={index} milestone={milestone} index={index} />
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TEAM                                                            */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, -10, 0]} translateFrom={[40, 60, -80]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Meet The Team ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            The Crew
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {teamMembers.map((member, i) => (
                        <TeamCard key={member.id} member={member} index={i} onClick={() => handleTeamClick(member)} />
                    ))}
                </div>
            </section>

            {/* TEAM MODAL */}
            <AnimatePresence>
                {showTeamModal && selectedMember && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowTeamModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div
                                className="relative w-full max-w-md rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-auto p-5 sm:p-6 md:p-8 text-center"
                                style={{
                                    background: "linear-gradient(135deg, rgba(20,20,30,0.98), rgba(10,10,15,0.98))",
                                    backdropFilter: "blur(20px)",
                                    border: `1px solid ${selectedMember.accent}33`,
                                    boxShadow: `0 25px 50px -12px ${selectedMember.accent}40`,
                                }}
                            >
                                <button 
                                    onClick={() => setShowTeamModal(false)} 
                                    className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white text-2xl transition-colors rounded-full bg-white/5 active:scale-90"
                                >
                                    ×
                                </button>
                                <div
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4"
                                    style={{ background: `linear-gradient(135deg, ${selectedMember.accent}40, ${selectedMember.accent}20)`, border: `2px solid ${selectedMember.accent}` }}
                                >
                                    {selectedMember.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-1 text-white">{selectedMember.name}</h3>
                                <p className="text-base sm:text-lg mb-3 sm:mb-4" style={{ color: selectedMember.accent }}>{selectedMember.position}</p>
                                <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{selectedMember.bio}</p>
                                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                                    {selectedMember.tags.map((tag) => (
                                        <span key={tag} className="text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full tracking-widest uppercase font-medium"
                                            style={{ background: selectedMember.accent + "15", color: selectedMember.accent + "cc", border: `1px solid ${selectedMember.accent}22` }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CTA SECTION                                                     */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at center, #9B51E0 0%, transparent 65%)" }} />

                <Scroll3DReveal rotateFrom={[30, 0, 0]} translateFrom={[0, 100, -200]} scaleFrom={0.65}>
                    <div className="relative z-10">
                        <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-4 sm:mb-6" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Ready to dominate? ─
                        </p>
                        <h2
                            className="font-black leading-[1.1] sm:leading-[1.2] tracking-tighter mb-6 sm:mb-8 md:mb-10 uppercase"
                            style={{ ...gradientStyle, fontSize: "clamp(1.75rem, 7vw, 5rem)", fontFamily: "'Syne', sans-serif" }}
                        >
                            Let's Create<br />Something<br />Legendary.
                        </h2>
                        <ContactButton label="Get In Touch" href="/contact" />
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

export default AboutPage;