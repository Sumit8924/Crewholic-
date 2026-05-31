/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

// Team Members Data
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

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="relative group cursor-pointer"
        >
            {/* Glow */}
            <motion.div
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-2xl blur-xl -z-10"
                style={{
                    background: `radial-gradient(ellipse at center, ${member.accent}33 0%, transparent 70%)`,
                }}
            />

            {/* Card */}
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
                {/* Corner accent */}
                <motion.div
                    animate={{ scaleX: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-0 h-0.5 w-full origin-left"
                    style={{ background: `linear-gradient(90deg, ${member.accent}, transparent)` }}
                />

                {/* Number */}
                <div
                    className="text-xs font-mono mb-4 tracking-widest"
                    style={{ color: member.accent + "99" }}
                >
                    {String(index + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <motion.div
                    animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 15 : 0 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                    className="text-4xl mb-4"
                    style={{ color: member.accent }}
                >
                    {member.icon}
                </motion.div>

                {/* Title */}
                <h3
                    className="text-xl font-semibold mb-2 tracking-tight transition-colors duration-300"
                    style={{
                        color: hovered ? "#fff" : "#e5e5e5",
                        fontFamily: "'Syne', sans-serif",
                    }}
                >
                    {member.name}
                </h3>

                {/* Position */}
                <p className="text-sm mb-3" style={{ color: member.accent }}>
                    {member.position}
                </p>

                {/* Bio */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#888" }}>
                    {member.bio}
                </p>

                {/* Tags */}
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

                {/* Arrow */}
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
    );
}

function OrbVisual() {
    const orbs = [
        { size: 320, color: "#FF6B2B", opacity: 0.12, dur: 8 },
        { size: 220, color: "#A855F7", opacity: 0.15, dur: 6 },
        { size: 140, color: "#FF6B2B", opacity: 0.2, dur: 4 },
    ];

    return (
        <div className="relative flex items-center justify-center w-72 h-72 mx-auto">
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
                    animate={{
                        scale: [1, 1.08, 1],
                        rotate: [0, 360],
                    }}
                    transition={{
                        scale: { duration: orb.dur, repeat: Infinity, ease: "easeInOut" },
                        rotate: {
                            duration: orb.dur * 4,
                            repeat: Infinity,
                            ease: "linear",
                            direction: i % 2 === 0 ? "normal" : "reverse",
                        },
                    }}
                />
            ))}

            {/* Center ring */}
            <motion.div
                className="absolute rounded-full border"
                style={{
                    width: 100,
                    height: 100,
                    borderColor: "rgba(255,107,43,0.3)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute rounded-full border"
                style={{
                    width: 140,
                    height: 140,
                    borderColor: "rgba(168,85,247,0.2)",
                    borderStyle: "dashed",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Core */}
            <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                    background: "radial-gradient(circle, #FF6B2B44 0%, #A855F722 50%, transparent 100%)",
                    border: "1px solid rgba(255,107,43,0.4)",
                    boxShadow: "0 0 30px #FF6B2B33, inset 0 0 20px #A855F711",
                }}
            >
                <span style={{ fontSize: 22, filter: "drop-shadow(0 0 8px #FF6B2B)" }}>⬡</span>
            </div>
        </div>
    );
}

function AboutPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
    const [showTeamModal, setShowTeamModal] = useState(false);

    useEffect(() => {
        // Load Google Fonts
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap";
        document.head.appendChild(link);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const gradientStyle = {
        background: "linear-gradient(135deg, #C0C0C0 0%, #FFFFFF 20%, #A8A8A8 40%, #E8E8E8 55%, #888 70%, #FFFFFF 85%, #C0C0C0 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
    };

    const handleTeamClick = (member: typeof teamMembers[0]) => {
        setSelectedMember(member);
        setShowTeamModal(true);
    };

    return (
        <div
            className="min-h-screen overflow-x-hidden"
            style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}
        >
            {/* Cursor glow */}
            <motion.div
                className="fixed pointer-events-none z-50 rounded-full"
                style={{
                    width: 400,
                    height: 400,
                    background: "radial-gradient(circle, rgba(255,107,43,0.05) 0%, transparent 70%)",
                    x: mousePos.x - 200,
                    y: mousePos.y - 200,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
            />

            {/* ── NAVBAR ── */}
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(180deg, rgba(12,12,12,0.95) 0%, transparent 100%)",
                    }}
                />

                {/* Logo */}
                <motion.a
                    href="/"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-sm font-bold tracking-[0.25em] uppercase"
                    style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}
                >
                    CREWHOLIC
                </motion.a>

                {/* Nav links */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative z-10 hidden md:flex items-center gap-8"
                >
                    {["About", "Services", "Price", "Projects", "Contact"].map((item) => (
                        <a
                            key={item}
                            href={item === "Services" ? "/service" : `/${item.toLowerCase()}`}
                            className="text-xs tracking-widest uppercase transition-colors duration-200"
                            style={{
                                color: item === "About" ? "#FF6B2B" : "rgba(255,255,255,0.45)",
                                fontFamily: "'Space Mono', monospace",
                            }}
                        >
                            {item}
                        </a>
                    ))}
                </motion.div>

                {/* Contact button */}
                <MagneticButton className="relative z-10">
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="relative overflow-hidden text-xs tracking-widest uppercase px-5 py-2.5 rounded-full font-medium transition-all duration-300 group"
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: "'Space Mono', monospace",
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
                    </motion.button>
                </MagneticButton>
            </nav>

            {/* ── HERO SECTION ── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
                        `,
                        backgroundSize: "80px 80px",
                    }}
                />

                {/* Ambient glow blobs */}
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
                    style={{ background: "#FF6B2B" }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
                    style={{ background: "#A855F7" }}
                />

                {/* Bottom-left label */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="absolute bottom-12 left-8 hidden md:block"
                >
                    <p
                        className="text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}
                    >
                        Fusion-Powered Agency
                    </p>
                    <p
                        className="text-[10px] tracking-[0.3em] uppercase mt-1"
                        style={{ color: "rgba(255,107,43,0.4)", fontFamily: "'Space Mono', monospace" }}
                    >
                        ◎ Est. 2016
                    </p>
                </motion.div>

                {/* Main content */}
                <div className="relative z-10 text-center max-w-5xl mx-auto">
                    {/* Pre-label */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center justify-center gap-3 mb-8"
                    >
                        <div className="h-px w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                        <span
                            className="text-[10px] tracking-[0.4em] uppercase"
                            style={{ color: "#FF6B2B99", fontFamily: "'Space Mono', monospace" }}
                        >
                            Our Story
                        </span>
                        <div className="h-px w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                    </motion.div>

                    {/* ABOUT heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="font-extrabold leading-none tracking-tighter mb-6"
                        style={{
                            ...gradientStyle,
                            fontSize: "clamp(72px, 14vw, 180px)",
                            fontFamily: "'Syne', sans-serif",
                            textShadow: "0 0 80px rgba(255,255,255,0.05)",
                        }}
                    >
                        ABOUT
                    </motion.h1>

                    {/* Orb visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
                    >
                        <OrbVisual />
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                        className="text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                        We are a fusion-powered digital agency dedicated to{" "}
                        <span style={{ color: "#FF6B2B" }}>transforming ideas into extraordinary digital realities.</span>
                    </motion.p>

                    {/* Scroll cue */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="mt-12 flex flex-col items-center gap-2"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-px h-10"
                            style={{
                                background: "linear-gradient(180deg, transparent, rgba(255,107,43,0.5), transparent)",
                            }}
                        />
                        <span
                            className="text-[9px] tracking-[0.4em] uppercase"
                            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}
                        >
                            Discover
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* ── MISSION & VISION ── */}
            <section className="relative py-24 px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4 mb-16"
                >
                    <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                    <span
                        className="text-[10px] tracking-[0.4em] uppercase"
                        style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}
                    >
                        Core Purpose
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="p-8 rounded-2xl text-center"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: "#FF6B2B" }}>Our Mission</h3>
                        <p className="text-gray-400 leading-relaxed">
                            To empower businesses with cutting-edge digital solutions that drive measurable growth, 
                            create unforgettable experiences, and dominate their markets.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="p-8 rounded-2xl text-center"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        <div className="text-5xl mb-4">👁️</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: "#A855F7" }}>Our Vision</h3>
                        <p className="text-gray-400 leading-relaxed">
                            To become the world's most innovative digital agency, recognized for transforming ideas 
                            into extraordinary digital realities that shape the future.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── STATS SECTION ── */}
            <section className="relative py-24 px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4 mb-16"
                >
                    <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                    <span
                        className="text-[10px] tracking-[0.4em] uppercase"
                        style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}
                    >
                        By The Numbers
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-2xl text-center transition-all"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                            }}
                        >
                            <div className="text-3xl mb-3">{stat.icon}</div>
                            <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">{stat.value}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── VALUES SECTION ── */}
            <section className="relative py-24 px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4 mb-16"
                >
                    <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                    <span
                        className="text-[10px] tracking-[0.4em] uppercase"
                        style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}
                    >
                        Core Principles
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="p-6 rounded-2xl text-center transition-all"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                            }}
                        >
                            <div className="text-5xl mb-4">{value.icon}</div>
                            <h3 className="text-xl font-bold mb-3" style={{ color: "#FF6B2B" }}>{value.title}</h3>
                            <p className="text-gray-400 text-sm">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── MILESTONES TIMELINE ── */}
            <section className="relative py-24 px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4 mb-16"
                >
                    <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                    <span
                        className="text-[10px] tracking-[0.4em] uppercase"
                        style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}
                    >
                        Our Journey
                    </span>
                </motion.div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full" style={{ background: "linear-gradient(180deg, transparent, #FF6B2B, #A855F7, transparent)" }} />
                    
                    {milestones.map((milestone, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative flex flex-col md:flex-row items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        >
                            <div className="flex-1 text-center md:text-right p-6">
                                <h3 className="text-xl font-bold" style={{ color: "#F2994A" }}>{milestone.title}</h3>
                                <p className="text-gray-400 text-sm mt-2">{milestone.description}</p>
                            </div>
                            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full mx-4" style={{ background: "linear-gradient(135deg, #FF6B2B, #A855F7)" }}>
                                <span className="text-white font-bold text-sm">{milestone.year.slice(-2)}</span>
                            </div>
                            <div className="flex-1 text-center md:text-left p-6">
                                <span className="text-2xl font-bold" style={{ color: "#9B51E0" }}>{milestone.year}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── TEAM GRID ── */}
            <section className="relative py-24 px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4 mb-16"
                >
                    <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                    <span
                        className="text-[10px] tracking-[0.4em] uppercase"
                        style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}
                    >
                        Meet The Team
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                    {teamMembers.map((member, i) => (
                        <TeamCard
                            key={member.id}
                            member={member}
                            index={i}
                            onClick={() => handleTeamClick(member)}
                        />
                    ))}
                </div>
            </section>

            {/* ── TEAM MODAL ── */}
            <AnimatePresence>
                {showTeamModal && selectedMember && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTeamModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div 
                                className="relative w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto p-8 text-center"
                                style={{
                                    background: "linear-gradient(135deg, rgba(20,20,30,0.98), rgba(10,10,15,0.98))",
                                    backdropFilter: "blur(20px)",
                                    border: `1px solid ${selectedMember.accent}33`,
                                    boxShadow: `0 25px 50px -12px ${selectedMember.accent}40`,
                                }}
                            >
                                <button
                                    onClick={() => setShowTeamModal(false)}
                                    className="absolute top-5 right-5 text-gray-400 hover:text-white text-2xl transition-colors"
                                >
                                    ×
                                </button>
                                
                                <div 
                                    className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4"
                                    style={{
                                        background: `linear-gradient(135deg, ${selectedMember.accent}40, ${selectedMember.accent}20)`,
                                        border: `2px solid ${selectedMember.accent}`,
                                    }}
                                >
                                    {selectedMember.icon}
                                </div>
                                
                                <h3 className="text-2xl font-bold mb-1">{selectedMember.name}</h3>
                                <p className="text-lg mb-4" style={{ color: selectedMember.accent }}>{selectedMember.position}</p>
                                <p className="text-gray-300 mb-6">{selectedMember.bio}</p>
                                
                                <div className="flex flex-wrap justify-center gap-2">
                                    {selectedMember.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] px-3 py-1.5 rounded-full tracking-widest uppercase font-medium"
                                            style={{
                                                background: selectedMember.accent + "15",
                                                color: selectedMember.accent + "cc",
                                                border: `1px solid ${selectedMember.accent}22`,
                                            }}
                                        >
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
            <section className="relative py-32 px-6 text-center overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        background: "radial-gradient(ellipse at center, #FF6B2B 0%, transparent 65%)",
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <p
                        className="text-[10px] tracking-[0.4em] uppercase mb-6"
                        style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}
                    >
                        Ready to dominate?
                    </p>
                    <h2
                        className="font-extrabold leading-none tracking-tighter mb-8"
                        style={{
                            ...gradientStyle,
                            fontSize: "clamp(40px, 7vw, 96px)",
                            fontFamily: "'Syne', sans-serif",
                        }}
                    >
                        LET'S CREATE
                        <br />
                        SOMETHING
                        <br />
                        LEGENDARY.
                    </h2>

                    <MagneticButton>
                        <motion.a
                            href="/service"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative overflow-hidden px-10 py-4 rounded-full text-sm tracking-widest uppercase font-bold inline-block"
                            style={{
                                background: "linear-gradient(135deg, #FF6B2B, #E85520)",
                                color: "#0C0C0C",
                                fontFamily: "'Syne', sans-serif",
                                boxShadow: "0 0 40px rgba(255,107,43,0.3)",
                            }}
                        >
                            <span className="relative z-10">Explore Services</span>
                            <motion.div
                                className="absolute inset-0"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "0%" }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    background: "linear-gradient(135deg, #A855F7, #7C3AED)",
                                }}
                            />
                        </motion.a>
                    </MagneticButton>
                </motion.div>
            </section>

            {/* ── FOOTER LINE ── */}
            <div className="px-8 py-6 flex items-center justify-between border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}
                >
                    © 2025 Crewholic
                </span>
                <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}
                >
                    All rights reserved
                </span>
            </div>
        </div>
    );
}

export default AboutPage;