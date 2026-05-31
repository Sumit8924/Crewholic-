/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform } from "framer-motion";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

// Team Members Data (same as before)
const teamMembers = [
    {
        id: 1,
        name: "Ronit Kumar Mishra",
        position: "Founder & CEO",
        bio: "Visionary leader with 8+ years of experience in digital innovation and brand strategy.",
        icon: "👨‍💻",
        accent: "#9B51E0",
        tags: ["Leadership", "Strategy", "Innovation"],
    },
    {
        id: 2,
        name: "Priya Sharma",
        position: "Creative Director",
        bio: "Award-winning designer specializing in immersive brand experiences and visual storytelling.",
        icon: "🎨",
        accent: "#F2994A",
        tags: ["Branding", "Design", "Creativity"],
    },
    {
        id: 3,
        name: "Arjun Mehta",
        position: "Tech Lead",
        bio: "Full-stack architect with expertise in React, Three.js, and scalable web applications.",
        icon: "⚡",
        accent: "#4ecdc4",
        tags: ["React", "Three.js", "Architecture"],
    },
    {
        id: 4,
        name: "Neha Verma",
        position: "Marketing Head",
        bio: "Data-driven strategist who has delivered 4.8x ROI for 500+ campaigns globally.",
        icon: "📈",
        accent: "#ff6b35",
        tags: ["SEO", "Analytics", "Strategy"],
    },
    {
        id: 5,
        name: "Vikram Singh",
        position: "Lead Developer",
        bio: "Expert in modern frameworks, 3D web experiences, and performance optimization.",
        icon: "🖥️",
        accent: "#8b5cf6",
        tags: ["Full Stack", "3D", "Optimization"],
    },
    {
        id: 6,
        name: "Anjali Desai",
        position: "UI/UX Designer",
        bio: "Creating intuitive, user-centered designs that delight and engage audiences.",
        icon: "✨",
        accent: "#06b6d4",
        tags: ["UI/UX", "Prototyping", "Research"],
    }
];

// Milestones Data
const milestones = [
    { year: "2016", title: "Founded", description: "Crewholic began its journey with a vision to dominate digital markets." },
    { year: "2018", title: "First Award", description: "Received industry recognition for innovative web solutions." },
    { year: "2020", title: "Global Expansion", description: "Expanded operations to serve international clients." },
    { year: "2022", title: "100+ Projects", description: "Celebrated completing over 100 successful projects." },
    { year: "2024", title: "Fusion Ecosystem", description: "Launched integrated service ecosystem for complete digital solutions." }
];

// Values Data
const values = [
    { icon: "🎯", title: "Excellence", description: "We strive for perfection in every project we undertake." },
    { icon: "🤝", title: "Integrity", description: "Transparent communication and honest partnerships." },
    { icon: "💡", title: "Innovation", description: "Pushing boundaries with cutting-edge solutions." },
    { icon: "🚀", title: "Impact", description: "Creating measurable results that drive growth." }
];

// Stats Data
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

// ─── SCROLL 3D REVEAL wrapper ───────────────────────────────────────────────
function Scroll3DReveal({
    children,
    rotateFrom = [20, 0, 0],
    translateFrom = [0, 80, -120],
    scaleFrom = 0.8,
    className = "",
}: {
    children: React.ReactNode;
    rotateFrom?: [number, number, number];
    translateFrom?: [number, number, number];
    scaleFrom?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });

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

