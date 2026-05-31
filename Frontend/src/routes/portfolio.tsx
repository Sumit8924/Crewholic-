/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/portfolio")({
    component: PortfolioPage,
});

// Portfolio Projects Data
const projects = [
    {
        id: "01",
        title: "Augustine",
        category: "Hospitality",
        description: "Luxury restaurant brand identity and digital experience design.",
        longDesc: "A complete brand transformation for a high-end restaurant in San Jose. We created a sophisticated visual identity, custom website, and immersive dining experience that elevated their market presence.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        accent: "#FF6B2B",
        tags: ["Brand Identity", "Web Design", "Packaging"],
        deliverables: ["Logo Design", "Menu Design", "Website", "Social Media Kit"],
        year: "2024",
        location: "San Jose, California",
    },
    {
        id: "02",
        title: "Magic Donuts",
        category: "Retail",
        description: "Playful brand identity and digital presence for a trendy donut shop.",
        longDesc: "Created a whimsical brand identity that captures the magic of artisanal donuts. The project included packaging design, social media strategy, and a fun, engaging website.",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
        accent: "#4ecdc4",
        tags: ["Brand Identity", "Packaging", "Social Media"],
        deliverables: ["Logo Design", "Packaging", "Website", "Social Strategy"],
        year: "2024",
        location: "San Francisco, California",
    },
    {
        id: "03",
        title: "Louie's Original",
        category: "Hospitality",
        description: "Vintage-inspired branding for a classic American eatery.",
        longDesc: "Developed a nostalgic brand identity that honors tradition while appealing to modern diners. The project featured custom typography, retro color palette, and comprehensive brand guidelines.",
        image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80",
        accent: "#ffe66d",
        tags: ["Brand Identity", "Typography", "Illustration"],
        deliverables: ["Logo Design", "Brand Guidelines", "Merchandise", "Menu"],
        year: "2023",
        location: "San Francisco, California",
    },
    {
        id: "04",
        title: "Old Navy Flagship",
        category: "Retail",
        description: "Immersive digital experience for a flagship retail store.",
        longDesc: "Created an engaging digital ecosystem for the iconic Old Navy flagship location. The project included interactive kiosks, mobile integration, and a seamless omnichannel experience.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        accent: "#a8e6cf",
        tags: ["Web Development", "3D", "Interactive"],
        deliverables: ["Interactive Kiosks", "Mobile App", "Website", "Analytics"],
        year: "2023",
        location: "New York, NY",
    },
    {
        id: "05",
        title: "GAP Times Square",
        category: "Retail",
        description: "Digital transformation for a premier retail destination.",
        longDesc: "Led the digital transformation for GAP's flagship Times Square location. The project featured immersive visual displays, real-time inventory integration, and personalized shopping experiences.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        accent: "#ff8c42",
        tags: ["Digital Strategy", "Web Development", "Analytics"],
        deliverables: ["Digital Displays", "E-commerce", "CRM Integration", "Analytics Dashboard"],
        year: "2024",
        location: "New York, NY",
    },
    {
        id: "06",
        title: "Nebula Studios",
        category: "Digital",
        description: "Cutting-edge 3D web experience for a creative studio.",
        longDesc: "Built an immersive 3D portfolio website that showcases creative work in an interactive environment. The project featured WebGL animations, particle systems, and seamless navigation.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
        accent: "#8b5cf6",
        tags: ["Three.js", "3D", "WebGL"],
        deliverables: ["3D Website", "Particle System", "Interactive UI", "Performance Optimization"],
        year: "2024",
        location: "Los Angeles, California",
    },
    {
        id: "07",
        title: "EcoChic",
        category: "Sustainability",
        description: "Sustainable brand identity and digital presence for eco-friendly fashion.",
        longDesc: "Created a cohesive brand identity for a sustainable fashion brand. The project included eco-conscious packaging, minimalist website design, and a compelling brand story.",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
        accent: "#4caf50",
        tags: ["Brand Identity", "Web Design", "Sustainability"],
        deliverables: ["Logo Design", "Website", "Packaging", "Brand Guidelines"],
        year: "2024",
        location: "Portland, Oregon",
    },
    {
        id: "08",
        title: "Quantum Finance",
        category: "Fintech",
        description: "Modern fintech platform with seamless user experience.",
        longDesc: "Developed a cutting-edge fintech platform that simplifies complex financial operations. The project featured real-time data visualization, secure authentication, and intuitive dashboard design.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        accent: "#06b6d4",
        tags: ["Web App", "Dashboard", "Data Visualization"],
        deliverables: ["Web Platform", "Dashboard", "Analytics", "API Integration"],
        year: "2024",
        location: "Remote",
    },
];

