/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    AnimatePresence,
    useScroll,
    useTransform,
} from "framer-motion";

export const Route = createFileRoute("/project")({
    component: ProjectsPage,
});

// ─── DATA ────────────────────────────────────────────────────────────────────

const categories = ["All", "Web Development", "Digital Marketing", "Content Creation"];

const projects = [
    {
        id: 1,
        title: "NovaSphere E-Commerce",
        category: "Web Development",
        accent: "#FF6B2B",
        size: "large",
        year: "2024",
        client: "NovaSphere Inc.",
        tags: ["React", "Next.js", "Stripe", "Tailwind"],
        summary: "A blazing-fast e-commerce platform with sub-1s load times and a 340% conversion uplift.",
        before: "Slow WooCommerce store, 6s load time, 1.2% conversion rate.",
        after: "Custom Next.js stack, 0.8s load time, 5.3% conversion rate.",
        stats: [
            { label: "Conversion Rate", before: "1.2%", after: "5.3%", delta: "+340%" },
            { label: "Page Load", before: "6.1s", after: "0.8s", delta: "−87%" },
            { label: "Revenue / mo", before: "₹2.1L", after: "₹9.4L", delta: "+347%" },
        ],
        cover: "🛒",
        coverGradient: "linear-gradient(135deg, #FF6B2B22 0%, #FF6B2B08 100%)",
    },
    {
        id: 2,
        title: "ZenFit Campaign",
        category: "Digital Marketing",
        accent: "#A855F7",
        size: "medium",
        year: "2024",
        client: "ZenFit Studios",
        tags: ["Google Ads", "Meta Ads", "SEO", "Analytics"],
        summary: "Full-funnel paid + organic campaign that 6x-ed leads in 90 days for a D2C fitness brand.",
        before: "₹80K monthly ad spend with 1.4x ROAS, 120 leads/month.",
        after: "₹80K spend, 8.4x ROAS, 720 leads/month, #1 SEO rank for 3 keywords.",
        stats: [
            { label: "ROAS", before: "1.4x", after: "8.4x", delta: "+500%" },
            { label: "Monthly Leads", before: "120", after: "720", delta: "+500%" },
            { label: "Organic Traffic", before: "1.2K", after: "18K", delta: "+1400%" },
        ],
        cover: "📈",
        coverGradient: "linear-gradient(135deg, #A855F722 0%, #A855F708 100%)",
    },
    {
        id: 3,
        title: "Luminary Brand Film",
        category: "Content Creation",
        accent: "#4ecdc4",
        size: "small",
        year: "2023",
        client: "Luminary Jewels",
        tags: ["Video", "Reels", "Copywriting", "Photography"],
        summary: "48-piece content series that drove 2.8M organic impressions in 30 days.",
        before: "0 social presence, 400 followers, no content strategy.",
        after: "48 assets delivered, 2.8M impressions, 22K new followers, 38K profile visits.",
        stats: [
            { label: "Impressions", before: "~0", after: "2.8M", delta: "∞" },
            { label: "Followers", before: "400", after: "22.4K", delta: "+5500%" },
            { label: "Engagement", before: "0.3%", after: "8.7%", delta: "+2800%" },
        ],
        cover: "🎬",
        coverGradient: "linear-gradient(135deg, #4ecdc422 0%, #4ecdc408 100%)",
    },
    {
        id: 4,
        title: "PulseHealth Dashboard",
        category: "Web Development",
        accent: "#FF6B2B",
        size: "medium",
        year: "2024",
        client: "PulseHealth AI",
        tags: ["React", "D3.js", "Node.js", "PostgreSQL"],
        summary: "Real-time patient analytics dashboard processing 500K+ daily events with <200ms query latency.",
        before: "Excel sheets, no real-time data, 4hr reporting lag.",
        after: "Live dashboard, <200ms queries, automated daily reports.",
        stats: [
            { label: "Report Lag", before: "4 hrs", after: "<1 min", delta: "−97%" },
            { label: "Data Points", before: "5K/day", after: "500K/day", delta: "+9900%" },
            { label: "Staff Saved", before: "—", after: "40 hrs/wk", delta: "New" },
        ],
        cover: "🏥",
        coverGradient: "linear-gradient(135deg, #FF6B2B22 0%, #FF6B2B08 100%)",
    },
    {
        id: 5,
        title: "Orbit Social Growth",
        category: "Digital Marketing",
        accent: "#f59e0b",
        size: "small",
        year: "2023",
        client: "Orbit SaaS",
        tags: ["LinkedIn Ads", "Content SEO", "Email", "HubSpot"],
        summary: "B2B growth engine — 3.2x pipeline in 6 months, 18 enterprise deals closed.",
        before: "Sporadic posting, 800 LinkedIn followers, 4 deals/quarter.",
        after: "Consistent content, 14K followers, 18 enterprise deals/quarter.",
        stats: [
            { label: "Pipeline Value", before: "₹28L", after: "₹89L", delta: "+218%" },
            { label: "LinkedIn Followers", before: "800", after: "14K", delta: "+1650%" },
            { label: "Deals/Quarter", before: "4", after: "18", delta: "+350%" },
        ],
        cover: "🚀",
        coverGradient: "linear-gradient(135deg, #f59e0b22 0%, #f59e0b08 100%)",
    },
    {
        id: 6,
        title: "Solstice Music Festival",
        category: "Content Creation",
        accent: "#ec4899",
        size: "large",
        year: "2024",
        client: "Solstice Events",
        tags: ["Live Video", "Drone", "Reels", "Livestream"],
        summary: "4-day festival documented across 120+ pieces of content, 6.1M total reach.",
        before: "No documentation, no post-event content, 0 digital amplification.",
        after: "120 assets, 6.1M reach, 41K new followers, 4 brand sponsors activated.",
        stats: [
            { label: "Total Reach", before: "~0", after: "6.1M", delta: "∞" },
            { label: "Content Pieces", before: "0", after: "120+", delta: "New" },
            { label: "Sponsors Won", before: "0", after: "4", delta: "New" },
        ],
        cover: "🎵",
        coverGradient: "linear-gradient(135deg, #ec489922 0%, #ec489908 100%)",
    },
    {
        id: 7,
        title: "VaultX Fintech App",
        category: "Web Development",
        accent: "#06b6d4",
        size: "small",
        year: "2023",
        client: "VaultX Finance",
        tags: ["React Native", "TypeScript", "Firebase", "Plaid API"],
        summary: "Cross-platform fintech app with biometric auth, 50K downloads in first month.",
        before: "No mobile presence, customers using competitor apps.",
        after: "iOS + Android, 50K downloads M1, 4.8★ rating, 91% retention.",
        stats: [
            { label: "Downloads (M1)", before: "0", after: "50K", delta: "New" },
            { label: "App Rating", before: "N/A", after: "4.8★", delta: "Top 3%" },
            { label: "D30 Retention", before: "—", after: "91%", delta: "Best-in-class" },
        ],
        cover: "💳",
        coverGradient: "linear-gradient(135deg, #06b6d422 0%, #06b6d408 100%)",
    },
    {
        id: 8,
        title: "TerraGrow Rebrand",
        category: "Content Creation",
        accent: "#84cc16",
        size: "medium",
        year: "2024",
        client: "TerraGrow Organics",
        tags: ["Brand Identity", "Photography", "Video", "Packaging"],
        summary: "Complete visual rebrand that lifted premium SKU sales by 210% in 60 days.",
        before: "Dated brand, low-res assets, premium products perceived as generic.",
        after: "New identity, 80+ assets, premium positioning, +210% SKU sales.",
        stats: [
            { label: "Premium Sales", before: "₹3.4L", after: "₹10.5L", delta: "+210%" },
            { label: "Brand Assets", before: "12", after: "80+", delta: "+567%" },
            { label: "Avg Order Value", before: "₹340", after: "₹890", delta: "+162%" },
        ],
        cover: "🌿",
        coverGradient: "linear-gradient(135deg, #84cc1622 0%, #84cc1608 100%)",
    },
];