// ─── SCROLL 3D CARD ──────────────────────────────────────────────────────────
function Scroll3DCard({
    children,
    index = 0,
    direction = "left",
}: {
    children: React.ReactNode;
    index?: number;
    direction?: "left" | "right" | "up" | "down";
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 95%", "center 55%"],
    });

    const dirMap: Record<string, [number, number, number, number, number, number]> = {
        left:  [-8, -15, 3,  -60, 40, -80],
        right: [-8,  15, -3,  60, 40, -80],
        up:    [-20,  0, 0,   0, 80, -100],
        down:  [ 20,  0, 0,   0,-80, -100],
    };
    const [frX, frY, frZ, frTX, frTY, frTZ] = dirMap[direction];

    const rotateX = useTransform(scrollYProgress, [0, 1], [frX, 0]);
    const rotateY = useTransform(scrollYProgress, [0, 1], [frY, 0]);
    const rotateZ = useTransform(scrollYProgress, [0, 1], [frZ, 0]);
    const x = useTransform(scrollYProgress, [0, 1], [frTX, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [frTY, 0]);
    const z = useTransform(scrollYProgress, [0, 1], [frTZ, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.5, 1]);

    return (
        <div ref={ref} style={{ perspective: "900px" }}>
            <motion.div style={{ rotateX, rotateY, rotateZ, x, y, z, scale, opacity }}>
                {children}
            </motion.div>
        </div>
    );
}

