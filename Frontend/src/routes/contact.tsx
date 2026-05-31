/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/contact")({
    component: ContactPage,
});

// Contact Info Data
const contactInfo = [
    {
        id: 1,
        title: "Email Us",
        value: "hello@crewholic.com",
        icon: "📧",
        accent: "#FF6B2B",
        description: "Get a response within 24 hours",
    },
    {
        id: 2,
        title: "Call Us",
        value: "+1 (555) 123-4567",
        icon: "📞",
        accent: "#A855F7",
        description: "Mon-Fri, 9AM - 6PM PST",
    },
    {
        id: 3,
        title: "Visit Us",
        value: "San Francisco, CA",
        icon: "📍",
        accent: "#4ecdc4",
        description: "By appointment only",
    },
    {
        id: 4,
        title: "Follow Us",
        value: "@crewholic",
        icon: "🌐",
        accent: "#ff8c42",
        description: "Connect on social media",
    },
];

// Social Links
const socialLinks = [
    { name: "LinkedIn", icon: "fab fa-linkedin-in", url: "#", color: "#0077B5" },
    { name: "Instagram", icon: "fab fa-instagram", url: "#", color: "#E4405F" },
    { name: "Twitter", icon: "fab fa-twitter", url: "#", color: "#1DA1F2" },
    { name: "Behance", icon: "fab fa-behance", url: "#", color: "#1769FF" },
    { name: "GitHub", icon: "fab fa-github", url: "#", color: "#333" },
    { name: "Dribbble", icon: "fab fa-dribbble", url: "#", color: "#EA4C89" },
];

