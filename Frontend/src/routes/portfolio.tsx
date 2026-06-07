/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, useScroll, useTransform } from "framer-motion";

export const Route = createFileRoute("/portfolio")({
    component: PortfolioPage,
});

// ─── DATA ───────────────────────────────────────────────────────────────────
const projects = [
    {
        id: "01",
        title: "Augustine",
        category: "Hospitality",
        description: "Luxury restaurant brand identity and digital experience design.",
        longDesc: "A complete brand transformation for a high-end restaurant in San Jose. We created a sophisticated visual identity, custom website, and immersive dining experience that elevated their market presence.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        accent: "#9B51E0",
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
        accent: "#F2994A",
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

const categories = ["All", "Hospitality", "Retail", "Digital", "Sustainability", "Fintech"];

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
function MagneticButton({ children, className, onClick }: {
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

// ─── PROJECT CARD ───────────────────────────────────────────────────────────
function ProjectCard({ project, index, onClick }: {
    project: typeof projects[0];
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

    const directions: Array<"left" | "right" | "up" | "down"> = ["left", "up", "right", "down", "left", "up", "right", "down"];

    return (
        <Scroll3DCard index={index} direction={directions[index % directions.length]}>
            <motion.div
                ref={cardRef}
                style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 800 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                className="relative group cursor-pointer active:scale-95 transition-transform h-full"
            >
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-2xl blur-xl -z-10"
                    style={{ background: `radial-gradient(ellipse at center, ${project.accent}33 0%, transparent 70%)` }}
                />
                <div
                    className="relative rounded-2xl overflow-hidden border transition-all duration-300 h-full flex flex-col"
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
                    <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                        <motion.img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            animate={{ scale: hovered ? 1.1 : 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div
                            className="absolute top-3 left-3 text-[9px] sm:text-[10px] px-2 py-1 rounded-full font-medium"
                            style={{ background: project.accent + "CC", color: "#fff" }}
                        >
                            {project.category}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        <div className="text-[10px] sm:text-xs font-mono mb-1 sm:mb-2 tracking-widest" style={{ color: project.accent + "99" }}>
                            {project.id}
                        </div>

                        <h3
                            className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 tracking-tight transition-colors duration-300"
                            style={{ color: hovered ? "#fff" : "#e5e5e5", fontFamily: "'Syne', sans-serif" }}
                        >
                            {project.title}
                        </h3>

                        <p className="text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 flex-1" style={{ color: "#888" }}>
                            {project.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                            <span className="truncate pr-2">{project.location}</span>
                            <span>{project.year}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {project.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase font-medium"
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
                                    className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase font-medium"
                                    style={{ background: "rgba(255,255,255,0.1)", color: "#888" }}
                                >
                                    +{project.tags.length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </Scroll3DCard>
    );
}

// ─── PROJECT MODAL ──────────────────────────────────────────────────────────
function ProjectModal({ project, isOpen, onClose }: {
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none"
                    >
                        <div
                            className="relative w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl pointer-events-auto"
                            style={{
                                background: "linear-gradient(135deg, rgba(20,20,30,0.98), rgba(10,10,15,0.98))",
                                backdropFilter: "blur(20px)",
                                border: `1px solid ${project.accent}33`,
                                boxShadow: `0 25px 50px -12px ${project.accent}40, 0 0 0 1px ${project.accent}20 inset`,
                            }}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-md text-gray-400 hover:text-white transition-colors text-xl sm:text-2xl flex items-center justify-center active:scale-90"
                            >
                                ×
                            </button>

                            <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                
                                <div
                                    className="absolute bottom-3 sm:bottom-5 left-4 sm:left-6 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-medium"
                                    style={{ background: project.accent + "CC", color: "#fff" }}
                                >
                                    {project.category}
                                </div>
                            </div>

                            <div className="p-5 sm:p-6 md:p-8">
                                <div className="flex flex-wrap justify-between items-start mb-4 sm:mb-6 gap-2">
                                    <div>
                                        <div className="text-[10px] sm:text-xs font-mono mb-1 sm:mb-2 tracking-widest" style={{ color: project.accent + "99" }}>
                                            {project.id}
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: project.accent }}>
                                            {project.title}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs sm:text-sm text-gray-400">{project.location}</div>
                                        <div className="text-xs sm:text-sm text-gray-400">{project.year}</div>
                                    </div>
                                </div>

                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                                    {project.longDesc}
                                </p>

                                <div className="mb-4 sm:mb-6">
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3">Technologies & Skills</h4>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium"
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

                                <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3">Deliverables</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                                        {project.deliverables.map((item) => (
                                            <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                                                <span style={{ color: project.accent }}>✓</span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                                    <MagneticButton>
                                        <motion.a
                                            href="/contact"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all"
                                            style={{
                                                background: `linear-gradient(135deg, ${project.accent}, ${project.accent}CC)`,
                                                color: "#fff",
                                            }}
                                        >
                                            Start a Similar Project →
                                        </motion.a>
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

// ─── MAIN PORTFOLIO PAGE ────────────────────────────────────────────────────
function PortfolioPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    const handleProjectClick = (project: typeof projects[0]) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}>
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
                                            color: item.label === "Portfolio" ? "#F2994A" : "#D7E2EA",
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
                                color: item.label === "Portfolio" ? "#F2994A" : "#D7E2EA",
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
                    <div className="w-full overflow-hidden flex justify-center">
                        <FadeIn delay={0.15} y={40} className="w-full flex justify-center">
                            <h1
                                className="hero-heading font-black uppercase tracking-tight leading-none text-center"
                                style={{
                                    ...gradientStyle,
                                    fontSize: "min(15vw, 9vw, 280px)",
                                    fontFamily: "'Syne', sans-serif",
                                    letterSpacing: "-0.04em",
                                    whiteSpace: "nowrap",
                                    lineHeight: "0.9",
                                    padding: "0 8px",
                                }}
                            >
                                PORTFOLIO
                            </h1>
                        </FadeIn>
                    </div>

                    {/* Decorative divider */}
                    <FadeIn delay={0.4} y={20} className="flex justify-center mt-4 sm:mt-6">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-px w-8 sm:w-12 md:w-24" style={{ background: "linear-gradient(90deg, transparent, #9B51E0)" }} />
                            <span className="text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                                Featured Work
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
                            EXPLORING CREATIVE BOUNDARIES DELIVERING EXCEPTIONAL DIGITAL EXPERIENCES
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.5} y={20} className="w-full sm:w-auto flex justify-end">
                        <ContactButton label="START PROJECT" href="/contact" />
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* PROJECT STATS                                                   */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, 0, 0]} translateFrom={[0, 60, -80]} scaleFrom={0.85}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
                        {[
                            { value: "150+", label: "Projects Delivered", icon: "🚀" },
                            { value: "98%", label: "Client Satisfaction", icon: "⭐" },
                            { value: "25+", label: "Industries Served", icon: "🌍" },
                            { value: "12", label: "Awards Won", icon: "🏆" },
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

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CATEGORY FILTER                                                 */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative pt-4 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12">
                <Scroll3DReveal rotateFrom={[10, 0, 0]} translateFrom={[0, 40, -60]} scaleFrom={0.9}>
                    <div className="text-center mb-6 sm:mb-8">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Filter by Category ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase mb-6 sm:mb-8" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Browse Work
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveCategory(category)}
                                className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs tracking-widest uppercase font-medium transition-all"
                                style={{
                                    background: activeCategory === category
                                        ? "linear-gradient(135deg, #9B51E0, #F2994A)"
                                        : "rgba(255,255,255,0.05)",
                                    color: activeCategory === category ? "#fff" : "rgba(255,255,255,0.6)",
                                    border: activeCategory === category ? "none" : "1px solid rgba(255,255,255,0.1)",
                                    boxShadow: activeCategory === category ? "0 0 20px rgba(155, 81, 224, 0.3)" : "none",
                                }}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </Scroll3DReveal>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* PROJECTS GRID                                                   */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto"
                    >
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                onClick={() => handleProjectClick(project)}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12 sm:py-20">
                        <p className="text-gray-400 text-sm sm:text-base">No projects found in this category.</p>
                    </div>
                )}
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* PROCESS / APPROACH                                              */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[0, 30, 0]} translateFrom={[-60, 40, -80]}>
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4" style={{ color: "#F2994A", fontFamily: "'Space Mono', monospace" }}>
                            ─ Why Choose Us ─
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                            Our Approach
                        </h2>
                    </div>
                </Scroll3DReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {[
                        { icon: "🎨", title: "Design First", description: "Every project begins with thoughtful design and user experience research." },
                        { icon: "⚡", title: "Performance", description: "Lightning-fast load times and silky-smooth interactions across all devices." },
                        { icon: "🚀", title: "Scalable", description: "Built to grow with your business, from MVP to enterprise-grade solutions." },
                        { icon: "💎", title: "Premium Quality", description: "Pixel-perfect execution with attention to every detail and interaction." },
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
                                    className="p-4 sm:p-5 md:p-6 rounded-2xl text-center h-full"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4">{item.icon}</div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 md:mb-3" style={{ color: "#F2994A" }}>{item.title}</h3>
                                    <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm leading-relaxed">{item.description}</p>
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
                            ─ Have a project in mind? ─
                        </p>
                        <h2
                            className="font-black leading-[1.1] sm:leading-[1.2] tracking-tighter mb-6 sm:mb-8 md:mb-10 uppercase"
                            style={{ ...gradientStyle, fontSize: "clamp(1.75rem, 7vw, 5rem)", fontFamily: "'Syne', sans-serif" }}
                        >
                            Let's Create<br />Something<br />Extraordinary.
                        </h2>
                        <ContactButton label="Start a Project" href="/contact" />
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