/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/user-dashboard")({
    component: UserDashboard,
});

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    avatar?: string;
    joinedDate?: string;
}

interface ServiceInquiry {
    id: string;
    orderId: string;
    serviceType: string;
    serviceName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    requirements: string;
    budget?: number;
    timeline?: string;
    status: string;
    paymentStatus: string;
    submittedAt: string;
    date: string;
    createdAt: string;
}

interface RentalOrder {
    id: string;
    orderId: string;
    serviceType: string;
    serviceName: string;
    equipmentName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    rentalDays: number;
    dailyRate: number;
    totalAmount: number;
    startDate: string;
    requirements: string;
    status: string;
    paymentStatus: string;
    submittedAt: string;
    date: string;
    createdAt: string;
}

type Order = ServiceInquiry | RentalOrder;

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

function OrbVisual() {
    const orbs = [
        { size: 200, color: "#FF6B2B", opacity: 0.12, dur: 8 },
        { size: 140, color: "#A855F7", opacity: 0.15, dur: 6 },
        { size: 80, color: "#FF6B2B", opacity: 0.2, dur: 4 },
    ];

    return (
        <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
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
            <div
                className="relative w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                    background: "radial-gradient(circle, #FF6B2B44 0%, #A855F722 50%, transparent 100%)",
                    border: "1px solid rgba(255,107,43,0.4)",
                }}
            >
                <span style={{ fontSize: 16 }}>👤</span>
            </div>
        </div>
    );
}