// Office Locations
const locations = [
    { city: "San Francisco", address: "123 Market Street, Suite 400", country: "USA", flag: "🇺🇸" },
    { city: "New York", address: "456 Broadway, Floor 12", country: "USA", flag: "🇺🇸" },
    { city: "London", address: "789 Oxford Street", country: "UK", flag: "🇬🇧" },
    { city: "Singapore", address: "Marina Bay Financial Centre", country: "Singapore", flag: "🇸🇬" },
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

function ContactCard({
    info,
    index,
}: {
    info: typeof contactInfo[0];
    index: number;
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
            className="relative group cursor-pointer"
        >
            {/* Glow */}
            <motion.div
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-2xl blur-xl -z-10"
                style={{
                    background: `radial-gradient(ellipse at center, ${info.accent}33 0%, transparent 70%)`,
                }}
            />

            {/* Card */}
            <div
                className="relative rounded-2xl p-6 text-center overflow-hidden border transition-all duration-300"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)",
                    borderColor: hovered ? info.accent + "55" : "rgba(255,255,255,0.07)",
                    boxShadow: hovered
                        ? `0 0 40px ${info.accent}22, inset 0 1px 0 rgba(255,255,255,0.08)`
                        : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
            >
                {/* Corner accent */}
                <motion.div
                    animate={{ scaleX: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-0 h-0.5 w-full origin-left"
                    style={{ background: `linear-gradient(90deg, ${info.accent}, transparent)` }}
                />

                {/* Icon */}
                <motion.div
                    animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 15 : 0 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                    className="text-4xl mb-4"
                >
                    {info.icon}
                </motion.div>

                {/* Title */}
                <h3
                    className="text-lg font-semibold mb-2 tracking-tight transition-colors duration-300"
                    style={{
                        color: hovered ? info.accent : "#e5e5e5",
                        fontFamily: "'Syne', sans-serif",
                    }}
                >
                    {info.title}
                </h3>

                {/* Value */}
                <p className="text-sm mb-2" style={{ color: "#fff" }}>
                    {info.value}
                </p>

                {/* Description */}
                <p className="text-xs" style={{ color: "#888" }}>
                    {info.description}
                </p>
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

function ContactPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [toastMessage, setToastMessage] = useState<{ text: string; isError: boolean } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

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

    const showMessage = (text: string, isError: boolean = false) => {
        setToastMessage({ text, isError });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            showMessage("Please fill in all required fields", true);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Simulate API call - Replace with actual API endpoint
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                showMessage("✅ Message sent successfully! We'll get back to you soon.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
            } else {
                // Fallback for demo - store in localStorage
                const messages = JSON.parse(localStorage.getItem("contact_messages") || "[]");
                messages.push({ ...formData, timestamp: new Date().toISOString() });
                localStorage.setItem("contact_messages", JSON.stringify(messages));
                showMessage("✅ Message received! We'll contact you shortly.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
            }
        } catch (error) {
            // Fallback for demo
            const messages = JSON.parse(localStorage.getItem("contact_messages") || "[]");
            messages.push({ ...formData, timestamp: new Date().toISOString() });
            localStorage.setItem("contact_messages", JSON.stringify(messages));
            showMessage("✅ Message received! We'll contact you shortly.");
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen overflow-x-hidden"
            style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}
        >
            {/* Toast Message */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
                        style={{
                            background: toastMessage.isError ? "#8B2C2C" : "rgba(17,19,30,0.95)",
                            backdropFilter: "blur(20px)",
                            padding: "14px 32px",
                            borderRadius: "60px",
                            color: "white",
                            fontSize: "14px",
                            border: `1px solid ${toastMessage.isError ? "#f44336" : "rgba(155,81,224,0.7)"}`,
                        }}
                    >
                        {toastMessage.text}
                    </motion.div>
                )}
            </AnimatePresence>

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
                    {["About", "Services", "Projects", "Contact"].map((item) => (
                        <a
                            key={item}
                            href={item === "Services" ? "/service" : item === "Projects" ? "/portfolio" : `/${item.toLowerCase()}`}
                            className="text-xs tracking-widest uppercase transition-colors duration-200"
                            style={{
                                color: item === "Contact" ? "#FF6B2B" : "rgba(255,255,255,0.45)",
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
                        Get In Touch
                    </p>
                    <p
                        className="text-[10px] tracking-[0.3em] uppercase mt-1"
                        style={{ color: "rgba(255,107,43,0.4)", fontFamily: "'Space Mono', monospace" }}
                    >
                        ◎ 24/7 Support
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
                            Contact Us
                        </span>
                        <div className="h-px w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                    </motion.div>

                    {/* CONTACT heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="font-extrabold leading-none tracking-tighter mb-6"
                        style={{
                            ...gradientStyle,
                            fontSize: "clamp(56px, 10vw, 120px)",
                            fontFamily: "'Syne', sans-serif",
                            textShadow: "0 0 80px rgba(255,255,255,0.05)",
                        }}
                    >
                        CONTACT
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
                        Have a project in mind?{" "}
                        <span style={{ color: "#FF6B2B" }}>Let's create something extraordinary together.</span>
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
                            Reach Out
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTACT CARDS ── */}
            <section className="relative py-12 px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {contactInfo.map((info, index) => (
                        <ContactCard key={info.id} info={info} index={index} />
                    ))}
                </div>
            </section>

            {/* ── CONTACT FORM & MAP ── */}
            <section className="relative py-24 px-6 md:px-12">
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
                        Send a Message
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl p-6 md:p-8"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        <h3 className="text-2xl font-bold mb-6" style={gradientStyle}>
                            Let's Talk
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-all text-white"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-all text-white"
                                        placeholder="hello@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-all text-white"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-all text-white"
                                        placeholder="Project Inquiry"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none transition-all text-white resize-none"
                                    placeholder="Tell us about your project..."
                                    required
                                />
                            </div>

                            <MagneticButton>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 rounded-xl font-semibold transition-all relative overflow-hidden group"
                                    style={{
                                        background: "linear-gradient(135deg, #FF6B2B, #E85520)",
                                        boxShadow: "0 4px 15px rgba(255,107,43,0.4)",
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
                                </button>
                            </MagneticButton>
                            
                            <p className="text-xs text-gray-500 text-center mt-4">
                                We'll get back to you within 24 hours
                            </p>
                        </form>
                    </motion.div>

                    {/* Office Locations & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Office Locations */}
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                            }}
                        >
                            <h3 className="text-xl font-bold mb-5" style={{ color: "#FF6B2B" }}>
                                Our Offices
                            </h3>
                            <div className="space-y-4">
                                {locations.map((location, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <span className="text-2xl">{location.flag}</span>
                                        <div>
                                            <p className="font-semibold text-white">{location.city}</p>
                                            <p className="text-sm text-gray-400">{location.address}</p>
                                            <p className="text-xs text-gray-500">{location.country}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                            }}
                        >
                            <h3 className="text-xl font-bold mb-5" style={{ color: "#A855F7" }}>
                                Follow Us
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                                        style={{
                                            background: "rgba(255,255,255,0.05)",
                                            color: social.color,
                                            border: "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        <i className={social.icon}></i>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.07)",
                            }}
                        >
                            <h3 className="text-xl font-bold mb-5" style={{ color: "#4ecdc4" }}>
                                Business Hours
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Monday - Friday</span>
                                    <span className="text-white">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Saturday</span>
                                    <span className="text-white">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Sunday</span>
                                    <span className="text-white">Closed</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-sm text-gray-400">Emergency Support: 24/7</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CTA SECTION ── */}
            <section className="relative py-32 px-6 text-center overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        background: "radial-gradient(ellipse at center, #FF6B2B 0%, transparent 65%)",
                    }}
                />

                <motion.div                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <p
                        className="text-[10px] tracking-[0.4em] uppercase mb-6"
                        style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}
                    >
                        Let's Work Together
                    </p>
                    <h2
                        className="font-extrabold leading-none tracking-tighter mb-8"
                        style={{
                            ...gradientStyle,
                            fontSize: "clamp(40px, 7vw, 96px)",
                            fontFamily: "'Syne', sans-serif",
                        }}
                    >
                        READY TO
                        <br />
                        DOMINATE
                        <br />
                        YOUR MARKET?
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

export default ContactPage;