// ─── 3D SCROLL HELPERS ──────────────────────────────────────────────────────

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

function Scroll3DCard({
    children,
    direction = "up",
}: {
    children: React.ReactNode;
    direction?: "left" | "right" | "up" | "down";
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "center 55%"] });
    const dirMap: Record<string, [number, number, number, number, number, number]> = {
        left: [-8, -15, 3, -60, 40, -80],
        right: [-8, 15, -3, 60, 40, -80],
        up: [-20, 0, 0, 0, 80, -100],
        down: [20, 0, 0, 0, -80, -100],
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

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────

function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 300, damping: 20 });
    const sy = useSpring(y, { stiffness: 300, damping: 20 });
    const move = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
    };
    return (
        <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }} className={className} onClick={onClick}>
            {children}
        </motion.div>
    );
}

// ─── CASE STUDY MODAL ────────────────────────────────────────────────────────

function CaseStudyModal({ project, onClose }: { project: typeof projects[0] | null; onClose: () => void }) {
    const [tab, setTab] = useState<"overview" | "before-after" | "stats">("overview");
    if (!project) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
            />
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.93 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-16 bottom-10 md:top-12 md:bottom-8 md:w-[780px] z-50 overflow-y-auto rounded-3xl pointer-events-auto"
                style={{
                    background: "linear-gradient(160deg, rgba(22,22,32,0.99) 0%, rgba(12,12,18,0.99) 100%)",
                    backdropFilter: "blur(30px)",
                    border: `1px solid ${project.accent}44`,
                    boxShadow: `0 30px 80px -10px ${project.accent}30, 0 0 0 1px ${project.accent}11`,
                }}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 px-7 pt-7 pb-5 border-b"
                    style={{ borderColor: `${project.accent}22`, background: "rgba(12,12,18,0.95)", backdropFilter: "blur(20px)" }}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                                style={{ background: project.coverGradient, border: `1px solid ${project.accent}33` }}>
                                {project.cover}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] tracking-[0.35em] uppercase font-medium px-2 py-0.5 rounded-full"
                                        style={{ background: project.accent + "22", color: project.accent, border: `1px solid ${project.accent}33` }}>
                                        {project.category}
                                    </span>
                                    <span className="text-[9px] tracking-widest text-gray-500 font-mono">{project.year}</span>
                                </div>
                                <h2 className="text-2xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                                    {project.title}
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">{project.client}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl transition-colors shrink-0 mt-1">×</button>
                    </div>

                    {/* Tab bar */}
                    <div className="flex gap-1 mt-5">
                        {(["overview", "before-after", "stats"] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className="relative text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg font-medium transition-all"
                                style={{
                                    color: tab === t ? "#fff" : "rgba(255,255,255,0.35)",
                                    background: tab === t ? project.accent + "28" : "transparent",
                                    border: tab === t ? `1px solid ${project.accent}44` : "1px solid transparent",
                                    fontFamily: "'Space Mono', monospace",
                                }}>
                                {t === "before-after" ? "Before / After" : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-7">
                    <AnimatePresence mode="wait">
                        {tab === "overview" && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                                <div className="relative rounded-2xl overflow-hidden mb-6 flex items-center justify-center"
                                    style={{ height: 200, background: project.coverGradient, border: `1px solid ${project.accent}22` }}>
                                    <span style={{ fontSize: 80, filter: `drop-shadow(0 0 30px ${project.accent}88)` }}>{project.cover}</span>
                                    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 30%, rgba(12,12,18,0.6) 100%)` }} />
                                    <div className="absolute top-4 left-4 text-xs font-mono tracking-widest" style={{ color: project.accent + "88" }}>
                                        {String(project.id).padStart(2, "0")}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-base leading-relaxed mb-6">{project.summary}</p>
                                <div className="mb-6">
                                    <p className="text-[9px] tracking-[0.35em] uppercase mb-3 font-medium" style={{ color: project.accent + "88", fontFamily: "'Space Mono', monospace" }}>
                                        Stack / Tools
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-medium"
                                                style={{ background: project.accent + "15", color: project.accent + "dd", border: `1px solid ${project.accent}30` }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {project.stats.map(s => (
                                        <div key={s.label} className="rounded-xl p-4 text-center"
                                            style={{ background: project.accent + "10", border: `1px solid ${project.accent}22` }}>
                                            <div className="text-xl font-extrabold mb-1" style={{ color: project.accent }}>{s.delta}</div>
                                            <div className="text-[10px] text-gray-400 leading-tight">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {tab === "before-after" && (
                            <motion.div key="ba" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="space-y-4">
                                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                                    <div className="p-6" style={{ background: "rgba(255,80,80,0.06)", borderBottom: "1px solid rgba(255,80,80,0.15)" }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            <span className="text-[9px] tracking-[0.4em] uppercase font-medium text-red-400" style={{ fontFamily: "'Space Mono', monospace" }}>Before</span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{project.before}</p>
                                    </div>
                                    <div className="flex items-center justify-center py-3" style={{ background: `${project.accent}08` }}>
                                        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl" style={{ color: project.accent }}>↓</motion.div>
                                    </div>
                                    <div className="p-6" style={{ background: "rgba(80,255,130,0.05)", borderTop: "1px solid rgba(80,255,130,0.12)" }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                            <span className="text-[9px] tracking-[0.4em] uppercase font-medium text-green-400" style={{ fontFamily: "'Space Mono', monospace" }}>After</span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{project.after}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {project.stats.map(s => (
                                        <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                            <div className="text-xs text-gray-400 mb-3 font-medium">{s.label}</div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 text-center py-2 rounded-lg" style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)" }}>
                                                    <div className="text-red-400 text-xs font-mono mb-0.5">Before</div>
                                                    <div className="text-white font-bold">{s.before}</div>
                                                </div>
                                                <div className="text-lg font-bold" style={{ color: project.accent }}>→</div>
                                                <div className="flex-1 text-center py-2 rounded-lg" style={{ background: "rgba(80,255,130,0.08)", border: "1px solid rgba(80,255,130,0.18)" }}>
                                                    <div className="text-green-400 text-xs font-mono mb-0.5">After</div>
                                                    <div className="text-white font-bold">{s.after}</div>
                                                </div>
                                                <div className="w-16 text-center py-2 rounded-lg" style={{ background: project.accent + "20", border: `1px solid ${project.accent}30` }}>
                                                    <div className="text-xs font-mono font-bold" style={{ color: project.accent }}>{s.delta}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {tab === "stats" && (
                            <motion.div key="stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    {project.stats.map((s, i) => (
                                        <motion.div key={s.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                                            className="rounded-2xl p-5 flex items-center gap-5" style={{ background: project.accent + "0c", border: `1px solid ${project.accent}22` }}>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-200">{s.label}</span>
                                                    <span className="text-sm font-bold" style={{ color: project.accent }}>{s.delta}</span>
                                                </div>
                                                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: i * 0.12, ease: "easeOut" }}
                                                        className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${project.accent}88, ${project.accent})` }} />
                                                </div>
                                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                                    <span>{s.before}</span>
                                                    <span style={{ color: project.accent }}>{s.after}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                    <p className="text-[9px] tracking-[0.35em] uppercase mb-4 font-medium" style={{ color: project.accent + "88", fontFamily: "'Space Mono', monospace" }}>Stack / Tools Used</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {project.tags.map((tag, i) => (
                                            <motion.div key={tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: project.accent + "12", border: `1px solid ${project.accent}22` }}>
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.accent }} />
                                                <span className="text-sm text-gray-300 font-medium">{tag}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

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
    const cardRef = useRef<HTMLDivElement>(null);
    const rX = useMotionValue(0);
    const rY = useMotionValue(0);
    const srX = useSpring(rX, { stiffness: 200, damping: 22 });
    const srY = useSpring(rY, { stiffness: 200, damping: 22 });

    const onMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        rX.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
        rY.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    };
    const onLeave = () => { rX.set(0); rY.set(0); setHovered(false); };

    const dirs: Array<"left" | "right" | "up" | "down"> = ["left", "up", "right", "down", "left", "right", "up", "down"];

    return (
        <Scroll3DCard direction={dirs[index % dirs.length]}>
            <motion.div
                ref={cardRef}
                style={{ rotateX: srX, rotateY: srY, transformPerspective: 900 }}
                onMouseMove={onMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={onLeave}
                onClick={onClick}
                className="relative cursor-pointer group"
            >
                <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-2xl blur-2xl -z-10"
                    style={{ background: `radial-gradient(ellipse, ${project.accent}28 0%, transparent 70%)` }} />

                <div className="relative rounded-2xl overflow-hidden border transition-all duration-300"
                    style={{
                        background: "rgba(255,255,255,0.035)",
                        backdropFilter: "blur(20px)",
                        borderColor: hovered ? project.accent + "55" : "rgba(255,255,255,0.08)",
                        boxShadow: hovered ? `0 0 40px ${project.accent}18` : "none",
                        minHeight: project.size === "large" ? 380 : 260,
                    }}>
                    <motion.div animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35 }}
                        className="absolute top-0 left-0 h-0.5 w-full origin-left z-10"
                        style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }} />

                    <div className="relative overflow-hidden flex items-center justify-center"
                        style={{ height: project.size === "large" ? 200 : 130, background: project.coverGradient }}>
                        <motion.div animate={{ scale: hovered ? 1.18 : 1, filter: hovered ? `drop-shadow(0 0 24px ${project.accent})` : "none" }}
                            transition={{ duration: 0.4, ease: "backOut" }} style={{ fontSize: project.size === "large" ? 72 : 52 }}>
                            {project.cover}
                        </motion.div>
                        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(12,12,18,0.9) 100%)" }} />
                        <div className="absolute top-3 right-3 text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(0,0,0,0.5)", color: project.accent, border: `1px solid ${project.accent}33` }}>
                            {project.year}
                        </div>
                        <div className="absolute top-3 left-3 text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-full font-medium"
                            style={{ background: project.accent + "22", color: project.accent, border: `1px solid ${project.accent}33` }}>
                            {project.category}
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="text-[9px] font-mono tracking-[0.4em] mb-2" style={{ color: project.accent + "77" }}>
                            {String(project.id).padStart(2, "0")}
                        </div>
                        <h3 className="font-extrabold text-white mb-2 tracking-tight leading-tight"
                            style={{ fontSize: project.size === "large" ? 20 : 16, fontFamily: "'Syne', sans-serif" }}>
                            {project.title}
                        </h3>
                        {project.size !== "small" && (
                            <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">{project.summary}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.stats.slice(0, 2).map(s => (
                                <span key={s.label} className="text-[9px] px-2 py-1 rounded-full font-bold tracking-wide"
                                    style={{ background: project.accent + "18", color: project.accent, border: `1px solid ${project.accent}28` }}>
                                    {s.label} {s.delta}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full"
                                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <motion.div animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }} transition={{ duration: 0.22 }}
                        className="absolute bottom-4 right-5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: project.accent, fontFamily: "'Space Mono', monospace" }}>
                        Case Study <span>→</span>
                    </motion.div>
                </div>
            </motion.div>
        </Scroll3DCard>
    );
}