// ─── MILESTONE NODE with 3D flip ──────────────────────────────────────────────
function MilestoneNode({ milestone, index }: { milestone: typeof milestones[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 90%", "center 60%"],
    });

    const isEven = index % 2 === 0;
    const rotateY = useTransform(scrollYProgress, [0, 1], [isEven ? -90 : 90, 0]);
    const x = useTransform(scrollYProgress, [0, 1], [isEven ? -80 : 80, 0]);
    const z = useTransform(scrollYProgress, [0, 1], [-150, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.4, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

    const oppositeRotateY = useTransform(scrollYProgress, [0, 1], [isEven ? 90 : -90, 0]);
    const oppositeX = useTransform(scrollYProgress, [0, 1], [isEven ? 80 : -80, 0]);

    return (
        <div
            ref={ref}
            className={`relative flex flex-col md:flex-row items-center mb-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            style={{ perspective: "1000px" }}
        >
            <motion.div
                style={{ rotateY, x, z, scale, opacity }}
                className="flex-1 text-center md:text-right p-6"
            >
                <h3 className="text-xl font-bold" style={{ color: "#F2994A" }}>{milestone.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{milestone.description}</p>
            </motion.div>

            {/* Centre circle */}
            <motion.div
                style={{ scale, opacity }}
                className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full mx-4"
            >
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #FF6B2B, #A855F7)" }}
                >
                    <span className="text-white font-bold text-sm">{milestone.year.slice(-2)}</span>
                </div>
            </motion.div>

            <motion.div
                style={{ rotateY: oppositeRotateY, x: oppositeX, z, scale, opacity }}
                className="flex-1 text-center md:text-left p-6"
            >
                <span className="text-2xl font-bold" style={{ color: "#9B51E0" }}>{milestone.year}</span>
            </motion.div>
        </div>
    );
}

function MagneticButton({
    children,
    className,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set((e.clientX - cx) * 0.35);
        y.set((e.clientY - cy) * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}

function TeamCard({
    member,
    index,
    onClick,
}: {
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
                className="relative group cursor-pointer"
            >
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-2xl blur-xl -z-10"
                    style={{
                        background: `radial-gradient(ellipse at center, ${member.accent}33 0%, transparent 70%)`,
                    }}
                />
                <div
                    className="relative rounded-2xl p-6 h-full overflow-hidden border transition-all duration-300"
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
                    <div className="text-xs font-mono mb-4 tracking-widest" style={{ color: member.accent + "99" }}>
                        {String(index + 1).padStart(2, "0")}
                    </div>
                    <motion.div
                        animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 15 : 0 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                        className="text-4xl mb-4"
                        style={{ color: member.accent }}
                    >
                        {member.icon}
                    </motion.div>
                    <h3
                        className="text-xl font-semibold mb-2 tracking-tight transition-colors duration-300"
                        style={{ color: hovered ? "#fff" : "#e5e5e5", fontFamily: "'Syne', sans-serif" }}
                    >
                        {member.name}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: member.accent }}>{member.position}</p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#888" }}>{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                        {member.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase font-medium"
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
                    <motion.div
                        animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-6 right-6 text-sm"
                        style={{ color: member.accent }}
                    >
                        →
                    </motion.div>
                </div>
            </motion.div>
        </Scroll3DCard>
    );
}

function OrbVisual() {
    const orbs = [
        { size: 280, color: "#FF6B2B", opacity: 0.12, dur: 8 },
        { size: 200, color: "#A855F7", opacity: 0.15, dur: 6 },
        { size: 120, color: "#FF6B2B", opacity: 0.2, dur: 4 },
    ];

    return (
        <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72 mx-auto">
            {orbs.map((orb, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: orb.size,
                        height: orb.size,
                        background: `radial-gradient(circle, ${orb.color}${Math.round(orb.opacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
                        filter: "blur(2px)",
                    }}
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 360] }}
                    transition={{
                        scale: { duration: orb.dur, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: orb.dur * 4, repeat: Infinity, ease: "linear", direction: i % 2 === 0 ? "normal" : "reverse" },
                    }}
                />
            ))}
            <motion.div
                className="absolute rounded-full border"
                style={{ width: 80, height: 80, borderColor: "rgba(255,107,43,0.3)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute rounded-full border"
                style={{ width: 120, height: 120, borderColor: "rgba(168,85,247,0.2)", borderStyle: "dashed" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div
                className="relative w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                    background: "radial-gradient(circle, #FF6B2B44 0%, #A855F722 50%, transparent 100%)",
                    border: "1px solid rgba(255,107,43,0.4)",
                    boxShadow: "0 0 30px #FF6B2B33, inset 0 0 20px #A855F711",
                }}
            >
                <span style={{ fontSize: 20, filter: "drop-shadow(0 0 8px #FF6B2B)" }}>⬡</span>
            </div>
        </div>
    );
}

const gradientStyle = {
    background: "linear-gradient(135deg, #C0C0C0 0%, #FFFFFF 20%, #A8A8A8 40%, #E8E8E8 55%, #888 70%, #FFFFFF 85%, #C0C0C0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
};

function AboutPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const pageRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 600], [0, -80]);
    const heroScale = useTransform(scrollY, [0, 600], [1, 0.92]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap";
        document.head.appendChild(link);
        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleTeamClick = (member: typeof teamMembers[0]) => {
        setSelectedMember(member);
        setShowTeamModal(true);
    };

    const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/service" },
        { label: "Projects", href: "/portfolio" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <div
            ref={pageRef}
            className="min-h-screen overflow-x-hidden"
            style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}
        >
            {/* Cursor glow */}
            <motion.div
                className="fixed pointer-events-none z-50 rounded-full"
                style={{
                    width: 400, height: 400,
                    background: "radial-gradient(circle, rgba(255,107,43,0.05) 0%, transparent 70%)",
                    x: mousePos.x - 200, y: mousePos.y - 200,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
            />

            {/* ── NAVBAR with Mobile Menu ── */}
            <nav className="fixed top-0 left-0 right-0 z-40">
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,12,12,0.95) 0%, transparent 100%)" }} />
                
                <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-5">
                    <motion.a
                        href="/"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-sm md:text-base font-bold tracking-[0.25em] uppercase"
                        style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}
                    >
                        CREWHOLIC
                    </motion.a>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="hidden md:flex items-center gap-6 lg:gap-8"
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-xs lg:text-sm tracking-widest uppercase transition-colors duration-200 hover:text-[#FF6B2B]"
                                style={{ 
                                    color: item.label === "About" ? "#FF6B2B" : "rgba(255,255,255,0.6)", 
                                    fontFamily: "'Space Mono', monospace" 
                                }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </motion.div>

                    <MagneticButton className="relative z-10 hidden md:block">
                        <motion.a
                            href="/contact"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="relative overflow-hidden text-xs tracking-widest uppercase px-4 lg:px-5 py-2 lg:py-2.5 rounded-full font-medium transition-all duration-300 inline-block"
                            style={{ 
                                background: "transparent", 
                                border: "1px solid rgba(255,255,255,0.15)", 
                                color: "rgba(255,255,255,0.7)", 
                                fontFamily: "'Space Mono', monospace" 
                            }}
                            whileHover={{ borderColor: "rgba(255,107,43,0.6)", color: "#FF6B2B" }}
                        >
                            <span className="relative z-10">Contact</span>
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                initial={{ scale: 0, opacity: 0 }} 
                                whileHover={{ scale: 1, opacity: 1 }} 
                                transition={{ duration: 0.4 }}
                                style={{ background: "rgba(255,107,43,0.08)" }}
                            />
                        </motion.a>
                    </MagneticButton>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="relative z-20 md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10"
                        aria-label="Menu"
                    >
                        <motion.span 
                            animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }}
                            className="w-5 h-0.5 bg-white transition-all duration-300"
                            style={{ background: mobileMenuOpen ? "#FF6B2B" : "#fff" }}
                        />
                        <motion.span 
                            animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                            className="w-5 h-0.5 bg-white transition-all duration-300"
                        />
                        <motion.span 
                            animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }}
                            className="w-5 h-0.5 bg-white transition-all duration-300"
                            style={{ background: mobileMenuOpen ? "#FF6B2B" : "#fff" }}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-72 bg-[#0C0C0C] backdrop-blur-xl border-l border-white/10 z-40 md:hidden flex flex-col p-6 pt-20"
                        >
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                            >
                                ✕
                            </button>

                            <div className="flex flex-col gap-2 mt-4">
                                {navItems.map((item, index) => (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="py-4 px-4 text-lg tracking-widest uppercase transition-all duration-300 rounded-xl hover:bg-white/5"
                                        style={{ 
                                            color: item.label === "About" ? "#FF6B2B" : "rgba(255,255,255,0.8)", 
                                            fontFamily: "'Space Mono', monospace",
                                            borderLeft: item.label === "About" ? `3px solid #FF6B2B` : "3px solid transparent"
                                        }}
                                    >
                                        {item.label}
                                    </motion.a>
                                ))}
                            </div>

                            <motion.a
                                href="/contact"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-6 py-3 text-center text-sm tracking-widest uppercase font-medium rounded-full border border-[#FF6B2B]/50 text-[#FF6B2B] hover:bg-[#FF6B2B]/10 transition-all duration-300"
                                style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                                Get in Touch
                            </motion.a>

                            <div className="mt-auto pt-8 pb-4">
                                <p className="text-[10px] tracking-[0.2em] text-center text-white/30">
                                    © 2025 Crewholic
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── HERO SECTION - FIXED FOR CREWHOLIC TEXT ── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#FF6B2B" }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#A855F7" }} />

                <motion.div
                    style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
                    className="relative z-10 text-center max-w-5xl mx-auto w-full"
                >
                    {/* Our Story Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center justify-center gap-3 mb-6 md:mb-8"
                    >
                        <div className="h-px w-8 md:w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                        <span 
                            className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase" 
                            style={{ color: "#FF6B2B99", fontFamily: "'Space Mono', monospace" }}
                        >
                            Our Story
                        </span>
                        <div className="h-px w-8 md:w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                    </motion.div>

                    {/* CREWHOLIC Heading - FULL TEXT ON ONE LINE */}
                    <div className="w-full flex justify-center items-center overflow-visible px-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="font-extrabold leading-[1.1] tracking-tighter text-center w-full"
                            style={{ 
                                ...gradientStyle, 
                                fontSize: "clamp(28px, 6vw, 140px)", 
                                fontFamily: "'Syne', sans-serif", 
                                textShadow: "0 0 80px rgba(255,255,255,0.05)",
                                letterSpacing: "clamp(-0.01em, -0.2vw, -0.02em)",
                                whiteSpace: "nowrap",
                                display: "inline-block",
                                width: "auto",
                                maxWidth: "100%",
                                overflow: "visible"
                            }}
                        >
                            CREWHOLIC
                        </motion.h1>
                    </div>

                    {/* Orb Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
                        className="my-6 md:my-8"
                    >
                        <OrbVisual />
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                        className="text-sm md:text-base lg:text-lg mt-4 md:mt-6 max-w-xl mx-auto leading-relaxed px-4"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                        We are a fusion-powered digital agency dedicated to{" "}
                        <span style={{ color: "#FF6B2B" }}>transforming ideas into extraordinary digital realities.</span>
                    </motion.p>

                    {/* Discover Scroll Cue */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="mt-10 md:mt-12 flex flex-col items-center gap-2"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-px h-8 md:h-10"
                            style={{ background: "linear-gradient(180deg, transparent, rgba(255,107,43,0.5), transparent)" }}
                        />
                        <span 
                            className="text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] uppercase" 
                            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}
                        >
                            Discover
                        </span>
                    </motion.div>
                </motion.div>
            </section>

            {/* Rest of the sections remain the same as before... */}
            {/* ── MISSION & VISION ── */}
            <section className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, 0, 0]} translateFrom={[0, 60, -80]} scaleFrom={0.85}>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                        <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                        <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>Core Purpose</span>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    <Scroll3DCard index={0} direction="left">
                        <div
                            className="p-6 md:p-8 rounded-2xl text-center"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <div className="text-4xl md:text-5xl mb-4">🎯</div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: "#FF6B2B" }}>Our Mission</h3>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed">To empower businesses with cutting-edge digital solutions that drive measurable growth, create unforgettable experiences, and dominate their markets.</p>
                        </div>
                    </Scroll3DCard>

                    <Scroll3DCard index={1} direction="right">
                        <div
                            className="p-6 md:p-8 rounded-2xl text-center"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <div className="text-4xl md:text-5xl mb-4">👁️</div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: "#A855F7" }}>Our Vision</h3>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed">To become the world's most innovative digital agency, recognized for transforming ideas into extraordinary digital realities that shape the future.</p>
                        </div>
                    </Scroll3DCard>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[20, 0, 0]} translateFrom={[0, 80, -100]}>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                        <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                        <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>By The Numbers</span>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
                    {stats.map((stat, index) => {
                        const dirs: Array<"left"|"right"|"up"|"down"> = ["up","down","left","right","up","down","left","right"];
                        return (
                            <Scroll3DCard key={index} index={index} direction={dirs[index % dirs.length]}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-3 md:p-6 rounded-2xl text-center"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <div className="text-xl md:text-3xl mb-1 md:mb-3">{stat.icon}</div>
                                    <div className="text-lg md:text-2xl lg:text-3xl font-bold text-orange-500 mb-1 md:mb-2">{stat.value}</div>
                                    <div className="text-gray-400 text-[10px] md:text-sm">{stat.label}</div>
                                </motion.div>
                            </Scroll3DCard>
                        );
                    })}
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[0, 30, 0]} translateFrom={[-60, 40, -80]}>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                        <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                        <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>Core Principles</span>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
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
                                    className="p-4 md:p-6 rounded-2xl text-center"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <div className="text-3xl md:text-5xl mb-3 md:mb-4">{value.icon}</div>
                                    <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3" style={{ color: "#FF6B2B" }}>{value.title}</h3>
                                    <p className="text-gray-400 text-xs md:text-sm">{value.description}</p>
                                </motion.div>
                            </Scroll3DReveal>
                        );
                    })}
                </div>
            </section>

            {/* ── MILESTONES ── */}
            <section className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[25, 0, 0]} translateFrom={[0, 80, -100]}>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                        <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                        <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>Our Journey</span>
                    </div>
                </Scroll3DReveal>

                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full" style={{ background: "linear-gradient(180deg, transparent, #FF6B2B, #A855F7, transparent)" }} />
                    {milestones.map((milestone, index) => (
                        <MilestoneNode key={index} milestone={milestone} index={index} />
                    ))}
                </div>
            </section>

            {/* ── TEAM GRID ── */}
            <section className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, -10, 0]} translateFrom={[40, 60, -80]}>
                    <div className="flex items-center gap-4 mb-12 md:mb-16">
                        <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                        <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>Meet The Team</span>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
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
                                className="relative w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto p-6 md:p-8 text-center"
                                style={{
                                    background: "linear-gradient(135deg, rgba(20,20,30,0.98), rgba(10,10,15,0.98))",
                                    backdropFilter: "blur(20px)",
                                    border: `1px solid ${selectedMember.accent}33`,
                                    boxShadow: `0 25px 50px -12px ${selectedMember.accent}40`,
                                }}
                            >
                                <button onClick={() => setShowTeamModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white text-2xl transition-colors">×</button>
                                <div
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl md:text-5xl mx-auto mb-4"
                                    style={{ background: `linear-gradient(135deg, ${selectedMember.accent}40, ${selectedMember.accent}20)`, border: `2px solid ${selectedMember.accent}` }}
                                >
                                    {selectedMember.icon}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-1">{selectedMember.name}</h3>
                                <p className="text-base md:text-lg mb-4" style={{ color: selectedMember.accent }}>{selectedMember.position}</p>
                                <p className="text-gray-300 text-sm md:text-base mb-6">{selectedMember.bio}</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {selectedMember.tags.map((tag) => (
                                        <span key={tag} className="text-[10px] px-3 py-1.5 rounded-full tracking-widest uppercase font-medium"
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

            {/* ── CTA SECTION ── */}
            <section className="relative py-20 md:py-32 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(ellipse at center, #FF6B2B 0%, transparent 65%)" }} />

                <Scroll3DReveal rotateFrom={[30, 0, 0]} translateFrom={[0, 100, -200]} scaleFrom={0.65}>
                    <div className="relative z-10">
                        <p className="text-[10px] tracking-[0.4em] uppercase mb-4 md:mb-6" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>Ready to dominate?</p>
                        <h2
                            className="font-extrabold leading-[1.2] tracking-tighter mb-6 md:mb-8"
                            style={{ ...gradientStyle, fontSize: "clamp(28px, 5vw, 80px)", fontFamily: "'Syne', sans-serif" }}
                        >
                            LET'S CREATE<br />SOMETHING<br />LEGENDARY.
                        </h2>
                        <MagneticButton>
                            <motion.a
                                href="/service"
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                className="relative overflow-hidden px-6 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm tracking-widest uppercase font-bold inline-block"
                                style={{ background: "linear-gradient(135deg, #FF6B2B, #E85520)", color: "#0C0C0C", fontFamily: "'Syne', sans-serif", boxShadow: "0 0 40px rgba(255,107,43,0.3)" }}
                            >
                                <span className="relative z-10">Explore Services</span>
                                <motion.div
                                    className="absolute inset-0"
                                    initial={{ x: "-100%" }} whileHover={{ x: "0%" }} transition={{ duration: 0.4 }}
                                    style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)" }}
                                />
                            </motion.a>
                        </MagneticButton>
                    </div>
                </Scroll3DReveal>
            </section>

            {/* FOOTER */}
            <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-center" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}>© 2025 Crewholic. All rights reserved.</span>
                <div className="flex gap-6">
                    <a href="#" className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase hover:text-[#FF6B2B] transition-colors" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>Privacy</a>
                    <a href="#" className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase hover:text-[#FF6B2B] transition-colors" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>Terms</a>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;