function UserDashboard() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [toastMessage, setToastMessage] = useState<{ text: string; isError: boolean } | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

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
        
        // Load user data
        loadUserData();
        
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const loadUserData = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
                loadUserOrders(user.email);
            } catch (e) {
                console.error("Error parsing user:", e);
                window.location.href = "/login";
            }
        } else {
            window.location.href = "/login";
        }
    };

    const loadUserOrders = (userEmail: string) => {
        // Load from localStorage
        const allOrders = JSON.parse(localStorage.getItem("crewholic_orders") || "[]");
        const userSpecificOrders = allOrders.filter(
            (order: Order) => order.customerEmail === userEmail
        );
        setUserOrders(userSpecificOrders.sort((a: Order, b: Order) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
    };

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

    const handleLogout = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        showMessage("👋 Logged out successfully!");
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "#4caf50";
            case "pending":
                return "#ff9800";
            case "rejected":
                return "#f44336";
            case "completed":
                return "#2196f3";
            default:
                return "#888";
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            approved: "bg-green-500/20 text-green-400",
            pending: "bg-orange-500/20 text-orange-400",
            rejected: "bg-red-500/20 text-red-400",
            completed: "bg-blue-500/20 text-blue-400",
        };
        return colors[status] || "bg-gray-500/20 text-gray-400";
    };

    const stats = {
        total: userOrders.length,
        pending: userOrders.filter(o => o.status === "pending").length,
        approved: userOrders.filter(o => o.status === "approved").length,
        completed: userOrders.filter(o => o.status === "completed").length,
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
                className="fixed pointer-events-none z-50 rounded-full hidden lg:block"
                style={{
                    width: 400,
                    height: 400,
                    background: "radial-gradient(circle, rgba(255,107,43,0.05) 0%, transparent 70%)",
                    x: mousePos.x - 200,
                    y: mousePos.y - 200,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
            />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(180deg, rgba(12,12,12,0.95) 0%, transparent 100%)",
                    }}
                />
                <div className="relative z-10 flex items-center justify-between w-full">
                    <motion.a
                        href="/"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-sm font-bold tracking-[0.25em] uppercase"
                        style={{ ...gradientStyle, fontFamily: "'Syne', sans-serif" }}
                    >
                        CREWHOLIC
                    </motion.a>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: "rgba(155,81,224,0.15)", border: "1px solid rgba(155,81,224,0.3)" }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "linear-gradient(135deg, #9B51E0, #F2994A)" }}>
                                {(currentUser?.name || currentUser?.email?.[0] || "U").toUpperCase().slice(0, 2)}
                            </div>
                            <span className="text-sm text-white">{currentUser?.name?.split(' ')[0] || "User"}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
                            style={{ background: "rgba(255,255,255,0.1)", color: "#ff6b6b" }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="pt-32 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-px w-8" style={{ background: "rgba(255,107,43,0.4)" }} />
                                <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#FF6B2B99" }}>Dashboard</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold" style={gradientStyle}>
                                Welcome back, {currentUser?.name?.split(' ')[0] || "User"}!
                            </h1>
                            <p className="text-gray-400 mt-2">Manage your orders and track your project progress</p>
                        </div>
                        <OrbVisual />
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Total Orders", value: stats.total, icon: "📦", color: "#FF6B2B" },
                            { label: "Pending", value: stats.pending, icon: "⏳", color: "#ff9800" },
                            { label: "Approved", value: stats.approved, icon: "✓", color: "#4caf50" },
                            { label: "Completed", value: stats.completed, icon: "🎉", color: "#2196f3" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl text-center"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: `1px solid ${stat.color}33`,
                                }}
                            >
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
                        {["overview", "orders"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all uppercase tracking-wider ${
                                    activeTab === tab
                                        ? "text-white"
                                        : "text-gray-400 hover:text-white"
                                }`}
                                style={{
                                    background: activeTab === tab ? "linear-gradient(135deg, #FF6B2B, #A855F7)" : "transparent",
                                }}
                            >
                                {tab === "overview" ? "Overview" : "My Orders"}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    {activeTab === "orders" && (
                        <div className="space-y-4">
                            {userOrders.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">📭</div>
                                    <p className="text-gray-400">No orders found</p>
                                    <a
                                        href="/service"
                                        className="inline-block mt-4 px-6 py-2 rounded-full text-sm font-medium"
                                        style={{ background: "linear-gradient(135deg, #FF6B2B, #A855F7)" }}
                                    >
                                        Browse Services
                                    </a>
                                </div>
                            ) : (
                                userOrders.map((order, index) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowOrderModal(true);
                                        }}
                                        className="p-5 rounded-2xl cursor-pointer transition-all hover:translate-x-1"
                                        style={{
                                            background: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                        }}
                                    >
                                        <div className="flex flex-wrap justify-between items-start gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs font-mono text-gray-500">{order.orderId}</span>
                                                    <span
                                                        className={`text-[9px] px-2 py-0.5 rounded-full ${getStatusBadge(order.status)}`}
                                                    >
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-white">{order.serviceName}</h3>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Submitted: {new Date(order.submittedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {'dailyRate' in order && (
                                                    <p className="text-orange-500 font-semibold">${order.totalAmount}</p>
                                                )}
                                                {'budget' in order && order.budget && (
                                                    <p className="text-orange-500 font-semibold">${order.budget}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">Click to view details →</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* User Info Card */}
                            <div
                                className="lg:col-span-1 p-6 rounded-2xl"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <h3 className="text-lg font-semibold mb-4" style={{ color: "#FF6B2B" }}>Profile Info</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Full Name</p>
                                        <p className="text-white">{currentUser?.name || "Not set"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                        <p className="text-white">{currentUser?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Member Since</p>
                                        <p className="text-white">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div
                                className="lg:col-span-2 p-6 rounded-2xl"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <h3 className="text-lg font-semibold mb-4" style={{ color: "#A855F7" }}>Recent Activity</h3>
                                {userOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                                        <div>
                                            <p className="text-sm text-white">{order.serviceName}</p>
                                            <p className="text-xs text-gray-500">{new Date(order.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                                {userOrders.length === 0 && (
                                    <p className="text-gray-400 text-center py-8">No recent activity</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {showOrderModal && selectedOrder && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOrderModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div
                                className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 pointer-events-auto"
                                style={{
                                    background: "linear-gradient(135deg, rgba(20,20,30,0.98), rgba(10,10,15,0.98))",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(155,81,224,0.3)",
                                }}
                            >
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    className="absolute top-5 right-5 text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                                
                                <h2 className="text-2xl font-bold mb-4" style={gradientStyle}>
                                    Order Details
                                </h2>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between pb-2 border-b border-white/10">
                                        <span className="text-gray-400">Order ID</span>
                                        <span className="text-white font-mono">{selectedOrder.orderId}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-white/10">
                                        <span className="text-gray-400">Service</span>
                                        <span className="text-white">{selectedOrder.serviceName}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-white/10">
                                        <span className="text-gray-400">Status</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(selectedOrder.status)}`}>
                                            {selectedOrder.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-white/10">
                                        <span className="text-gray-400">Submitted</span>
                                        <span className="text-white">{new Date(selectedOrder.submittedAt).toLocaleString()}</span>
                                    </div>
                                    
                                    {'equipmentName' in selectedOrder && (
                                        <>
                                            <div className="flex justify-between pb-2 border-b border-white/10">
                                                <span className="text-gray-400">Equipment</span>
                                                <span className="text-white">{selectedOrder.equipmentName}</span>
                                            </div>
                                            <div className="flex justify-between pb-2 border-b border-white/10">
                                                <span className="text-gray-400">Rental Days</span>
                                                <span className="text-white">{selectedOrder.rentalDays}</span>
                                            </div>
                                            <div className="flex justify-between pb-2 border-b border-white/10">
                                                <span className="text-gray-400">Total Amount</span>
                                                <span className="text-orange-500 font-semibold">${selectedOrder.totalAmount}</span>
                                            </div>
                                        </>
                                    )}
                                    
                                    {'requirements' in selectedOrder && selectedOrder.requirements && (
                                        <div className="pt-2">
                                            <span className="text-gray-400 block mb-2">Requirements</span>
                                            <p className="text-white text-sm bg-white/5 p-3 rounded-xl">{selectedOrder.requirements}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="py-6 px-8 border-t border-white/10 text-center">
                <p className="text-gray-500 text-xs">© 2025 CREWHOLIC — User Dashboard</p>
            </footer>
        </div>
    );
}

export default UserDashboard;