// ─── OrbVisual ───────────────────────────────────────────────────────────────

function OrbVisual() {
    return (
        <div className="relative flex items-center justify-center w-64 h-64 mx-auto">
            {[280, 190, 120].map((size, i) => (
                <motion.div key={i} className="absolute rounded-full"
                    style={{ width: size, height: size, background: `radial-gradient(circle, ${i === 1 ? "#A855F7" : "#FF6B2B"}${i === 0 ? "18" : "22"} 0%, transparent 70%)`, filter: "blur(1px)" }}
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 360] }}
                    transition={{ scale: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: (5 + i) * 4, repeat: Infinity, ease: "linear", direction: i % 2 === 0 ? "normal" : "reverse" } }}
                />
            ))}
            <motion.div className="absolute rounded-full border" style={{ width: 90, height: 90, borderColor: "rgba(255,107,43,0.25)" }} animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute rounded-full border" style={{ width: 130, height: 130, borderColor: "rgba(168,85,247,0.18)", borderStyle: "dashed" }} animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "radial-gradient(circle, #FF6B2B44 0%, #A855F722 50%, transparent 100%)", border: "1px solid rgba(255,107,43,0.4)", boxShadow: "0 0 30px #FF6B2B33" }}>
                <span style={{ fontSize: 20, filter: "drop-shadow(0 0 8px #FF6B2B)" }}>◈</span>
            </div>
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const gradientStyle = {
    background: "linear-gradient(135deg, #C0C0C0 0%, #FFFFFF 20%, #A8A8A8 40%, #E8E8E8 55%, #888 70%, #FFFFFF 85%, #C0C0C0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
};

function ProjectsPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 600], [0, -80]);
    const heroScale = useTransform(scrollY, [0, 600], [1, 0.92]);
    const heroOpacity = useTransform(scrollY, [0, 380], [1, 0]);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Lock body scroll when mobile menu is open
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
        const mm = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", mm);
        return () => window.removeEventListener("mousemove", mm);
    }, []);

    const filtered = activeFilter === "All" ? projects : projects.filter(p => p.category === activeFilter);
    const openModal = (p: typeof projects[0]) => { setSelectedProject(p); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setTimeout(() => setSelectedProject(null), 300); };

    const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/service" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}>
            {/* Cursor glow */}
            <motion.div className="fixed pointer-events-none z-50 rounded-full"
                style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(255,107,43,0.05) 0%, transparent 70%)", x: mousePos.x - 200, y: mousePos.y - 200 }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }} />

            {/* ── NAVBAR with Mobile Menu ── */}
            <nav className="fixed top-0 left-0 right-0 z-40">
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,12,12,0.95) 0%, transparent 100%)" }} />
                <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-5">
                    <motion.a href="/" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                        className="text-sm md:text-base font-bold tracking-[0.25em] uppercase" style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}>
                        CREWHOLIC
                    </motion.a>

                    {/* Desktop Navigation */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navItems.map((item) => (
                            <a key={item.label} href={item.href} className="text-xs lg:text-sm tracking-widest uppercase transition-colors duration-200 hover:text-[#FF6B2B]"
                                style={{ color: item.label === "Projects" ? "#FF6B2B" : "rgba(255,255,255,0.6)", fontFamily: "'Space Mono', monospace" }}>
                                {item.label}
                            </a>
                        ))}
                    </motion.div>

                    {/* Desktop Contact Button */}
                    <MagneticButton className="relative z-10 hidden md:block">
                        <motion.a href="/contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                            className="relative overflow-hidden text-xs tracking-widest uppercase px-4 lg:px-5 py-2 lg:py-2.5 rounded-full font-medium transition-all duration-300 inline-block"
                            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: "'Space Mono', monospace" }}
                            whileHover={{ borderColor: "rgba(255,107,43,0.6)", color: "#FF6B2B" }}>
                            <span className="relative z-10">Contact</span>
                            <motion.div className="absolute inset-0 rounded-full" initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                                style={{ background: "rgba(255,107,43,0.08)" }} />
                        </motion.a>
                    </MagneticButton>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="relative z-20 md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10"
                        aria-label="Menu">
                        <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }}
                            className="w-5 h-0.5 bg-white transition-all duration-300" style={{ background: mobileMenuOpen ? "#FF6B2B" : "#fff" }} />
                        <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="w-5 h-0.5 bg-white transition-all duration-300" />
                        <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }}
                            className="w-5 h-0.5 bg-white transition-all duration-300" style={{ background: mobileMenuOpen ? "#FF6B2B" : "#fff" }} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40 md:hidden" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-72 bg-[#0C0C0C] backdrop-blur-xl border-l border-white/10 z-40 md:hidden flex flex-col p-6 pt-20">
                            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">✕</button>
                            <div className="flex flex-col gap-2 mt-4">
                                {navItems.map((item, index) => (
                                    <motion.a key={item.label} href={item.href} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                        onClick={() => setMobileMenuOpen(false)} className="py-4 px-4 text-lg tracking-widest uppercase transition-all duration-300 rounded-xl hover:bg-white/5"
                                        style={{ color: item.label === "Projects" ? "#FF6B2B" : "rgba(255,255,255,0.8)", fontFamily: "'Space Mono', monospace", borderLeft: item.label === "Projects" ? `3px solid #FF6B2B` : "3px solid transparent" }}>
                                        {item.label}
                                    </motion.a>
                                ))}
                            </div>
                            <motion.a href="/contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                onClick={() => setMobileMenuOpen(false)} className="mt-6 py-3 text-center text-sm tracking-widest uppercase font-medium rounded-full border border-[#FF6B2B]/50 text-[#FF6B2B] hover:bg-[#FF6B2B]/10 transition-all duration-300"
                                style={{ fontFamily: "'Space Mono', monospace" }}>Get in Touch</motion.a>
                            <div className="mt-auto pt-8 pb-4"><p className="text-[10px] tracking-[0.2em] text-center text-white/30">© 2025 Crewholic</p></div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── HERO SECTION (Fixed for PORTFOLIO heading) ── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#FF6B2B" }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "#A855F7" }} />

                <motion.div style={{ y: heroY, scale: heroScale, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center justify-center gap-3 mb-6 md:mb-8">
                        <div className="h-px w-8 md:w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                        <span className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase" style={{ color: "#FF6B2B99", fontFamily: "'Space Mono', monospace" }}>Our Work</span>
                        <div className="h-px w-8 md:w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                    </motion.div>

                    {/* PORTFOLIO Heading - Fixed for mobile (full word visible) */}
                    <div className="w-full flex justify-center items-center overflow-visible px-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="font-extrabold leading-[1.1] tracking-tighter text-center w-full"
                            style={{
                                ...gradientStyle,
                                fontSize: "clamp(32px, 7vw, 180px)",
                                fontFamily: "'Syne', sans-serif",
                                whiteSpace: "nowrap",
                                letterSpacing: "clamp(-0.01em, -0.2vw, -0.02em)"
                            }}>
                            PORTFOLIO
                        </motion.h1>
                    </div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5, ease: "backOut" }}>
                        <OrbVisual />
                    </motion.div>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}
                        className="text-sm md:text-base lg:text-lg mt-4 md:mt-6 max-w-xl mx-auto leading-relaxed px-4"
                        style={{ color: "rgba(255,255,255,0.4)" }}>
                        Real work. <span style={{ color: "#FF6B2B" }}>Measurable results.</span> Case studies that prove impact.
                    </motion.p>

                    {/* Project count */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                        className="mt-6 md:mt-8 flex items-center justify-center gap-4 md:gap-8 flex-wrap">
                        {[["8+", "Featured Projects"], ["3", "Categories"], ["150+", "Total Delivered"]].map(([val, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-xl md:text-2xl font-extrabold" style={{ color: "#FF6B2B" }}>{val}</div>
                                <div className="text-[8px] md:text-[9px] tracking-widest uppercase mt-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>{label}</div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.3 }}
                        className="mt-8 md:mt-10 flex flex-col items-center gap-2">
                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-px h-8 md:h-10" style={{ background: "linear-gradient(180deg, transparent, rgba(255,107,43,0.5), transparent)" }} />
                        <span className="text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] uppercase" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}>Explore</span>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── FILTER + MASONRY GRID ── */}
            <section className="relative py-16 px-6 md:px-12 lg:px-20">
                <Scroll3DReveal rotateFrom={[15, -8, 0]} translateFrom={[40, 50, -60]}>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                        <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>Case Studies</span>
                    </div>
                </Scroll3DReveal>

                {/* Filter pills */}
                <Scroll3DReveal rotateFrom={[12, 0, 0]} translateFrom={[0, 40, -50]} scaleFrom={0.9}>
                    <div className="flex flex-wrap gap-2 mb-12 max-w-7xl mx-auto">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="text-[9px] md:text-[10px] tracking-widest uppercase px-4 md:px-5 py-2 md:py-2.5 rounded-full font-medium transition-all"
                                style={{
                                    fontFamily: "'Space Mono', monospace",
                                    background: activeFilter === cat ? "linear-gradient(135deg, #FF6B2B, #E85520)" : "rgba(255,255,255,0.05)",
                                    color: activeFilter === cat ? "#0C0C0C" : "rgba(255,255,255,0.45)",
                                    border: activeFilter === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
                                    boxShadow: activeFilter === cat ? "0 0 20px rgba(255,107,43,0.3)" : "none",
                                }}
                            >
                                {cat}
                                {cat !== "All" && (
                                    <span className="ml-2 opacity-60">
                                        {projects.filter(p => p.category === cat).length}
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </Scroll3DReveal>

                {/* Masonry grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.35 }}
                        className="max-w-7xl mx-auto"
                        style={{
                            columns: "auto",
                            columnWidth: "280px",
                            columnGap: "20px",
                        }}
                    >
                        {filtered.map((project, i) => (
                            <div key={project.id} style={{ breakInside: "avoid", marginBottom: 20 }}>
                                <ProjectCard project={project} index={i} onClick={() => openModal(project)} />
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filtered.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-400">No projects found in this category.</p>
                    </motion.div>
                )}
            </section>

            {/* ── STATS BANNER ── */}
            <Scroll3DReveal rotateFrom={[25, 0, 0]} translateFrom={[0, 80, -100]} scaleFrom={0.8}>
                <section className="py-12 md:py-16 px-6 md:px-20 my-8 mx-4 md:mx-6 rounded-3xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto text-center">
                        {[
                            { val: "150+", label: "Projects Delivered" },
                            { val: "98%", label: "Client Satisfaction" },
                            { val: "4.8x", label: "Average ROI" },
                            { val: "12", label: "Awards Won" },
                        ].map(({ val, label }, i) => (
                            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                <div className="text-2xl md:text-4xl font-extrabold mb-2" style={{ color: "#FF6B2B", fontFamily: "'Syne', sans-serif" }}>{val}</div>
                                <div className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>{label}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </Scroll3DReveal>

            {/* ── CTA ── */}
            <section className="relative py-20 md:py-32 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(ellipse at center, #FF6B2B 0%, transparent 65%)" }} />
                <Scroll3DReveal rotateFrom={[30, 0, 0]} translateFrom={[0, 100, -200]} scaleFrom={0.65}>
                    <div className="relative z-10">
                        <p className="text-[10px] tracking-[0.4em] uppercase mb-4 md:mb-6" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>
                            Ready to be next?
                        </p>
                        <h2 className="font-extrabold leading-[1.2] tracking-tighter mb-6 md:mb-8"
                            style={{ ...gradientStyle, fontSize: "clamp(32px, 6vw, 96px)", fontFamily: "'Syne', sans-serif" }}>
                            LET'S BUILD<br />SOMETHING<br />LEGENDARY.
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <MagneticButton>
                                <motion.a href="/service" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="relative overflow-hidden px-6 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm tracking-widest uppercase font-bold inline-block"
                                    style={{ background: "linear-gradient(135deg, #FF6B2B, #E85520)", color: "#0C0C0C", fontFamily: "'Syne', sans-serif", boxShadow: "0 0 40px rgba(255,107,43,0.3)" }}>
                                    <span className="relative z-10">Start a Project</span>
                                    <motion.div className="absolute inset-0" initial={{ x: "-100%" }} whileHover={{ x: "0%" }} transition={{ duration: 0.4 }}
                                        style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)" }} />
                                </motion.a>
                            </MagneticButton>
                            <MagneticButton>
                                <motion.a href="/about" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="px-6 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm tracking-widest uppercase font-bold inline-block transition-all"
                                    style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "'Syne', sans-serif" }}
                                    whileHover={{ borderColor: "rgba(255,107,43,0.5)", color: "#FF6B2B" }}>
                                    Meet the Team
                                </motion.a>
                            </MagneticButton>
                        </div>
                    </div>
                </Scroll3DReveal>
            </section>

            {/* Footer */}
            <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-center" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}>© 2025 Crewholic. All rights reserved.</span>
                <div className="flex gap-6">
                    <a href="#" className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase hover:text-[#FF6B2B] transition-colors" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>Privacy</a>
                    <a href="#" className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase hover:text-[#FF6B2B] transition-colors" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono', monospace" }}>Terms</a>
                </div>
            </div>

            {/* Case Study Modal */}
            <AnimatePresence>
                {modalOpen && selectedProject && (
                    <CaseStudyModal project={selectedProject} onClose={closeModal} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default ProjectsPage;