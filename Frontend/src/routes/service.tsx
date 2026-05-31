/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/service")({
    component: ServicePage,
});

// Regular Services
const services = [
    {
        id: "01",
        title: "Web Development",
        desc: "Pixel-perfect, blazing-fast digital experiences engineered for conversion and scale.",
        longDesc: "Our web development service delivers cutting-edge, responsive websites that drive conversions. We combine modern frameworks with performance optimization to create digital experiences that load instantly and engage users deeply.",
        icon: "⬡",
        accent: "#FF6B2B",
        tags: ["React", "Next.js", "TypeScript"],
        deliverables: ["Custom Website", "CMS Integration", "SEO Optimization", "Analytics Setup"],
        timeline: "4-6 weeks",
        type: "service"
    },
    {
        id: "02",
        title: "Digital Marketing",
        desc: "Data-driven campaigns that carve market share and compound returns.",
        longDesc: "Our data-driven marketing campaigns are engineered to dominate your market. We combine SEO, paid advertising, and analytics to create a comprehensive growth strategy that delivers measurable results.",
        icon: "◎",
        accent: "#A855F7",
        tags: ["SEO", "Paid Ads", "Analytics"],
        deliverables: ["SEO Strategy", "PPC Campaigns", "Social Media", "Email Marketing"],
        timeline: "2-3 weeks",
        type: "service"
    },
    {
        id: "03",
        title: "Content Creation",
        desc: "Captivating content that tells your story and drives engagement.",
        longDesc: "From social media content to video production, we create compelling narratives that resonate with your audience and build brand loyalty.",
        icon: "✧",
        accent: "#FF6B2B",
        tags: ["Video", "Social Media", "Copywriting"],
        deliverables: ["Content Strategy", "Video Production", "Social Posts", "Blog Writing"],
        timeline: "2-4 weeks",
        type: "service"
    },
    {
        id: "04",
        title: "Event Management",
        desc: "Flawless execution of memorable events from concept to completion.",
        longDesc: "We handle every aspect of your event - from planning and coordination to execution and follow-up. Let us create unforgettable experiences for your brand.",
        icon: "◈",
        accent: "#A855F7",
        tags: ["Planning", "Coordination", "Production"],
        deliverables: ["Event Strategy", "Vendor Management", "On-site Coordination", "Post-event Analysis"],
        timeline: "4-8 weeks",
        type: "service"
    },
];

// Rental Categories (as cards like webdev)
const rentalCategories = [
    {
        id: "05",
        title: "Cameras",
        desc: "Professional cameras from Canon, Sony, GoPro and more. Perfect for weddings, events, and content creation.",
        longDesc: "Rent high-quality cameras from our premium collection. All cameras are regularly maintained and come with essential accessories.",
        icon: "📷",
        accent: "#FF6B2B",
        tags: ["Canon", "Sony", "GoPro", "4K"],
        type: "rental",
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
        id: "06",
        title: "Gimbals & Stabilizers",
        desc: "Smooth, professional stabilization for flawless footage. DJI gimbals for cameras and phones.",
        longDesc: "Achieve cinema-quality stabilization with our premium gimbal collection. Perfect for dynamic shots and professional videography.",
        icon: "⚖️",
        accent: "#A855F7",
        tags: ["DJI", "Stabilizers", "Smooth Footage"],
        type: "rental",
        items: [
            { id: 11, name: "DJI RS Mini", price: 1000, originalPrice: 1800, image: "⚖️", rating: 4.7, inStock: true, specs: "Compact, Lightweight" },
            { id: 12, name: "DJI RS4", price: 1500, originalPrice: 2500, image: "⚖️", rating: 4.8, inStock: true, specs: "Professional, Payload 3kg" },
            { id: 13, name: "DJI Mobile Gimbal", price: 400, originalPrice: 800, image: "📱", rating: 4.4, inStock: true, specs: "For Smartphones" },
        ]
    },
    {
        id: "07",
        title: "Drones",
        desc: "Aerial cinematography that captures breathtaking perspectives. DJI drones for every need.",
        longDesc: "Elevate your content with stunning aerial shots. Our drone fleet offers 4K+ quality and extended flight times.",
        icon: "🚁",
        accent: "#FF6B2B",
        tags: ["DJI", "Aerial", "4K"],
        type: "rental",
        items: [
            { id: 14, name: "DJI Mini 4 Pro", price: 2500, originalPrice: 4500, image: "🚁", rating: 4.9, inStock: true, specs: "4K HDR, 45min Flight" },
            { id: 15, name: "DJI Air 3S", price: 2500, originalPrice: 4200, image: "🚁", rating: 4.8, inStock: true, specs: "Dual Camera, 4K" },
            { id: 16, name: "DJI Neo 2", price: 2000, originalPrice: 3500, image: "🚁", rating: 4.6, inStock: true, specs: "Compact, 4K" },
        ]
    },
];