// Categories for filtering
const categories = ["All", "Hospitality", "Retail", "Digital", "Sustainability", "Fintech"];

function MagneticButton({
    children,
    className,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
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

function ProjectCard({
    project,
    index,
    onClick,
}: {
    project: typeof projects[0];
    index: number;
    onClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
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
                    background: `radial-gradient(ellipse at center, ${project.accent}33 0%, transparent 70%)`,
                }}
            />

            {/* Card */}
            <div
                className="relative rounded-2xl overflow-hidden border transition-all duration-300"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)",
                    borderColor: hovered ? project.accent + "55" : "rgba(255,255,255,0.07)",
                    boxShadow: hovered
                        ? `0 0 40px ${project.accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`
                        : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
            >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: hovered ? 1.1 : 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div
                        className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full font-medium"
                        style={{
                            background: project.accent + "CC",
                            color: "#fff",
                        }}
                    >
                        {project.category}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Number */}
                    <div
                        className="text-xs font-mono mb-2 tracking-widest"
                        style={{ color: project.accent + "99" }}
                    >
                        {project.id}
                    </div>

                    {/* Title */}
                    <h3
                        className="text-xl font-semibold mb-2 tracking-tight transition-colors duration-300"
                        style={{
                            color: hovered ? "#fff" : "#e5e5e5",
                            fontFamily: "'Syne', sans-serif",
                        }}
                    >
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "#888" }}>
                        {project.description}
                    </p>

                    {/* Location & Year */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{project.location}</span>
                        <span>{project.year}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase font-medium"
                                style={{
                                    background: project.accent + "15",
                                    color: project.accent + "cc",
                                    border: `1px solid ${project.accent}22`,
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                        {project.tags.length > 2 && (
                            <span
                                className="text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase font-medium"
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    color: "#888",
                                }}
                            >
                                +{project.tags.length - 2}
                            </span>
                        )}
                    </div>
                </div>

                {/* Arrow */}
                <motion.div
                    animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-5 right-5 text-sm"
                    style={{ color: project.accent }}
                >
                    →
                </motion.div>
            </div>
        </motion.div>
    );
}

