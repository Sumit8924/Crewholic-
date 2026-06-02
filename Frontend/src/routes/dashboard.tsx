/* eslint-disable prettier/prettier */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import logo from "../components/portfolio/skr.png";

export const Route = createFileRoute("/dashboard")({
    component: UserDashboard,
});

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    items: {
        id: number;
        name: string;
        quantity: number;
        price: number;
        image: string;
    }[];
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
    name: string;
    email: string;
    mobile?: string;
    memberSince: string;
    avatar?: string;
}

function UserDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");

        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser({
                ...parsedUser,
                memberSince: new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                }),
                mobile: parsedUser.mobile || "+91 98765 43210",
            });
        } else {
            setUser({
                name: "John Doe",
                email: "john.doe@example.com",
                mobile: "+91 98765 43210",
                memberSince: "January 2024",
            });
        }

        const storedOrders = localStorage.getItem("userOrders");

        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            const demoOrders: Order[] = [
                {
                    id: "1",
                    orderNumber: "ORD-2024-001",
                    date: "2024-03-15",
                    status: "delivered",
                    items: [
                        { id: 1, name: "Canon EOS 200d mark2", quantity: 1, price: 700, image: "📷" },
                        { id: 2, name: "DJI RS4 Gimbal", quantity: 1, price: 1500, image: "⚖️" },
                    ],
                    totalAmount: 2200,
                    paymentMethod: "Credit Card",
                    shippingAddress: {
                        name: "John Doe",
                        address: "123 Main Street",
                        city: "Mumbai",
                        state: "Maharashtra",
                        pincode: "400001",
                        phone: "+91 98765 43210",
                    },
                },
                {
                    id: "2",
                    orderNumber: "ORD-2024-002",
                    date: "2024-02-28",
                    status: "shipped",
                    items: [{ id: 3, name: "Sony alpha 7 mark 3", quantity: 1, price: 2500, image: "📷" }],
                    totalAmount: 2500,
                    paymentMethod: "UPI",
                    shippingAddress: {
                        name: "John Doe",
                        address: "123 Main Street",
                        city: "Mumbai",
                        state: "Maharashtra",
                        pincode: "400001",
                        phone: "+91 98765 43210",
                    },
                },
                {
                    id: "3",
                    orderNumber: "ORD-2024-003",
                    date: "2024-03-01",
                    status: "processing",
                    items: [
                        { id: 4, name: "DJI Mini 4 Pro", quantity: 1, price: 2500, image: "🚁" },
                        { id: 5, name: "DJI Mobile Gimbal", quantity: 2, price: 400, image: "📱" },
                    ],
                    totalAmount: 3300,
                    paymentMethod: "Credit Card",
                    shippingAddress: {
                        name: "John Doe",
                        address: "123 Main Street",
                        city: "Mumbai",
                        state: "Maharashtra",
                        pincode: "400001",
                        phone: "+91 98765 43210",
                    },
                },
                {
                    id: "4",
                    orderNumber: "ORD-2024-004",
                    date: "2024-03-10",
                    status: "pending",
                    items: [{ id: 6, name: "GoPro 12", quantity: 1, price: 800, image: "🎥" }],
                    totalAmount: 800,
                    paymentMethod: "Net Banking",
                    shippingAddress: {
                        name: "John Doe",
                        address: "123 Main Street",
                        city: "Mumbai",
                        state: "Maharashtra",
                        pincode: "400001",
                        phone: "+91 98765 43210",
                    },
                },
            ];

            setOrders(demoOrders);
            localStorage.setItem("userOrders", JSON.stringify(demoOrders));
        }

        setLoading(false);
    }, []);

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "pending":
                return { bg: "rgba(255, 193, 7, 0.15)", text: "#FFC107", dot: "#FFC107" };
            case "processing":
                return { bg: "rgba(33, 150, 243, 0.15)", text: "#2196F3", dot: "#2196F3" };
            case "shipped":
                return { bg: "rgba(156, 39, 176, 0.15)", text: "#9C27B0", dot: "#9C27B0" };
            case "delivered":
                return { bg: "rgba(76, 175, 80, 0.15)", text: "#4CAF50", dot: "#4CAF50" };
            case "cancelled":
                return { bg: "rgba(244, 67, 54, 0.15)", text: "#F44336", dot: "#F44336" };
            default:
                return { bg: "rgba(158, 158, 158, 0.15)", text: "#9E9E9E", dot: "#9E9E9E" };
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusSteps = (currentStatus: Order["status"]) => {
        const steps = ["pending", "processing", "shipped", "delivered"];
        const currentIndex = steps.indexOf(currentStatus);

        return steps.map((step, index) => ({
            label: step.charAt(0).toUpperCase() + step.slice(1),
            completed: index <= currentIndex,
            active: index === currentIndex,
        }));
    };

    const formatCurrency = (amount: number) => {
        return `Rs. ${amount.toLocaleString("en-IN")}`;
    };

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
            if (y > 255) {
                doc.addPage();
                y = 20;
            }

            const rowHeight = 10;
            if (index % 2 === 0) {
                doc.setFillColor(248, 248, 248);
                doc.rect(margin, y - 5, pageWidth - margin * 2, rowHeight, "F");
            }

            doc.text(item.name, margin + 3, y + 1);
            doc.text(String(item.quantity), 118, y + 1);
            doc.text(formatCurrency(item.price), 137, y + 1);
            doc.text(formatCurrency(item.price * item.quantity), pageWidth - margin - 3, y + 1, {
                align: "right",
            });

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Services", href: "/service" },
        { label: "Projects", href: "/project" },
        { label: "Contact", href: "/contact" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0C0C" }}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#F2994A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "#0C0C0C", fontFamily: "'Inter', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .dashboard-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .dashboard-scroll::-webkit-scrollbar-track {
          background: rgba(155, 81, 224, 0.1);
          border-radius: 10px;
        }

        .dashboard-scroll::-webkit-scrollbar-thumb {
          background: rgba(155, 81, 224, 0.5);
          border-radius: 10px;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        @media (max-width: 768px) {
          .animate-slide-in {
            animation: slideInUp 0.3s ease-out;
          }

          @keyframes slideInUp {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        }
      `}</style>

            <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            to="/"
                            className="text-xl font-bold tracking-wider"
                            style={{
                                background: "linear-gradient(135deg, #9B51E0, #F2994A)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            CREWHOLIC
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => (
                                <Link key={item.label} to={item.href} className="text-sm text-gray-300 hover:text-[#F2994A] transition-colors">
                                    {item.label}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                                Logout
                            </button>
                        </div>

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl md:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex flex-col items-center justify-center h-full gap-6">
                        {navItems.map((item) => (
                            <Link key={item.label} to={item.href} onClick={() => setMobileMenuOpen(false)} className="text-xl text-white hover:text-[#F2994A] transition-colors">
                                {item.label}
                            </Link>
                        ))}
                        <button onClick={handleLogout} className="text-xl text-red-400 hover:text-red-300 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            )}

            <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
                    <p className="text-gray-400 mt-1">Member since {user?.memberSince}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
                            </div>
                            <div className="text-3xl">📦</div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Spent</p>
                                <p className="text-2xl font-bold text-white mt-1">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString("en-IN")}</p>
                            </div>
                            <div className="text-3xl">💰</div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Delivered</p>
                                <p className="text-2xl font-bold text-green-400 mt-1">{orders.filter((o) => o.status === "delivered").length}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">In Transit</p>
                                <p className="text-2xl font-bold text-orange-400 mt-1">{orders.filter((o) => o.status === "shipped" || o.status === "processing").length}</p>
                            </div>
                            <div className="text-3xl">🚚</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: "overview", label: "Overview", icon: "📊" },
                        { id: "orders", label: "My Orders", icon: "📋" },
                        { id: "profile", label: "Profile", icon: "👤" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as "overview" | "orders" | "profile")}
                            className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-[#9B51E0] to-[#F2994A] text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
                            <div className="space-y-3">
                                {orders.slice(0, 3).map((order) => {
                                    const statusColor = getStatusColor(order.status);
                                    return (
                                        <div key={order.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#F2994A]/30 transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-white font-medium">{order.orderNumber}</p>
                                                    <p className="text-gray-400 text-sm">{formatDate(order.date)}</p>
                                                </div>
                                                <div>
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: statusColor.bg, color: statusColor.text }}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-semibold">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                                                    <button onClick={() => { setSelectedOrder(order); setShowInvoiceModal(true); }} className="text-xs text-[#F2994A] hover:underline mt-1">
                                                        View Details →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {orders.length > 3 && (
                                <button onClick={() => setActiveTab("orders")} className="mt-4 text-[#F2994A] text-sm hover:underline">
                                    View all {orders.length} orders →
                                </button>
                            )}
                        </div>

                        <div className="bg-gradient-to-r from-[#9B51E0]/10 to-[#F2994A]/10 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <Link to="/service" className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                                    <div className="text-2xl mb-1">🛍️</div>
                                    <p className="text-white text-sm">Rent Equipment</p>
                                </Link>
                                <Link to="/contact" className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                                    <div className="text-2xl mb-1">💬</div>
                                    <p className="text-white text-sm">Contact Support</p>
                                </Link>
                                <button onClick={() => setActiveTab("profile")} className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                                    <div className="text-2xl mb-1">⚙️</div>
                                    <p className="text-white text-sm">Edit Profile</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-xl">
                                <div className="text-5xl mb-4">📦</div>
                                <p className="text-gray-400">No orders yet</p>
                                <Link to="/service" className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-[#9B51E0] to-[#F2994A] rounded-lg text-white">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            orders.map((order) => {
                                const statusColor = getStatusColor(order.status);
                                const statusSteps = getStatusSteps(order.status);

                                return (
                                    <div key={order.id} className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
                                        <div className="p-5 border-b border-white/10 bg-white/5">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-white font-semibold">{order.orderNumber}</p>
                                                    <p className="text-gray-400 text-sm">Placed on {formatDate(order.date)}</p>
                                                </div>
                                                <div>
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: statusColor.bg, color: statusColor.text }}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => downloadInvoicePDF(order)} className="text-sm text-[#F2994A] hover:underline flex items-center gap-1">
                                                        📄 Download Invoice
                                                    </button>
                                                    <button onClick={() => { setSelectedOrder(order); setShowInvoiceModal(true); }} className="text-sm text-[#9B51E0] hover:underline">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        <div className="text-3xl">{item.image}</div>
                                                        <div className="flex-1">
                                                            <p className="text-white font-medium">{item.name}</p>
                                                            <p className="text-gray-400 text-sm">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-white font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                                                <p className="text-gray-400">Total Amount</p>
                                                <p className="text-white font-bold text-lg">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>

                                        <div className="p-5 bg-white/5 border-t border-white/10">
                                            <p className="text-sm text-gray-400 mb-3">Order Status</p>
                                            <div className="flex items-center justify-between">
                                                {statusSteps.map((step, idx) => (
                                                    <div key={idx} className="flex-1 text-center">
                                                        <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${step.completed ? "bg-[#4CAF50]" : "bg-gray-600"}`} />
                                                        <p className={`text-xs ${step.completed ? "text-white" : "text-gray-500"}`}>{step.label}</p>
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

                {activeTab === "profile" && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#9B51E0] to-[#F2994A] flex items-center justify-center text-4xl">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                                <p className="text-gray-400">{user?.email}</p>
                                <p className="text-gray-400 text-sm">Member since {user?.memberSince}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-white font-semibold mb-3">Personal Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-gray-400 text-sm">Full Name</p>
                                        <p className="text-white">{user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Email Address</p>
                                        <p className="text-white">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Mobile Number</p>
                                        <p className="text-white">{user?.mobile}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-3">Account Statistics</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Orders</p>
                                        <p className="text-white text-2xl font-bold">{orders.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Spent</p>
                                        <p className="text-white text-2xl font-bold">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString("en-IN")}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Completed Orders</p>
                                        <p className="text-white text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <button onClick={handleLogout} className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors">
                                Logout Account
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showInvoiceModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowInvoiceModal(false)}>
                    <div className="bg-[#0C0C0C] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-[#0C0C0C] p-5 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Order Details</h2>
                            <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Order Number</p>
                                    <p className="text-white font-medium">{selectedOrder.orderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Order Date</p>
                                    <p className="text-white font-medium">{formatDate(selectedOrder.date)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Payment Method</p>
                                    <p className="text-white font-medium">{selectedOrder.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Order Status</p>
                                    <p className="text-white font-medium capitalize">{selectedOrder.status}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-3">Items Ordered</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10">
                                            <div>
                                                <p className="text-white">{item.name}</p>
                                                <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-white font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between">
                                    <p className="text-white font-semibold">Total</p>
                                    <p className="text-white font-bold text-lg">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-3">Shipping Address</h3>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <p className="text-white font-medium">{selectedOrder.shippingAddress.name}</p>
                                    <p className="text-gray-400 text-sm mt-1">{selectedOrder.shippingAddress.address}</p>
                                    <p className="text-gray-400 text-sm">
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                                </div>
                            </div>

                            <button onClick={() => downloadInvoicePDF(selectedOrder)} className="w-full py-3 bg-gradient-to-r from-[#9B51E0] to-[#F2994A] rounded-lg text-white font-semibold flex items-center justify-center gap-2">
                                📄 Download Filled Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