// Combined all cards (services + rental categories)
const allCards = [...services, ...rentalCategories];

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

// Modal for Regular Services
function ServiceInquiryModal({ service, isOpen, onClose, onSubmit }: { 
    service: typeof services[0] | null; 
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: (data: ServiceFormData) => Promise<boolean>;
}) {
    const [formData, setFormData] = useState<ServiceFormData>({
        name: "",
        mobile: "",
        email: "",
        requirements: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
                setFormData({ name: "", mobile: "", email: "", requirements: "" });
                onClose();
            }, 3000);
        }
    };

    if (!service) return null;

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
                    
                    {/* Success Popup for Services */}
                    <AnimatePresence>
                        {showSuccessPopup && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div 
                                    className="relative max-w-md w-full rounded-2xl overflow-hidden pointer-events-auto shadow-2xl"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(30,30,40,0.98), rgba(20,20,30,0.98))",
                                        backdropFilter: "blur(20px)",
                                        border: `1px solid ${service.accent}66`,
                                        boxShadow: `0 0 60px ${service.accent}40`,
                                    }}
                                >
                                    <div className="p-6 text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                                            style={{ background: `${service.accent}20`, border: `2px solid ${service.accent}` }}
                                        >
                                            <span className="text-4xl">🎉</span>
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                                        <p className="text-gray-300 mb-2">Thank you for being a part of Crewholic!</p>
                                        <p className="text-gray-400 text-sm mb-4">Our team will contact you soon.</p>
                                        <div className="p-3 rounded-xl mb-4" style={{ background: `${service.accent}10` }}>
                                            <p className="text-white font-semibold">{service.title}</p>
                                            <p className="text-sm" style={{ color: service.accent }}>Timeline: {service.timeline}</p>
                                        </div>
                                    </div>
                                    <motion.div 
                                        className="h-1 w-full"
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{ duration: 2.8, ease: "linear" }}
                                        style={{ background: service.accent }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div 
                            className="relative w-full max-w-2xl rounded-3xl overflow-hidden pointer-events-auto"
                            style={{
                                background: "linear-gradient(135deg, rgba(25,25,35,0.98), rgba(15,15,20,0.98))",
                                backdropFilter: "blur(20px)",
                                border: `1px solid ${service.accent}66`,
                                boxShadow: `0 25px 50px -12px ${service.accent}40`,
                            }}
                        >
                            <div className="relative p-6 border-b" style={{ borderColor: `${service.accent}33`, background: `linear-gradient(90deg, ${service.accent}08, transparent)` }}>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${service.accent}20`, border: `1px solid ${service.accent}44` }}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                                        <p className="text-gray-300 text-sm">Fill out the form to get started</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl transition-colors">×</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-200">Full Name *</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-400" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-200">Mobile Number *</label>
                                    <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-400" placeholder="+91 98765 43210" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-200">Email Address *</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-400" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-200">Your Requirements *</label>
                                    <textarea name="requirements" required rows={4} value={formData.requirements} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-400 resize-none" placeholder="Tell us about your project, timeline, and budget..." />
                                </div>
                                <div className="p-4 rounded-xl" style={{ background: `${service.accent}15`, border: `1px solid ${service.accent}33` }}>
                                    <p className="text-xs text-gray-300 mb-2">Selected Service:</p>
                                    <p className="font-semibold text-white" style={{ color: service.accent }}>{service.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">Timeline: {service.timeline}</p>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl font-semibold transition-all text-white" style={{ background: `linear-gradient(135deg, ${service.accent}, ${service.accent}CC)`, boxShadow: `0 4px 15px ${service.accent}40` }}>
                                    {isSubmitting ? "Sending..." : "Submit Inquiry →"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Modal for Rental Products Listing
function RentalProductsModal({ category, isOpen, onClose, onRentClick }: { 
    category: typeof rentalCategories[0] | null; 
    isOpen: boolean; 
    onClose: () => void; 
    onRentClick: (product: any) => void;
}) {
    if (!category) return null;

    const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

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
                        className="fixed inset-x-4 top-20 bottom-20 z-50 overflow-y-auto rounded-3xl pointer-events-auto"
                    >
                        <div 
                            className="relative w-full min-h-full rounded-3xl overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, rgba(25,25,35,0.98), rgba(15,15,20,0.98))",
                                backdropFilter: "blur(20px)",
                                border: `1px solid ${category.accent}66`,
                            }}
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 p-6 border-b" style={{ background: "rgba(15,15,20,0.95)", backdropFilter: "blur(20px)", borderColor: `${category.accent}33` }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${category.accent}20`, border: `1px solid ${category.accent}44` }}>
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                                            <p className="text-gray-300 text-sm mt-1">{category.longDesc}</p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition-colors">×</button>
                                </div>
                                <p className="text-gray-300 text-sm mt-4">{category.items.length} equipment available for rent</p>
                            </div>

                            {/* Products Grid */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {category.items.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                            className="rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer group"
                                            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)" }}
                                            onClick={() => onRentClick(product)}
                                        >
                                            <div className="p-5">
                                                <div className="text-6xl text-center py-4">{product.image}</div>
                                                <h3 className="font-bold text-lg text-white mb-2">{product.name}</h3>
                                                <p className="text-gray-300 text-xs mb-3">{product.specs}</p>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-yellow-400 text-sm">★ {product.rating}</span>
                                                    <span className="text-gray-300 text-xs">(120+ reviews)</span>
                                                </div>
                                                <div className="mb-3">
                                                    <span className="text-2xl font-bold text-white" style={{ color: category.accent }}>{formatPrice(product.price)}</span>
                                                    <span className="text-gray-400 line-through text-sm ml-2">{formatPrice(product.originalPrice)}</span>
                                                    <span className="text-green-400 text-xs ml-2 block sm:inline">{Math.round((1 - product.price/product.originalPrice) * 100)}% off</span>
                                                </div>
                                                <p className="text-gray-300 text-xs mb-4">per day</p>
                                                {product.inStock && (
                                                    <span className="inline-block text-green-400 text-xs mb-3 font-medium">✓ In Stock</span>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
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

// Modal for Individual Product Rental (Checkout) - WITH CUSTOM SUCCESS POPUP
function RentalCheckoutModal({ product, category, isOpen, onClose, onSubmit }: { 
    product: any; 
    category: any; 
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: (data: RentalFormData) => Promise<boolean>;
}) {
    const [rentalDays, setRentalDays] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        requirements: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const totalPrice = product ? product.price * rentalDays : 0;
    const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !product) return;

        setIsSubmitting(true);
        const success = await onSubmit({
            ...formData,
            productId: product.id,
            productName: product.name,
            categoryName: category.title,
            pricePerDay: product.price,
            rentalDays,
            totalPrice,
        });
        setIsSubmitting(false);

        if (success) {
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                setFormData({ name: "", mobile: "", email: "", requirements: "" });
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
                    
                    {/* Custom Success Popup for Rentals */}
                    <AnimatePresence>
                        {showSuccessPopup && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div 
                                    className="relative max-w-md w-full rounded-2xl overflow-hidden pointer-events-auto shadow-2xl"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(30,30,40,0.98), rgba(20,20,30,0.98))",
                                        backdropFilter: "blur(20px)",
                                        border: `1px solid ${category.accent}66`,
                                        boxShadow: `0 0 60px ${category.accent}40`,
                                    }}
                                >
                                    <div className="p-6 text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                                            style={{ background: `${category.accent}20`, border: `2px solid ${category.accent}` }}
                                        >
                                            <span className="text-4xl">🎉</span>
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                                        <p className="text-gray-300 mb-2">Thank you for being a part of Crewholic!</p>
                                        <p className="text-gray-400 text-sm mb-4">Our team will contact you soon.</p>
                                        <div className="p-3 rounded-xl mb-4" style={{ background: `${category.accent}10` }}>
                                            <p className="text-xs text-gray-400">Order Summary</p>
                                            <p className="text-white font-semibold">{product.name}</p>
                                            <p className="text-sm" style={{ color: category.accent }}>{formatPrice(totalPrice)} for {rentalDays} day(s)</p>
                                        </div>
                                    </div>
                                    <motion.div 
                                        className="h-1 w-full"
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{ duration: 2.8, ease: "linear" }}
                                        style={{ background: category.accent }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
                    >
                        <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden pointer-events-auto my-8" style={{ background: "linear-gradient(135deg, rgba(25,25,35,0.98), rgba(15,15,20,0.98))", backdropFilter: "blur(20px)", border: `1px solid ${category.accent}66`, boxShadow: `0 0 40px ${category.accent}20` }}>
                            
                            {/* Header */}
                            <div className="relative p-6 border-b" style={{ borderColor: `${category.accent}33`, background: `linear-gradient(90deg, ${category.accent}08, transparent)` }}>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{product.image}</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Complete Your Rental</h2>
                                        <p className="text-gray-300 text-sm mt-0.5">{product.name}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl transition-colors">×</button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 p-6">
                                {/* Product Info */}
                                <div className="space-y-4">
                                    <div className="text-8xl bg-white/10 rounded-2xl p-8 text-center" style={{ border: `1px solid ${category.accent}44` }}>
                                        {product.image}
                                    </div>
                                    <h3 className="text-xl font-bold text-white text-center">{product.name}</h3>
                                    <div className="text-center">
                                        <span className="text-yellow-400">★ {product.rating}</span>
                                        <span className="text-gray-300 ml-2">(120+ reviews)</span>
                                        {product.inStock && <div className="text-green-400 text-sm mt-2 font-medium">✓ In Stock</div>}
                                    </div>
                                    <div className="text-center p-4 rounded-xl" style={{ background: `${category.accent}15` }}>
                                        <span className="text-3xl font-bold text-white" style={{ color: category.accent }}>{formatPrice(product.price)}</span>
                                        <span className="text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>
                                        <span className="text-green-400 ml-2 font-medium">{Math.round((1 - product.price/product.originalPrice) * 100)}% off</span>
                                        <p className="text-gray-300 text-sm mt-1">per day</p>
                                    </div>
                                    
                                    {/* Features */}
                                    <div className="p-4 rounded-xl bg-white/10">
                                        <h4 className="text-white text-sm font-semibold mb-2">Key Features:</h4>
                                        <p className="text-gray-300 text-sm">{product.specs}</p>
                                    </div>
                                </div>

                                {/* Checkout Form */}
                                <div>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-200">Full Name *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={formData.name} 
                                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-400 transition-all"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-200">Mobile Number *</label>
                                            <input 
                                                type="tel" 
                                                required 
                                                value={formData.mobile} 
                                                onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-400 transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-200">Email Address *</label>
                                            <input 
                                                type="email" 
                                                required 
                                                value={formData.email} 
                                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-400 transition-all"
                                                placeholder="you@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-200">Rental Duration (Days) *</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max="30" 
                                                required 
                                                value={rentalDays} 
                                                onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)} 
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white transition-all"
                                            />
                                        </div>

                                        {/* Price Summary */}
                                        <div className="p-4 rounded-xl" style={{ background: `${category.accent}15`, border: `1px solid ${category.accent}33` }}>
                                            <p className="text-white text-sm font-semibold mb-3">Price Summary</p>
                                            <div className="flex justify-between py-2">
                                                <span className="text-gray-300">Daily Rate:</span>
                                                <span className="text-white font-medium">{formatPrice(product.price)}</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span className="text-gray-300">Number of Days:</span>
                                                <span className="text-white font-medium">{rentalDays}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 mt-1 border-t" style={{ borderColor: `${category.accent}33` }}>
                                                <span className="text-white font-semibold">Total Amount:</span>
                                                <span className="font-bold text-2xl text-white" style={{ color: category.accent }}>{formatPrice(totalPrice)}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                                                <span>⚠️</span> Security deposit may be required
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-200">Special Requests</label>
                                            <textarea 
                                                rows={3} 
                                                value={formData.requirements} 
                                                onChange={(e) => setFormData({...formData, requirements: e.target.value})} 
                                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white placeholder-gray-400 resize-none transition-all"
                                                placeholder="Delivery location, pickup time, special instructions..."
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className="w-full py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                            style={{ background: `linear-gradient(135deg, ${category.accent}, ${category.accent}CC)`, boxShadow: `0 4px 20px ${category.accent}40` }}
                                        >
                                            {isSubmitting ? "Processing..." : "Confirm Rental →"}
                                        </button>
                                        
                                        <p className="text-xs text-gray-400 text-center mt-3">
                                            By confirming, you agree to our rental terms and conditions
                                        </p>
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