function ProjectModal({
    project,
    isOpen,
    onClose,
}: {
    project: typeof projects[0] | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
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
                            className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl pointer-events-auto"
                            style={{
                                background: "linear-gradient(135deg, rgba(20,20,30,0.98), rgba(10,10,15,0.98))",
                                backdropFilter: "blur(20px)",
                                border: `1px solid ${project.accent}33`,
                                boxShadow: `0 25px 50px -12px ${project.accent}40, 0 0 0 1px ${project.accent}20 inset`,
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-black/50 text-gray-400 hover:text-white transition-colors text-2xl flex items-center justify-center"
                            >
                                ×
                            </button>

                            {/* Image */}
                            <div className="relative h-64 md:h-96 overflow-hidden rounded-t-3xl">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                
                                {/* Category Badge */}
                                <div
                                    className="absolute bottom-5 left-6 text-sm px-4 py-1.5 rounded-full font-medium"
                                    style={{
                                        background: project.accent + "CC",
                                        color: "#fff",
                                    }}
                                >
                                    {project.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                <div className="flex flex-wrap justify-between items-start mb-6">
                                    <div>
                                        <div
                                            className="text-xs font-mono mb-2 tracking-widest"
                                            style={{ color: project.accent + "99" }}
                                        >
                                            {project.id}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: project.accent }}>
                                            {project.title}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400">{project.location}</div>
                                        <div className="text-sm text-gray-400">{project.year}</div>
                                    </div>
                                </div>

                                <p className="text-gray-300 leading-relaxed mb-6">
                                    {project.longDesc}
                                </p>

                                {/* Tags */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Technologies & Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-3 py-1.5 rounded-full font-medium"
                                                style={{
                                                    background: project.accent + "15",
                                                    color: project.accent + "cc",
                                                    border: `1px solid ${project.accent}22`,
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Deliverables */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Deliverables</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {project.deliverables.map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-2 text-sm text-gray-300"
                                            >
                                                <span style={{ color: project.accent }}>✓</span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <MagneticButton>
                                        <a
                                            href="/contact"
                                            className="inline-block px-8 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
                                            style={{
                                                background: `linear-gradient(135deg, ${project.accent}, ${project.accent}CC)`,
                                                color: "#fff",
                                            }}
                                        >
                                            Start a Similar Project →
                                        </a>
                                    </MagneticButton>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
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

function PortfolioPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    const handleProjectClick = (project: typeof projects[0]) => {
        setSelectedProject(project);
        setIsModalOpen(true);
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
                            href={item === "Services" ? "/service" : item === "Projects" ? "/portfolio" : `/${item.toLowerCase()}`}
                            className="text-xs tracking-widest uppercase transition-colors duration-200"
                            style={{
                                color: item === "Projects" ? "#FF6B2B" : "rgba(255,255,255,0.45)",
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
                        Featured Work
                    </p>
                    <p
                        className="text-[10px] tracking-[0.3em] uppercase mt-1"
                        style={{ color: "rgba(255,107,43,0.4)", fontFamily: "'Space Mono', monospace" }}
                    >
                        ◎ 08 Projects
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
                            Our Portfolio
                        </span>
                        <div className="h-px w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                    </motion.div>

                    {/* PORTFOLIO heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="font-extrabold leading-none tracking-tighter mb-6"
                        style={{
                            ...gradientStyle,
                            fontSize: "clamp(40px, 5vw, 120px)",
                            fontFamily: "'Syne', sans-serif",
                            textShadow: "0 0 80px rgba(255,255,255,0.05)",
                        }}
                    >
                        PORTFOLIO
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
                        Exploring creative boundaries and delivering{" "}
                        <span style={{ color: "#FF6B2B" }}>exceptional digital experiences.</span>
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
                        Explore
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* ── CATEGORY FILTER ── */}
            <section className="relative py-12 px-6 md:px-12">
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(category)}
                            className="px-5 py-2 rounded-full text-xs tracking-widest uppercase font-medium transition-all"
                            style={{
                                background: activeCategory === category
                                    ? "linear-gradient(135deg, #FF6B2B, #A855F7)"
                                    : "rgba(255,255,255,0.05)",
                                color: activeCategory === category ? "#fff" : "rgba(255,255,255,0.6)",
                                border: activeCategory === category ? "none" : "1px solid rgba(255,255,255,0.1)",
                            }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* ── PROJECTS GRID ── */}
            <section className="relative py-12 px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4 mb-12"
                >
                    <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                    <span
                        className="text-[10px] tracking-[0.4em] uppercase"
                        style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}
                    >
                        Featured Work
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onClick={() => handleProjectClick(project)}
                        />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400">No projects found in this category.</p>
                    </div>
                )}
            </section>

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
                        Have a project in mind?
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
                        EXTRAORDINARY.
                    </h2>

                    <MagneticButton>
                        <motion.a
                            href="/contact"
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
                            <span className="relative z-10">Start a Project</span>
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

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default PortfolioPage;