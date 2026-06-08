/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export const Route = createFileRoute("/dashboard")({
    component: UserDashboard,
});

const API_URL = import.meta.env.VITE_API_URL || "https://crewholic-1-if9w.onrender.com";

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    invoiceUrl?: string;
}

interface User {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    mobile?: string;
    memberSince?: string;
    avatar?: string;
    role?: string;
}

// ── Per-user localStorage key so users never share order data ──
const getUserOrderKey = (user: User) =>
    `userOrders_${user._id || user.id || user.email}`;

function UserDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        // ── If no token/user, send to login immediately ──
        if (!token || !userData) {
            navigate({ to: "/login" });
            return;
        }

        let parsedUser: User;
        try {
            parsedUser = JSON.parse(userData);
        } catch {
            navigate({ to: "/login" });
            return;
        }

        const enrichedUser: User = {
            ...parsedUser,
            memberSince:
                parsedUser.memberSince ||
                new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                }),
            mobile: parsedUser.mobile || "",
        };

        setUser(enrichedUser);
        fetchUserOrders(enrichedUser, token);
        setLoading(false);
    }, []);

    // ── Fetch orders from backend; fall back to per-user cache ──
    const fetchUserOrders = async (currentUser: User, token: string) => {
        setOrdersLoading(true);
        const cacheKey = getUserOrderKey(currentUser);

        try {
            const res = await fetch(`${API_URL}/api/orders/my-orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    // Backend may return { orders: [...] } or directly [...]
                    const fetchedOrders: Order[] = Array.isArray(data)
                        ? data
                        : data.orders || [];

                    setOrders(fetchedOrders);
                    // Cache the freshly fetched orders for this user
                    localStorage.setItem(cacheKey, JSON.stringify(fetchedOrders));
                    setOrdersLoading(false);
                    return;
                }
            }

            // ── Backend unavailable or non-JSON — use per-user cache ──
            loadOrdersFromCache(cacheKey);
        } catch {
            // ── Network error — use per-user cache ──
            loadOrdersFromCache(cacheKey);
        } finally {
            setOrdersLoading(false);
        }
    };

    const loadOrdersFromCache = (cacheKey: string) => {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                setOrders(JSON.parse(cached));
            } catch {
                setOrders([]);
            }
        } else {
            // ── New user with no history: show empty state, never inject demo data ──
            setOrders([]);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────
    const getStatusColor = (status: Order["status"]) => {
        const map: Record<Order["status"], { bg: string; text: string }> = {
            pending: { bg: "rgba(255,193,7,0.15)", text: "#FFC107" },
            processing: { bg: "rgba(33,150,243,0.15)", text: "#2196F3" },
            shipped: { bg: "rgba(156,39,176,0.15)", text: "#9C27B0" },
            delivered: { bg: "rgba(76,175,80,0.15)", text: "#4CAF50" },
            cancelled: { bg: "rgba(244,67,54,0.15)", text: "#F44336" },
        };
        return map[status] || { bg: "rgba(158,158,158,0.15)", text: "#9E9E9E" };
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const formatCurrency = (amount: number) =>
        `Rs. ${amount.toLocaleString("en-IN")}`;

    const getStatusSteps = (currentStatus: Order["status"]) => {
        const steps = ["pending", "processing", "shipped", "delivered"] as const;
        const currentIndex = steps.indexOf(currentStatus);
        return steps.map((step, index) => ({
            label: step.charAt(0).toUpperCase() + step.slice(1),
            completed: index <= currentIndex,
            active: index === currentIndex,
        }));
    };

    // ─────────────────────────────────────────────────────────────────────────
    // PDF Invoice
    // ─────────────────────────────────────────────────────────────────────────
    const downloadInvoicePDF = (order: Order) => {
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let y = 18;

        doc.setFillColor(12, 12, 12);
        doc.rect(0, 0, pageWidth, 35, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("CREWHOLIC", margin, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Fusion-Powered Digital Agency", margin, y + 7);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("INVOICE", pageWidth - margin, y, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(order.orderNumber, pageWidth - margin, y + 7, { align: "right" });

        y = 48;
        doc.setTextColor(20, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("BILL TO", margin, y);
        doc.text("INVOICE DETAILS", 120, y);

        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(user?.name || order.shippingAddress.name, margin, y);
        doc.text(`Invoice No: ${order.orderNumber}`, 120, y);

        y += 6;
        doc.text(user?.email || "N/A", margin, y);
        doc.text(`Date: ${formatDate(order.date)}`, 120, y);

        y += 6;
        doc.text(order.shippingAddress.phone, margin, y);
        doc.text(`Status: ${order.status.toUpperCase()}`, 120, y);

        y += 6;
        doc.text(order.shippingAddress.address, margin, y);
        doc.text(`Payment: ${order.paymentMethod}`, 120, y);

        y += 6;
        doc.text(
            `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
            margin,
            y
        );

        y += 18;
        doc.setFillColor(155, 81, 224);
        doc.rect(margin, y, pageWidth - margin * 2, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("ITEM", margin + 3, y + 6.5);
        doc.text("QTY", 115, y + 6.5);
        doc.text("PRICE", 137, y + 6.5);
        doc.text("TOTAL", pageWidth - margin - 3, y + 6.5, { align: "right" });

        y += 12;
        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        order.items.forEach((item, index) => {
            if (y > 255) { doc.addPage(); y = 20; }
            const rowHeight = 10;
            if (index % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(margin, y - 5, pageWidth - margin * 2, rowHeight, "F");
            }
            doc.text(item.name, margin + 3, y + 1);
            doc.text(String(item.quantity), 118, y + 1);
            doc.text(formatCurrency(item.price), 137, y + 1);
            doc.text(formatCurrency(item.price * item.quantity), pageWidth - margin - 3, y + 1, { align: "right" });
            y += rowHeight;
        });

        y += 8;
        doc.setDrawColor(220, 220, 220);
        doc.line(120, y, pageWidth - margin, y);

        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Total Amount", 120, y);
        doc.text(formatCurrency(order.totalAmount), pageWidth - margin, y, { align: "right" });

        y += 20;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 90);
        doc.text("Thank you for choosing CREWHOLIC.", margin, y);
        doc.text("This is a system generated invoice.", margin, y + 6);

        doc.save(`Invoice_${order.orderNumber}.pdf`);
    };

    // ── Logout: clear only session keys, preserve per-user order cache ──
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("permissions");
        navigate({ to: "/login" });
    };

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Services", href: "/service" },
        { label: "Projects", href: "/project" },
        { label: "Contact", href: "/contact" },
    ];

    // ─────────────────────────────────────────────────────────────────────────
    // Loading screen
    // ─────────────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0C0C0C",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            border: "4px solid rgba(242,153,74,0.2)",
                            borderTopColor: "#F2994A",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                            margin: "0 auto 16px",
                        }}
                    />
                    <p style={{ color: "#9aa4bf", fontSize: 14 }}>Loading dashboard...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Empty-orders component — reused in overview + orders tab
    // ─────────────────────────────────────────────────────────────────────────
    const EmptyOrders = () => (
        <div
            style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 16,
                border: "1px dashed rgba(255,255,255,0.1)",
            }}
        >
            <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
            <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                No orders yet
            </p>
            <p style={{ color: "#9aa4bf", fontSize: 14, marginBottom: 20 }}>
                Once you place an order it will appear here.
            </p>
            <Link
                to="/service"
                style={{
                    display: "inline-block",
                    padding: "10px 24px",
                    background: "linear-gradient(105deg,#9B51E0,#F2994A)",
                    borderRadius: 8,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                }}
            >
                Browse Services
            </Link>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Main render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: "100vh", background: "#0C0C0C", fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                .db-scroll::-webkit-scrollbar { width: 6px; }
                .db-scroll::-webkit-scrollbar-track { background: rgba(155,81,224,0.1); border-radius: 10px; }
                .db-scroll::-webkit-scrollbar-thumb { background: rgba(155,81,224,0.5); border-radius: 10px; }

                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .tab-panel { animation: fadeIn 0.25s ease; }

                .order-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(12px);
                    border-radius: 14px;
                    border: 1px solid rgba(255,255,255,0.08);
                    overflow: hidden;
                    transition: border-color 0.2s;
                }
                .order-card:hover { border-color: rgba(242,153,74,0.3); }

                .stat-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(12px);
                    border-radius: 14px;
                    padding: 20px;
                    border: 1px solid rgba(255,255,255,0.08);
                    transition: border-color 0.2s, transform 0.2s;
                }
                .stat-card:hover { border-color: rgba(155,81,224,0.3); transform: translateY(-2px); }

                .nav-link {
                    font-size: 13px;
                    color: #9aa4bf;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .nav-link:hover { color: #F2994A; }

                @media (max-width: 640px) {
                    .stats-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>

            {/* ── Navbar ── */}
            <nav
                style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0,
                    zIndex: 40,
                    background: "rgba(0,0,0,0.85)",
                    backdropFilter: "blur(14px)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link
                        to="/"
                        style={{
                            fontSize: 18,
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            textDecoration: "none",
                            background: "linear-gradient(135deg,#9B51E0,#F2994A)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        CREWHOLIC
                    </Link>

                    {/* Desktop nav */}
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="desktop-nav">
                        {navItems.map((item) => (
                            <Link key={item.label} to={item.href as any} className="nav-link">{item.label}</Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            style={{ fontSize: 13, color: "#F87171", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#FCA5A5")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#F87171")}
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "none" }}
                        className="mobile-menu-btn"
                    >
                        <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                    </button>
                </div>

                <style>{`
                    @media (max-width: 768px) {
                        .desktop-nav { display: none !important; }
                        .mobile-menu-btn { display: block !important; }
                    }
                `}</style>
            </nav>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    style={{
                        position: "fixed", inset: 0, zIndex: 50,
                        background: "rgba(0,0,0,0.96)", backdropFilter: "blur(20px)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28,
                        animation: "fadeIn 0.2s ease",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href as any}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: 22, color: "#fff", textDecoration: "none" }}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} style={{ fontSize: 22, color: "#F87171", background: "none", border: "none", cursor: "pointer" }}>
                        Logout
                    </button>
                </div>
            )}

            {/* ── Page body ── */}
            <div style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1200, margin: "0 auto", padding: "80px 20px 60px" }}>

                {/* Welcome header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
                        Welcome back, {user?.name?.split(" ")[0]}! 👋
                    </h1>
                    <p style={{ color: "#9aa4bf", marginTop: 6, fontSize: 14 }}>
                        Member since {user?.memberSince}
                    </p>
                </div>

                {/* ── Stat cards ── */}
                <div
                    className="stats-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 14,
                        marginBottom: 28,
                    }}
                >
                    {[
                        { label: "Total Orders", value: orders.length, icon: "📦", valueColor: "#fff" },
                        {
                            label: "Total Spent",
                            value: `₹${orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString("en-IN")}`,
                            icon: "💰",
                            valueColor: "#fff",
                        },
                        {
                            label: "Delivered",
                            value: orders.filter((o) => o.status === "delivered").length,
                            icon: "✅",
                            valueColor: "#4CAF50",
                        },
                        {
                            label: "In Transit",
                            value: orders.filter((o) => o.status === "shipped" || o.status === "processing").length,
                            icon: "🚚",
                            valueColor: "#F2994A",
                        },
                    ].map((s) => (
                        <div key={s.label} className="stat-card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <p style={{ color: "#9aa4bf", fontSize: 12, marginBottom: 8 }}>{s.label}</p>
                                    <p style={{ fontSize: 26, fontWeight: 700, color: s.valueColor, margin: 0 }}>{s.value}</p>
                                </div>
                                <span style={{ fontSize: 28 }}>{s.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Tabs ── */}
                <div style={{ display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 24, overflowX: "auto", paddingBottom: 2 }}>
                    {[
                        { id: "overview", label: "Overview", icon: "📊" },
                        { id: "orders", label: "My Orders", icon: "📋" },
                        { id: "profile", label: "Profile", icon: "👤" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            style={{
                                padding: "9px 18px",
                                borderRadius: 8,
                                fontWeight: 500,
                                fontSize: 13,
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                whiteSpace: "nowrap",
                                background:
                                    activeTab === tab.id
                                        ? "linear-gradient(105deg,#9B51E0,#F2994A)"
                                        : "transparent",
                                color: activeTab === tab.id ? "#fff" : "#9aa4bf",
                                transition: "all 0.2s",
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ══════════════════════════════════════════
                    TAB: Overview
                ══════════════════════════════════════════ */}
                {activeTab === "overview" && (
                    <div className="tab-panel" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                        <div>
                            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>
                                Recent Orders
                            </h2>

                            {ordersLoading ? (
                                <OrdersSkeleton />
                            ) : orders.length === 0 ? (
                                <EmptyOrders />
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {orders.slice(0, 3).map((order) => {
                                        const sc = getStatusColor(order.status);
                                        return (
                                            <div key={order.id} className="order-card" style={{ padding: 16 }}>
                                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                                                    <div>
                                                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{order.orderNumber}</p>
                                                        <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>{formatDate(order.date)}</p>
                                                    </div>
                                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: sc.bg, color: sc.text }}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                    <div style={{ textAlign: "right" }}>
                                                        <p style={{ color: "#fff", fontWeight: 600 }}>₹{order.totalAmount.toLocaleString("en-IN")}</p>
                                                        <button
                                                            onClick={() => { setSelectedOrder(order); setShowInvoiceModal(true); }}
                                                            style={{ fontSize: 12, color: "#F2994A", background: "none", border: "none", cursor: "pointer", marginTop: 2 }}
                                                        >
                                                            View Details →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {orders.length > 3 && (
                                        <button
                                            onClick={() => setActiveTab("orders")}
                                            style={{ alignSelf: "flex-start", marginTop: 4, fontSize: 13, color: "#F2994A", background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            View all {orders.length} orders →
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick actions */}
                        <div
                            style={{
                                background: "linear-gradient(135deg, rgba(155,81,224,0.08), rgba(242,153,74,0.08))",
                                borderRadius: 14,
                                padding: 22,
                                border: "1px solid rgba(255,255,255,0.07)",
                            }}
                        >
                            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Quick Actions</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                                {[
                                    { icon: "🛍️", label: "Rent Equipment", to: "/service" },
                                    { icon: "💬", label: "Contact Support", to: "/contact" },
                                ].map((a) => (
                                    <Link
                                        key={a.label}
                                        to={a.to as any}
                                        style={{
                                            background: "rgba(255,255,255,0.05)",
                                            borderRadius: 10,
                                            padding: 14,
                                            textAlign: "center",
                                            textDecoration: "none",
                                            transition: "background 0.2s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                                    >
                                        <div style={{ fontSize: 24, marginBottom: 4 }}>{a.icon}</div>
                                        <p style={{ color: "#fff", fontSize: 13 }}>{a.label}</p>
                                    </Link>
                                ))}
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        borderRadius: 10,
                                        padding: 14,
                                        textAlign: "center",
                                        border: "none",
                                        cursor: "pointer",
                                        transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                                >
                                    <div style={{ fontSize: 24, marginBottom: 4 }}>⚙️</div>
                                    <p style={{ color: "#fff", fontSize: 13 }}>Edit Profile</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                    TAB: My Orders
                ══════════════════════════════════════════ */}
                {activeTab === "orders" && (
                    <div className="tab-panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {ordersLoading ? (
                            <OrdersSkeleton />
                        ) : orders.length === 0 ? (
                            <EmptyOrders />
                        ) : (
                            orders.map((order) => {
                                const sc = getStatusColor(order.status);
                                const steps = getStatusSteps(order.status);
                                return (
                                    <div key={order.id} className="order-card">
                                        {/* Order header */}
                                        <div
                                            style={{
                                                padding: "14px 18px",
                                                borderBottom: "1px solid rgba(255,255,255,0.07)",
                                                background: "rgba(255,255,255,0.03)",
                                                display: "flex",
                                                flexWrap: "wrap",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: 12,
                                            }}
                                        >
                                            <div>
                                                <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{order.orderNumber}</p>
                                                <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>Placed on {formatDate(order.date)}</p>
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: sc.bg, color: sc.text }}>
                                                {order.status.toUpperCase()}
                                            </span>
                                            <div style={{ display: "flex", gap: 14 }}>
                                                <button
                                                    onClick={() => downloadInvoicePDF(order)}
                                                    style={{ fontSize: 12, color: "#F2994A", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                                >
                                                    📄 Invoice
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setShowInvoiceModal(true); }}
                                                    style={{ fontSize: 12, color: "#9B51E0", background: "none", border: "none", cursor: "pointer" }}
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div style={{ padding: "14px 18px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                                        <span style={{ fontSize: 28 }}>{item.image}</span>
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>{item.name}</p>
                                                            <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>
                                                                Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                                                            </p>
                                                        </div>
                                                        <p style={{ color: "#fff", fontWeight: 600 }}>
                                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                                                <p style={{ color: "#9aa4bf", fontSize: 13 }}>Total Amount</p>
                                                <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                                                    ₹{order.totalAmount.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status tracker */}
                                        <div style={{ padding: "12px 18px 16px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                            <p style={{ color: "#9aa4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Order Progress</p>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                {steps.map((step, idx) => (
                                                    <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                                                        {idx < steps.length - 1 && (
                                                            <div style={{
                                                                position: "absolute", top: 6, left: "50%", width: "100%", height: 2,
                                                                background: step.completed ? "#4CAF50" : "rgba(255,255,255,0.1)",
                                                            }} />
                                                        )}
                                                        <div style={{
                                                            width: 14, height: 14, borderRadius: "50%", zIndex: 1,
                                                            background: step.completed ? "#4CAF50" : "rgba(255,255,255,0.1)",
                                                            border: step.active ? "2px solid #4CAF50" : "none",
                                                        }} />
                                                        <p style={{ fontSize: 10, marginTop: 6, color: step.completed ? "#fff" : "#555", textAlign: "center" }}>
                                                            {step.label}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ══════════════════════════════════════════
                    TAB: Profile
                ══════════════════════════════════════════ */}
                {activeTab === "profile" && (
                    <div
                        className="tab-panel"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 14,
                            padding: 24,
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {/* Avatar + name */}
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginBottom: 28 }}>
                            <div
                                style={{
                                    width: 80, height: 80, borderRadius: "50%",
                                    background: "linear-gradient(135deg,#9B51E0,#F2994A)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 32, fontWeight: 700, color: "#fff", flexShrink: 0,
                                }}
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>{user?.name}</h2>
                                <p style={{ color: "#9aa4bf", fontSize: 13, marginTop: 4 }}>{user?.email}</p>
                                <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>Member since {user?.memberSince}</p>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            {/* Personal info */}
                            <div>
                                <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 14, fontSize: 15 }}>Personal Information</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {[
                                        { label: "Full Name", value: user?.name },
                                        { label: "Email Address", value: user?.email },
                                        { label: "Mobile Number", value: user?.mobile || "Not set" },
                                    ].map((f) => (
                                        <div key={f.label}>
                                            <p style={{ color: "#9aa4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{f.label}</p>
                                            <p style={{ color: "#fff", fontSize: 14 }}>{f.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Account stats */}
                            <div>
                                <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 14, fontSize: 15 }}>Account Statistics</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {[
                                        { label: "Total Orders", value: orders.length },
                                        { label: "Total Spent", value: `₹${orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString("en-IN")}` },
                                        { label: "Completed Orders", value: orders.filter((o) => o.status === "delivered").length },
                                    ].map((s) => (
                                        <div key={s.label}>
                                            <p style={{ color: "#9aa4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{s.label}</p>
                                            <p style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "9px 22px",
                                    background: "rgba(248,113,113,0.1)",
                                    border: "1px solid rgba(248,113,113,0.35)",
                                    borderRadius: 8,
                                    color: "#F87171",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.18)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                            >
                                Logout Account
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Order detail modal ── */}
            {showInvoiceModal && selectedOrder && (
                <div
                    style={{
                        position: "fixed", inset: 0, zIndex: 50,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 16,
                        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
                    }}
                    onClick={() => setShowInvoiceModal(false)}
                >
                    <div
                        style={{
                            background: "#0E0E14",
                            borderRadius: 16,
                            maxWidth: 620,
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            border: "1px solid rgba(255,255,255,0.1)",
                            animation: "slideUp 0.25s ease",
                        }}
                        className="db-scroll"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div style={{ position: "sticky", top: 0, background: "#0E0E14", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0 }}>Order Details</h2>
                            <button onClick={() => setShowInvoiceModal(false)} style={{ background: "none", border: "none", color: "#9aa4bf", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
                        </div>

                        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
                            {/* Meta */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                {[
                                    { label: "Order Number", value: selectedOrder.orderNumber },
                                    { label: "Order Date", value: formatDate(selectedOrder.date) },
                                    { label: "Payment Method", value: selectedOrder.paymentMethod },
                                    { label: "Status", value: selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) },
                                ].map((f) => (
                                    <div key={f.label}>
                                        <p style={{ color: "#9aa4bf", fontSize: 11, marginBottom: 4 }}>{f.label}</p>
                                        <p style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>{f.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Items */}
                            <div>
                                <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: 15 }}>Items Ordered</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                                            <div>
                                                <p style={{ color: "#fff", fontSize: 14 }}>{item.name}</p>
                                                <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>Qty: {item.quantity}</p>
                                            </div>
                                            <p style={{ color: "#fff", fontWeight: 500 }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 10 }}>
                                    <p style={{ color: "#fff", fontWeight: 600 }}>Total</p>
                                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</p>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div>
                                <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: 15 }}>Shipping Address</h3>
                                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px" }}>
                                    <p style={{ color: "#fff", fontWeight: 500 }}>{selectedOrder.shippingAddress.name}</p>
                                    <p style={{ color: "#9aa4bf", fontSize: 13, marginTop: 4 }}>{selectedOrder.shippingAddress.address}</p>
                                    <p style={{ color: "#9aa4bf", fontSize: 13 }}>
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} — {selectedOrder.shippingAddress.pincode}
                                    </p>
                                    <p style={{ color: "#9aa4bf", fontSize: 13, marginTop: 4 }}>📞 {selectedOrder.shippingAddress.phone}</p>
                                </div>
                            </div>

                            {/* Download button */}
                            <button
                                onClick={() => downloadInvoicePDF(selectedOrder)}
                                style={{
                                    width: "100%", padding: "12px 0",
                                    background: "linear-gradient(105deg,#9B51E0,#F2994A)",
                                    border: "none", borderRadius: 10,
                                    color: "#fff", fontWeight: 600, fontSize: 14,
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                }}
                            >
                                📄 Download Invoice PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Skeleton loader shown while orders are fetching ──────────────────────────
function OrdersSkeleton() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                        height: 80,
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        animation: "pulse 1.5s ease-in-out infinite",
                        animationDelay: `${i * 0.15}s`,
                    }}
                />
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
        </div>
    );
}

export default UserDashboard;