// Unified Card Component
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
    const itemCount = isRental ? item.items.length : null;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { rotateX.set(0); rotateY.set(0); setHovered(false); }}
            onClick={onClick}
            className="relative group cursor-pointer"
        >
            <motion.div animate={{ opacity: hovered ? 1 : 0 }} className="absolute inset-0 rounded-2xl blur-xl -z-10" style={{ background: `radial-gradient(ellipse at center, ${item.accent}33 0%, transparent 70%)` }} />
            <div className="relative rounded-2xl p-6 h-full border transition-all duration-300" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderColor: hovered ? item.accent + "55" : "rgba(255,255,255,0.1)" }}>
                <div className="text-xs font-mono mb-4 tracking-widest" style={{ color: item.accent + "cc" }}>{item.id}</div>
                <motion.div animate={{ scale: hovered ? 1.15 : 1 }} className="text-4xl mb-5" style={{ color: item.accent }}>{item.icon}</motion.div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed mb-5 text-gray-300">{item.desc}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full uppercase font-medium" style={{ background: item.accent + "20", color: item.accent, border: `1px solid ${item.accent}33` }}>{tag}</span>
                    ))}
                </div>
                {isRental && itemCount && (
                    <div className="text-xs text-gray-300">
                        {itemCount} equipment available
                    </div>
                )}
                <motion.div animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }} className="absolute bottom-6 right-6 text-sm text-white" style={{ color: item.accent }}>
                    {isRental ? "View All →" : "Inquire →"}
                </motion.div>
            </div>
        </motion.div>
    );
}

function OrbVisual() {
    return (
        <div className="relative flex items-center justify-center w-72 h-72 mx-auto">
            <motion.div className="absolute w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, #FF6B2B1A 0%, transparent 70%)" }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} />
            <motion.div className="absolute w-60 h-60 rounded-full" style={{ background: "radial-gradient(circle, #A855F71A 0%, transparent 70%)" }} animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 5, repeat: Infinity }} />
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle, #FF6B2B44, #A855F722)", border: "1px solid rgba(255,107,43,0.4)" }}>
                <span className="text-2xl">🎬</span>
            </div>
        </div>
    );
}

function ServicePage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [selectedRentalCategory, setSelectedRentalCategory] = useState<typeof rentalCategories[0] | null>(null);
    const [isRentalProductsModalOpen, setIsRentalProductsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap";
        document.head.appendChild(link);

        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const gradientStyle = {
        background: "linear-gradient(135deg, #C0C0C0 0%, #FFFFFF 20%, #A8A8A8 40%, #E8E8E8 55%, #888 70%, #FFFFFF 85%, #C0C0C0 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
    };

    const handleCardClick = (item: any) => {
        if (item.type === "service") {
            setSelectedService(item);
            setIsServiceModalOpen(true);
        } else if (item.type === "rental") {
            setSelectedRentalCategory(item);
            setIsRentalProductsModalOpen(true);
        }
    };

    const handleRentClick = (product: any) => {
        setSelectedProduct(product);
        setIsRentalProductsModalOpen(false);
        setIsCheckoutModalOpen(true);
    };

    const handleServiceSubmit = async (data: ServiceFormData): Promise<boolean> => {
        try {
            if (!selectedService) return false;
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            
            const emailData = {
                to: "your-email@example.com",
                subject: `New Service Inquiry: ${selectedService.title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #FF6B2B;">New Service Inquiry from Crewholic</h2>
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
                            <h3>Customer Details:</h3>
                            <p><strong>Name:</strong> ${data.name}</p>
                            <p><strong>Mobile:</strong> ${data.mobile}</p>
                            <p><strong>Email:</strong> ${data.email}</p>
                            
                            <h3>Service Details:</h3>
                            <p><strong>Service:</strong> ${selectedService.title}</p>
                            <p><strong>Timeline:</strong> ${selectedService.timeline}</p>
                            
                            <h3>Requirements:</h3>
                            <p>${data.requirements}</p>
                        </div>
                        <p style="margin-top: 20px; color: #666;">Please contact the customer within 24 hours.</p>
                        <hr />
                        <p style="font-size: 12px; color: #999;">This is an automated message from Crewholic Service System.</p>
                    </div>
                `
            };
            
            const res = await fetch(`${apiUrl}/api/service-inquiry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    service: selectedService.title, 
                    timeline: selectedService.timeline, 
                    ...data,
                    emailData 
                }),
            });
            return res.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleRentalSubmit = async (data: RentalFormData): Promise<boolean> => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            
            const emailData = {
                to: "your-email@example.com",
                subject: `New Rental Request: ${data.productName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #FF6B2B;">New Rental Request from Crewholic</h2>
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
                            <h3>Customer Details:</h3>
                            <p><strong>Name:</strong> ${data.name}</p>
                            <p><strong>Mobile:</strong> ${data.mobile}</p>
                            <p><strong>Email:</strong> ${data.email}</p>
                            
                            <h3>Rental Details:</h3>
                            <p><strong>Category:</strong> ${data.categoryName}</p>
                            <p><strong>Product:</strong> ${data.productName}</p>
                            <p><strong>Price per day:</strong> ₹${data.pricePerDay}</p>
                            <p><strong>Rental Days:</strong> ${data.rentalDays}</p>
                            <p><strong>Total Amount:</strong> ₹${data.totalPrice}</p>
                            
                            <h3>Special Requests:</h3>
                            <p>${data.requirements || "No special requests"}</p>
                        </div>
                        <p style="margin-top: 20px; color: #666;">Please contact the customer within 24 hours.</p>
                        <hr />
                        <p style="font-size: 12px; color: #999;">This is an automated message from Crewholic Rental System.</p>
                    </div>
                `
            };
            
            const res = await fetch(`${apiUrl}/api/rental-inquiry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, emailData }),
            });
            
            return res.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: "#0C0C0C", fontFamily: "'Syne', sans-serif" }}>
            {/* Cursor Glow */}
            <motion.div className="fixed pointer-events-none z-50 rounded-full w-96 h-96" style={{ background: "radial-gradient(circle, rgba(255,107,43,0.05) 0%, transparent 70%)", x: mousePos.x - 200, y: mousePos.y - 200 }} transition={{ type: "spring", stiffness: 150, damping: 20 }} />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5">
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,12,12,0.95) 0%, transparent 100%)" }} />
                <motion.a href="/" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 text-sm font-bold tracking-[0.25em] uppercase" style={{ ...gradientStyle }}>CREWHOLIC</motion.a>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 hidden md:flex items-center gap-8">
                    {["About", "Services", "Projects", "Contact"].map((item) => (
                        <a key={item} href={`/${item.toLowerCase()}`} className="text-xs tracking-widest uppercase transition-colors" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Space Mono', monospace" }}>{item}</a>
                    ))}
                </motion.div>
                <MagneticButton className="relative z-10">
                    <motion.button className="relative overflow-hidden text-xs tracking-widest uppercase px-5 py-2.5 rounded-full font-medium" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }} whileHover={{ borderColor: "rgba(255,107,43,0.6)", color: "#FF6B2B" }}>Contact</motion.button>
                </MagneticButton>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "#FF6B2B" }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: "#A855F7" }} />
                
                <div className="relative z-10 text-center max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-px w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                        <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#FF6B2B99", fontFamily: "'Space Mono', monospace" }}>What we offer</span>
                        <div className="h-px w-12" style={{ background: "rgba(255,107,43,0.4)" }} />
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="font-extrabold leading-none tracking-tighter mb-6" style={{ ...gradientStyle, fontSize: "clamp(56px, 10vw, 120px)" }}>SERVICES &<br />RENTALS</motion.h1>
                    <OrbVisual />
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Premium digital services <span style={{ color: "#FF6B2B" }}>+</span> Professional equipment rental
                    </motion.p>
                </div>
            </section>

            {/* All Cards Grid */}
            <section className="relative py-24 px-6 md:px-12 lg:px-20">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-1 max-w-16" style={{ background: "rgba(255,107,43,0.3)" }} />
                    <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#FF6B2B66", fontFamily: "'Space Mono', monospace" }}>Explore All</span>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
                    {allCards.map((item, i) => (
                        <ServiceCard key={item.id} item={item} index={i} onClick={() => handleCardClick(item)} />
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6 text-center">
                <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(ellipse at center, #FF6B2B 0%, transparent 65%)" }} />
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
                    <p className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: "#FF6B2B66" }}>Need custom requirements?</p>
                    <h2 className="font-extrabold leading-none tracking-tighter mb-8" style={{ ...gradientStyle, fontSize: "clamp(40px, 7vw, 96px)" }}>LET'S TALK<br />ABOUT YOUR<br />PROJECT.</h2>
                    <MagneticButton>
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="relative overflow-hidden px-10 py-4 rounded-full text-sm tracking-widest uppercase font-bold" style={{ background: "linear-gradient(135deg, #FF6B2B, #E85520)", color: "#0C0C0C", boxShadow: "0 0 40px rgba(255,107,43,0.3)" }}>
                            <span className="relative z-10">Contact Us</span>
                        </motion.button>
                    </MagneticButton>
                </motion.div>
            </section>

            {/* Footer */}
            <div className="px-8 py-6 flex items-center justify-between border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>© 2024 Crewholic</span>
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>All rights reserved</span>
            </div>

            {/* Modals */}
            <ServiceInquiryModal service={selectedService} isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} onSubmit={handleServiceSubmit} />
            <RentalProductsModal category={selectedRentalCategory} isOpen={isRentalProductsModalOpen} onClose={() => setIsRentalProductsModalOpen(false)} onRentClick={handleRentClick} />
            <RentalCheckoutModal product={selectedProduct} category={selectedRentalCategory} isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} onSubmit={handleRentalSubmit} />
        </div>
    );
}

export default ServicePage;