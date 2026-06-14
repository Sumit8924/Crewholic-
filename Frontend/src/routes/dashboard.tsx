/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export const Route = createFileRoute("/dashboard")({
    component: UserDashboard,
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PAYMENT_CONFIG = {
    UPI_ID: "9337901038-2@ybl",
    UPI_NAME: "CREWHOLIC",
    ADVANCE_PERCENT: 30,
    FINAL_PERCENT: 70,
};

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: string;
    _id?: string;
    orderNumber: string;
    date: string;
    status: string;
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
    service?: string;
    quotedAmount?: number;

    // ── Advance Payment ──
    advancePaid?: boolean;
    advanceAmount?: number;
    advanceTxnId?: string;
    advancePaidAt?: string;
    advanceSubmittedAt?: string;
    advancePaymentStatus?: "not_submitted" | "pending_verification" | "verified" | "rejected";
    advanceVerified?: boolean;
    advanceVerifiedAt?: string;
    advanceRejected?: boolean;
    advanceRejectionReason?: string;

    // ── Final Payment ──
    finalPaid?: boolean;
    finalAmount?: number;
    finalTxnId?: string;
    finalPaidAt?: string;
    finalSubmittedAt?: string;
    finalPaymentStatus?: "not_submitted" | "pending_verification" | "verified" | "rejected";
    finalVerified?: boolean;
    finalVerifiedAt?: string;
    finalRejected?: boolean;
    finalRejectionReason?: string;

    workCompleted?: boolean;
    adminNotes?: string;
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

const getUserOrderKey = (user: User) =>
    `userOrders_${user._id || user.id || user.email}`;

const normalizeOrder = (o: any): Order => ({
    ...o,
    id: o._id || o.id || o.orderNumber,
    quotedAmount: o.quotedAmount || o.quoted_amount || 0,
    workCompleted: o.workCompleted || o.work_completed || false,

    // Advance
    advancePaid: o.advancePaid || o.advance_paid || false,
    advanceAmount: o.advanceAmount || o.advance_amount || 0,
    advanceTxnId: o.advanceTxnId || o.advance_txn_id || "",
    advancePaidAt: o.advancePaidAt || o.advance_paid_at || null,
    advanceSubmittedAt: o.advanceSubmittedAt || null,
    advancePaymentStatus: o.advancePaymentStatus || "not_submitted",
    advanceVerified: o.advanceVerified || false,
    advanceVerifiedAt: o.advanceVerifiedAt || null,
    advanceRejected: o.advanceRejected || false,
    advanceRejectionReason: o.advanceRejectionReason || "",

    // Final
    finalPaid: o.finalPaid || o.final_paid || false,
    finalAmount: o.finalAmount || o.final_amount || 0,
    finalTxnId: o.finalTxnId || o.final_txn_id || "",
    finalPaidAt: o.finalPaidAt || o.final_paid_at || null,
    finalSubmittedAt: o.finalSubmittedAt || null,
    finalPaymentStatus: o.finalPaymentStatus || "not_submitted",
    finalVerified: o.finalVerified || false,
    finalVerifiedAt: o.finalVerifiedAt || null,
    finalRejected: o.finalRejected || false,
    finalRejectionReason: o.finalRejectionReason || "",
});

const isApprovedWithPrice = (order: Order): boolean => {
    const approvedStatuses = [
        "approved",
        "processing",
        "Advance Paid",
        "Fully Paid",
        "shipped",
        "delivered",
        "completed",
        "work_completed",
    ];

    return approvedStatuses.includes(order.status) && !!order.quotedAmount && order.quotedAmount > 0;
};

function UserDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "orders" | "payments" | "profile">("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Profile edit state
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: "", email: "", mobile: "" });
    const [savingProfile, setSavingProfile] = useState(false);

    // Payment modal state
    const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
    const [paymentType, setPaymentType] = useState<"advance" | "final">("advance");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<"qr" | "confirm">("qr");
    const [txnId, setTxnId] = useState("");
    const [submittingPayment, setSubmittingPayment] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

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
                new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            mobile: parsedUser.mobile || "",
        };

        setUser(enrichedUser);
        setProfileForm({
            name: enrichedUser.name || "",
            email: enrichedUser.email || "",
            mobile: enrichedUser.mobile || "",
        });
        fetchUserOrders(enrichedUser, token);
        setLoading(false);
    }, []);

    // ── Auto-refresh every 10 seconds to pick up admin changes quickly ──
    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        const interval = setInterval(() => {
            fetchUserOrders(user, token, true);
        }, 10000);

        return () => clearInterval(interval);
    }, [user]);

    const fetchUserOrders = async (currentUser: User, token: string, silent = false) => {
        if (!silent) setOrdersLoading(true);
        else setRefreshing(true);

        const cacheKey = getUserOrderKey(currentUser);

        try {
            const res = await fetch(`${API_URL}/api/orders/my-orders?t=${Date.now()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });

            if (res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("role");
                localStorage.removeItem("permissions");
                navigate({ to: "/login" });
                return;
            }

            if (!res.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await res.json();
            const rawOrders: any[] = Array.isArray(data) ? data : data.orders || [];

            const fetchedOrders: Order[] = rawOrders.map(normalizeOrder);

            setOrders(fetchedOrders);
            localStorage.setItem(cacheKey, JSON.stringify(fetchedOrders));
        } catch (error) {
            console.error("Fetch orders error:", error);

            // Important: don't show old stale cache as fresh data
            const cached = localStorage.getItem(cacheKey);

            if (cached && orders.length === 0) {
                try {
                    setOrders(JSON.parse(cached));
                } catch {
                    setOrders([]);
                }
            }
        } finally {
            setOrdersLoading(false);
            setRefreshing(false);
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
            setOrders([]);
        }
    };

    const handleManualRefresh = async () => {
        if (!user) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        localStorage.removeItem(getUserOrderKey(user));
        await fetchUserOrders(user, token, true);

        showToast("Orders refreshed!", "success");
    };

    const openPaymentModal = (order: Order, type: "advance" | "final") => {
        setPaymentOrder(order);
        setPaymentType(type);
        setPaymentStep("qr");
        setTxnId("");
        setShowPaymentModal(true);
    };

    const calcPayment = (order: Order, type: "advance" | "final") => {
        const quoted = order.quotedAmount || 0;
        if (type === "advance") {
            return Math.round((quoted * PAYMENT_CONFIG.ADVANCE_PERCENT) / 100);
        }
        return quoted - (order.advanceAmount || Math.round((quoted * 30) / 100));
    };

    const getUpiLink = (order: Order, amount: number, type: "advance" | "final") => {
        const note = encodeURIComponent(`${type === "advance" ? "Advance" : "Final"} - ${order.orderNumber}`);
        return `upi://pay?pa=${PAYMENT_CONFIG.UPI_ID}&pn=${encodeURIComponent(PAYMENT_CONFIG.UPI_NAME)}&am=${amount}&cu=INR&tn=${note}`;
    };

    const getQrCodeUrl = (upiLink: string) =>
        `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}&bgcolor=ffffff&color=000000&margin=10`;

    const submitPayment = async () => {
        if (!paymentOrder || !user) return;
        if (txnId.trim().length < 6) {
            showToast("Please enter a valid transaction ID (min 6 chars)", "error");
            return;
        }

        setSubmittingPayment(true);
        const amount = calcPayment(paymentOrder, paymentType);
        const now = new Date().toISOString();

        const token = localStorage.getItem("token");
        let serverSuccess = false;

        try {
            const res = await fetch(`${API_URL}/api/orders/${paymentOrder.id}/payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: paymentType,
                    amount,
                    txnId: txnId.trim(),
                    paidAt: now,
                }),
            });
            if (res.ok) {
                serverSuccess = true;
                // Refresh from server to pick up the new state
                await fetchUserOrders(user, token!, true);
            }
        } catch { /* offline fallback */ }

        // Fallback: optimistic local update if server failed
        if (!serverSuccess) {
            const updatedOrders = orders.map(o => {
                if (o.id !== paymentOrder.id) return o;
                if (paymentType === "advance") {
                    return {
                        ...o,
                        advanceAmount: amount,
                        advanceTxnId: txnId.trim(),
                        advancePaidAt: now,
                        advanceSubmittedAt: now,
                        advancePaymentStatus: "pending_verification" as const,
                    };
                } else {
                    return {
                        ...o,
                        finalAmount: amount,
                        finalTxnId: txnId.trim(),
                        finalPaidAt: now,
                        finalSubmittedAt: now,
                        finalPaymentStatus: "pending_verification" as const,
                    };
                }
            });
            setOrders(updatedOrders);
            localStorage.setItem(getUserOrderKey(user), JSON.stringify(updatedOrders));
        }

        setSubmittingPayment(false);
        setShowPaymentModal(false);
        showToast(
            paymentType === "advance"
                ? "✅ Advance payment submitted! Admin will verify within 2-4 hours."
                : "🎉 Final payment submitted! Admin will verify shortly.",
            "success"
        );
    };

    // ── Profile save ──
    const saveProfile = async () => {
        if (!user) return;
        setSavingProfile(true);
        const token = localStorage.getItem("token");

        try {
            await fetch(`${API_URL}/api/auth/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: profileForm.name,
                    mobile: profileForm.mobile,
                }),
            });

            const updatedUser = {
                ...user,
                name: profileForm.name,
                mobile: profileForm.mobile,
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setEditingProfile(false);
            showToast("Profile updated successfully!", "success");
        } catch {
            const updatedUser = { ...user, name: profileForm.name, mobile: profileForm.mobile };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setEditingProfile(false);
            showToast("Profile saved locally!", "success");
        } finally {
            setSavingProfile(false);
        }
    };

    const getStatusColor = (status: string) => {
        const map: Record<string, { bg: string; text: string }> = {
            pending: { bg: "rgba(255,193,7,0.15)", text: "#FFC107" },
            approved: { bg: "rgba(76,175,80,0.15)", text: "#4CAF50" },
            processing: { bg: "rgba(33,150,243,0.15)", text: "#2196F3" },
            shipped: { bg: "rgba(156,39,176,0.15)", text: "#9C27B0" },
            delivered: { bg: "rgba(76,175,80,0.15)", text: "#4CAF50" },
            completed: { bg: "rgba(76,175,80,0.15)", text: "#4CAF50" },
            work_completed: { bg: "rgba(33,150,243,0.15)", text: "#2196F3" },
            cancelled: { bg: "rgba(244,67,54,0.15)", text: "#F44336" },
        };
        return map[status] || { bg: "rgba(158,158,158,0.15)", text: "#9E9E9E" };
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
        });

    const formatDateTime = (dateString: string) =>
        new Date(dateString).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString("en-IN")}`;

    // ── PAYMENT STATUS LOGIC (handles all verification states) ──
    const getPaymentStatus = (order: Order) => {
        if (order.status === "pending" && !order.quotedAmount) {
            return { label: "Awaiting Admin Approval", color: "#FFC107", canPay: false, stage: "waiting_approval" as const };
        }
        if (order.status === "cancelled") {
            return { label: "Cancelled", color: "#F44336", canPay: false, stage: "cancelled" as const };
        }
        if (!order.quotedAmount || order.quotedAmount === 0) {
            return { label: "Waiting for Quote", color: "#9C27B0", canPay: false, stage: "waiting_quote" as const };
        }

        // Advance rejected → user can re-pay
        if (order.advanceRejected) {
            return { label: `❌ Advance Rejected — Resubmit`, color: "#F44336", canPay: true, type: "advance" as const, stage: "advance_rejected" as const };
        }
        // Advance submitted, awaiting verification
        if (order.advancePaymentStatus === "pending_verification" && !order.advanceVerified) {
            return { label: "🔍 Advance Under Verification", color: "#FFA94D", canPay: false, stage: "advance_verifying" as const };
        }
        // No advance paid yet
        if (!order.advanceVerified && !order.advancePaid) {
            return { label: "Pay Advance (30%)", color: "#F2994A", canPay: true, type: "advance" as const, stage: "pay_advance" as const };
        }
        // Advance verified, work pending
        if ((order.advanceVerified || order.advancePaid) && !order.workCompleted && !order.finalPaid) {
            return { label: "✅ Advance Verified — Work In Progress", color: "#2196F3", canPay: false, stage: "in_progress" as const };
        }
        // Final rejected
        if (order.finalRejected) {
            return { label: `❌ Final Payment Rejected — Resubmit`, color: "#F44336", canPay: true, type: "final" as const, stage: "final_rejected" as const };
        }
        // Final submitted, awaiting verification
        if (order.finalPaymentStatus === "pending_verification" && !order.finalVerified) {
            return { label: "🔍 Final Payment Under Verification", color: "#FFA94D", canPay: false, stage: "final_verifying" as const };
        }
        // Work done, ready for final payment
        if (order.workCompleted && !order.finalVerified && !order.finalPaid) {
            return { label: "Pay Final (70%)", color: "#9B51E0", canPay: true, type: "final" as const, stage: "pay_final" as const };
        }
        if (order.finalVerified || order.finalPaid) {
            return { label: "✅ Fully Paid", color: "#4CAF50", canPay: false, stage: "completed" as const };
        }
        return { label: "—", color: "#9E9E9E", canPay: false, stage: "unknown" as const };
    };

    // ── NEW: Progress steps based on the full lifecycle ──
    const getStatusSteps = (order: Order) => {
        const steps = [
            {
                key: "submitted",
                label: "Order Placed",
                completed: true,
                active: false,
            },
            {
                key: "quoted",
                label: "Quote Received",
                completed: !!(order.quotedAmount && order.quotedAmount > 0),
                active: order.status === "pending" || !order.quotedAmount,
            },
            {
                key: "advance_submitted",
                label: "Advance Sent",
                completed:
                    order.advancePaymentStatus === "pending_verification" ||
                    order.advancePaymentStatus === "verified" ||
                    !!order.advanceVerified ||
                    !!order.advancePaid,
                active: order.advancePaymentStatus === "pending_verification",
            },
            {
                key: "advance_verified",
                label: "Advance Verified",
                completed: !!order.advanceVerified || !!order.advancePaid,
                active:
                    order.advancePaymentStatus === "pending_verification" &&
                    !order.advanceVerified,
            },
            {
                key: "work_done",
                label: "Work Done",
                completed: !!order.workCompleted,
                active: (!!order.advanceVerified || !!order.advancePaid) && !order.workCompleted,
            },
            {
                key: "final_paid",
                label: "Final Paid",
                completed: !!order.finalVerified || !!order.finalPaid,
                active: !!order.workCompleted && !order.finalVerified && !order.finalPaid,
            },
            {
                key: "completed",
                label: "Completed",
                completed: !!order.finalVerified,
                active: false,
            },
        ];

        // Mark the latest completed step as "active" if nothing else is active
        const anyActive = steps.some((s) => s.active);
        if (!anyActive) {
            for (let i = steps.length - 1; i >= 0; i--) {
                if (steps[i].completed) {
                    steps[i].active = true;
                    break;
                }
            }
        }

        return steps;
    };

    // ── Invoice PDF — only available when both payments done ──
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
        doc.text(`Quoted: ${formatCurrency(order.quotedAmount || 0)}`, 120, y);
        y += 6;
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`, margin, y);

        y += 18;
        doc.setFillColor(155, 81, 224);
        doc.rect(margin, y, pageWidth - margin * 2, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("ITEM / SERVICE", margin + 3, y + 6.5);
        doc.text("QUOTED PRICE", pageWidth - margin - 3, y + 6.5, { align: "right" });

        y += 12;
        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(order.service || order.items[0]?.name || "Service", margin + 3, y + 1);
        doc.text(formatCurrency(order.quotedAmount || 0), pageWidth - margin - 3, y + 1, { align: "right" });

        y += 14;
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Total Quoted Amount", margin, y);
        doc.text(formatCurrency(order.quotedAmount || 0), pageWidth - margin, y, { align: "right" });

        y += 14;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text("Payment Breakdown", margin, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        if (order.advancePaid || order.advanceVerified) {
            doc.text(`Advance (30%): ${formatCurrency(order.advanceAmount || 0)}`, margin, y);
            doc.text(`Txn: ${order.advanceTxnId}`, 100, y);
            doc.text(formatDate(order.advancePaidAt || ""), pageWidth - margin, y, { align: "right" });
            y += 6;
        }
        if (order.finalPaid || order.finalVerified) {
            doc.text(`Final (70%): ${formatCurrency(order.finalAmount || 0)}`, margin, y);
            doc.text(`Txn: ${order.finalTxnId}`, 100, y);
            doc.text(formatDate(order.finalPaidAt || ""), pageWidth - margin, y, { align: "right" });
            y += 6;
        }
        y += 4;
        const totalPaidAmt = (order.advanceAmount || 0) + (order.finalAmount || 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(`Total Paid: ${formatCurrency(totalPaidAmt)}`, margin, y);
        if (totalPaidAmt < (order.quotedAmount || 0)) {
            doc.setTextColor(200, 50, 50);
            doc.text(`Balance Due: ${formatCurrency((order.quotedAmount || 0) - totalPaidAmt)}`, pageWidth - margin, y, { align: "right" });
        } else {
            doc.setTextColor(50, 150, 50);
            doc.text(`PAID IN FULL`, pageWidth - margin, y, { align: "right" });
        }

        y += 16;
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

    const payableOrders = orders.filter(isApprovedWithPrice);
    const totalPaid = orders.reduce((s, o) => {
        let sum = 0;
        if (o.advanceVerified || o.advancePaid) sum += (o.advanceAmount || 0);
        if (o.finalVerified || o.finalPaid) sum += (o.finalAmount || 0);
        return s + sum;
    }, 0);
    const pendingPayments = payableOrders.filter(o => getPaymentStatus(o).canPay);
    const fullyPaidOrders = orders.filter(o => o.finalVerified || o.finalPaid);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C0C0C", fontFamily: "'Inter', sans-serif" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: 48, height: 48, border: "4px solid rgba(242,153,74,0.2)", borderTopColor: "#F2994A", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                    <p style={{ color: "#9aa4bf", fontSize: 14 }}>Loading dashboard...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    const EmptyOrders = () => (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
            <p style={{ color: "#FFFFFF", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>No orders yet</p>
            <p style={{ color: "#9aa4bf", fontSize: 14, marginBottom: 20 }}>Once you place an order it will appear here.</p>
            <Link to="/service" style={{ display: "inline-block", padding: "10px 24px", background: "linear-gradient(105deg,#9B51E0,#F2994A)", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Browse Services</Link>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#0C0C0C", fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                .db-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
                .db-scroll::-webkit-scrollbar-track { background: rgba(155,81,224,0.1); border-radius: 10px; }
                .db-scroll::-webkit-scrollbar-thumb { background: rgba(155,81,224,0.5); border-radius: 10px; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
                @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(242,153,74,0.4); } 50% { box-shadow: 0 0 0 8px rgba(242,153,74,0); } }
                .tab-panel { animation: fadeIn 0.25s ease; }
                .order-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; transition: border-color 0.2s; }
                .order-card:hover { border-color: rgba(242,153,74,0.3); }
                .stat-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); border-radius: 14px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); transition: border-color 0.2s, transform 0.2s; }
                .stat-card:hover { border-color: rgba(155,81,224,0.3); transform: translateY(-2px); }
                .nav-link { font-size: 13px; color: #9aa4bf; text-decoration: none; transition: color 0.2s; }
                .nav-link:hover { color: #F2994A; }
                .pay-btn-pulse { animation: pulseGlow 2s infinite; }
                .profile-input { width: 100%; padding: 10px 14px; background: #1A1A24; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; font-family: inherit; }
                .profile-input:focus { border-color: rgba(155,81,224,0.5); }
                .profile-input:disabled { opacity: 0.5; cursor: not-allowed; }
                @media (max-width: 640px) { 
                    .stats-grid { grid-template-columns: 1fr 1fr !important; }
                    .profile-grid { grid-template-columns: 1fr !important; }
                    .payment-cards { flex-direction: column !important; }
                }
            `}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", top: 80, right: 20, zIndex: 100,
                    background: toast.type === "success" ? "#4CAF50" : "#F44336",
                    color: "#fff", padding: "12px 20px", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    animation: "slideUp 0.3s ease", maxWidth: 320,
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Navbar */}
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link to="/" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.06em", textDecoration: "none", background: "linear-gradient(135deg,#9B51E0,#F2994A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CREWHOLIC</Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="desktop-nav">
                        {navItems.map((item) => (
                            <Link key={item.label} to={item.href as any} className="nav-link">{item.label}</Link>
                        ))}
                        <button onClick={handleLogout} style={{ fontSize: 13, color: "#F87171", background: "none", border: "none", cursor: "pointer" }}>Logout</button>
                    </div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", display: "none" }} className="mobile-menu-btn">
                        <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" /></svg>
                    </button>
                </div>
                <style>{`@media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: block !important; } }`}</style>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.96)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, animation: "fadeIn 0.2s ease" }} onClick={() => setMobileMenuOpen(false)}>
                    {navItems.map((item) => (
                        <Link key={item.label} to={item.href as any} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 22, color: "#fff", textDecoration: "none" }}>{item.label}</Link>
                    ))}
                    <button onClick={handleLogout} style={{ fontSize: 22, color: "#F87171", background: "none", border: "none", cursor: "pointer" }}>Logout</button>
                </div>
            )}

            {/* Main content */}
            <div style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1200, margin: "0 auto", padding: "80px 20px 60px" }}>

                {/* Header with refresh */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
                        <p style={{ color: "#9aa4bf", marginTop: 6, fontSize: 14 }}>Member since {user?.memberSince}</p>
                    </div>
                    <button
                        onClick={handleManualRefresh}
                        disabled={refreshing}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "8px 16px", background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                            color: "#9aa4bf", fontSize: 12, cursor: "pointer",
                        }}
                    >
                        <span style={{ display: "inline-block", animation: refreshing ? "spin 0.8s linear infinite" : "none" }}>🔄</span>
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* Pending payment alert */}
                {pendingPayments.length > 0 && (
                    <div style={{
                        background: "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(242,153,74,0.15))",
                        border: "1px solid rgba(76,175,80,0.4)",
                        borderRadius: 12, padding: "14px 18px", marginBottom: 20,
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 26 }}>✅</span>
                            <div>
                                <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                                    {pendingPayments.length} approved project{pendingPayments.length > 1 ? "s" : ""} ready for payment
                                </p>
                                <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>
                                    Admin has approved your project with pricing. Pay 30% to start work.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveTab("payments")}
                            className="pay-btn-pulse"
                            style={{ padding: "9px 20px", background: "linear-gradient(105deg,#4CAF50,#F2994A)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                        >
                            View Payment →
                        </button>
                    </div>
                )}

                {/* Stats */}
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
                    {[
                        { label: "Total Orders", value: orders.length, icon: "📦", valueColor: "#fff" },
                        { label: "Approved Projects", value: payableOrders.length, icon: "✅", valueColor: "#4CAF50" },
                        { label: "Total Paid", value: `₹${totalPaid.toLocaleString("en-IN")}`, icon: "💰", valueColor: "#F2994A" },
                        { label: "Pending Payments", value: pendingPayments.length, icon: "⏳", valueColor: "#9B51E0" },
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

                {/* Tabs */}
                <div style={{ display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 24, overflowX: "auto", paddingBottom: 2 }}>
                    {[
                        { id: "overview", label: "Overview", icon: "📊" },
                        { id: "orders", label: "My Orders", icon: "📋" },
                        { id: "payments", label: `Payments${pendingPayments.length > 0 ? ` (${pendingPayments.length})` : ""}`, icon: "💳" },
                        { id: "profile", label: "Profile", icon: "👤" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            style={{
                                padding: "9px 18px", borderRadius: 8, fontWeight: 500, fontSize: 13,
                                border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                                background: activeTab === tab.id ? "linear-gradient(105deg,#9B51E0,#F2994A)" : "transparent",
                                color: activeTab === tab.id ? "#fff" : "#9aa4bf", transition: "all 0.2s",
                            }}
                        >
                            <span>{tab.icon}</span>{tab.label}
                        </button>
                    ))}
                </div>

                {/* ════════ OVERVIEW TAB ════════ */}
                {activeTab === "overview" && (
                    <div className="tab-panel" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div>
                            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Recent Orders</h2>
                            {ordersLoading ? <OrdersSkeleton /> : orders.length === 0 ? <EmptyOrders /> : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {orders.slice(0, 3).map((order) => {
                                        const sc = getStatusColor(order.status);
                                        const ps = getPaymentStatus(order);
                                        return (
                                            <div key={order.id} className="order-card" style={{ padding: 16 }}>
                                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                                                    <div>
                                                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{order.orderNumber}</p>
                                                        <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>
                                                            {order.service || order.items[0]?.name} · {formatDate(order.date)}
                                                        </p>
                                                    </div>
                                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: sc.bg, color: sc.text }}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                    <div style={{ textAlign: "right" }}>
                                                        {order.quotedAmount ? (
                                                            <p style={{ color: "#4CAF50", fontWeight: 700 }}>₹{order.quotedAmount.toLocaleString("en-IN")}</p>
                                                        ) : (
                                                            <p style={{ color: "#9aa4bf", fontSize: 12, fontStyle: "italic" }}>Awaiting quote</p>
                                                        )}
                                                        <p style={{ fontSize: 11, color: ps.color, fontWeight: 600, marginTop: 2 }}>{ps.label}</p>
                                                    </div>
                                                    {ps.canPay && (
                                                        <button
                                                            onClick={() => openPaymentModal(order, ps.type!)}
                                                            className="pay-btn-pulse"
                                                            style={{ padding: "7px 14px", background: "linear-gradient(105deg,#4CAF50,#F2994A)", border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                                                        >
                                                            💳 Pay Now
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {orders.length > 3 && (
                                        <button onClick={() => setActiveTab("orders")} style={{ alignSelf: "flex-start", marginTop: 4, fontSize: 13, color: "#F2994A", background: "none", border: "none", cursor: "pointer" }}>
                                            View all {orders.length} orders →
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick actions */}
                        <div style={{ background: "linear-gradient(135deg, rgba(155,81,224,0.08), rgba(242,153,74,0.08))", borderRadius: 14, padding: 22, border: "1px solid rgba(255,255,255,0.07)" }}>
                            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Quick Actions</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                                {[
                                    { icon: "🛍️", label: "Rent Equipment", to: "/service" },
                                    { icon: "💬", label: "Contact Support", to: "/contact" },
                                ].map((a) => (
                                    <Link key={a.label} to={a.to as any} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 14, textAlign: "center", textDecoration: "none" }}>
                                        <div style={{ fontSize: 24, marginBottom: 4 }}>{a.icon}</div>
                                        <p style={{ color: "#fff", fontSize: 13 }}>{a.label}</p>
                                    </Link>
                                ))}
                                <button onClick={() => setActiveTab("profile")} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 14, textAlign: "center", border: "none", cursor: "pointer" }}>
                                    <div style={{ fontSize: 24, marginBottom: 4 }}>⚙️</div>
                                    <p style={{ color: "#fff", fontSize: 13 }}>Edit Profile</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════ ORDERS TAB ════════ */}
                {activeTab === "orders" && (
                    <div className="tab-panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {ordersLoading ? <OrdersSkeleton /> : orders.length === 0 ? <EmptyOrders /> : (
                            orders.map((order) => {
                                const sc = getStatusColor(order.status);
                                const ps = getPaymentStatus(order);
                                const steps = getStatusSteps(order);
                                const showPaymentSection = isApprovedWithPrice(order);
                                const showInvoice = order.finalVerified || order.finalPaid;
                                const completedSteps = steps.filter(s => s.completed).length;
                                const progressPct = Math.round((completedSteps / steps.length) * 100);

                                return (
                                    <div key={order.id} className="order-card">
                                        {/* Card header */}
                                        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                                            <div>
                                                <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{order.orderNumber}</p>
                                                <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>Placed on {formatDate(order.date)}</p>
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: sc.bg, color: sc.text }}>{order.status.toUpperCase()}</span>
                                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                                {showInvoice && (
                                                    <button
                                                        onClick={() => downloadInvoicePDF(order)}
                                                        style={{ fontSize: 12, color: "#F2994A", background: "rgba(242,153,74,0.1)", border: "1px solid rgba(242,153,74,0.3)", borderRadius: 6, cursor: "pointer", padding: "5px 10px" }}
                                                    >
                                                        📄 Invoice
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                                                    style={{ fontSize: 12, color: "#9B51E0", background: "rgba(155,81,224,0.1)", border: "1px solid rgba(155,81,224,0.3)", borderRadius: 6, cursor: "pointer", padding: "5px 10px" }}
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>

                                        {/* Service info */}
                                        <div style={{ padding: "14px 18px" }}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: idx < order.items.length - 1 ? 10 : 0 }}>
                                                    <span style={{ fontSize: 28 }}>{item.image}</span>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>{item.name}</p>
                                                        <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>{order.service || "Service Order"}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Quoted price block */}
                                            {order.quotedAmount ? (
                                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                                                    <div>
                                                        <p style={{ color: "#9aa4bf", fontSize: 11 }}>Admin Quoted Price</p>
                                                        {order.adminNotes && (
                                                            <p style={{ color: "#CE93D8", fontSize: 11, marginTop: 4 }}>💬 {order.adminNotes}</p>
                                                        )}
                                                    </div>
                                                    <p style={{ color: "#4CAF50", fontWeight: 700, fontSize: 22 }}>₹{order.quotedAmount.toLocaleString("en-IN")}</p>
                                                </div>
                                            ) : order.status !== "pending" && order.status !== "cancelled" ? (
                                                <div style={{ marginTop: 14, padding: 12, background: "rgba(156,39,176,0.1)", border: "1px solid rgba(156,39,176,0.3)", borderRadius: 8 }}>
                                                    <p style={{ color: "#CE93D8", fontSize: 12, fontWeight: 500 }}>
                                                        ⏳ Admin is preparing your project quote. You'll be notified when pricing is ready.
                                                    </p>
                                                </div>
                                            ) : null}

                                            {/* Pending message */}
                                            {order.status === "pending" && (
                                                <div style={{ marginTop: 14, padding: 12, background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: 8 }}>
                                                    <p style={{ color: "#FFC107", fontSize: 12, fontWeight: 500 }}>
                                                        🕐 Your order is under review by our team. You'll receive an update soon.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Payment section — only for approved + quoted orders */}
                                        {showPaymentSection && (
                                            <div style={{ padding: "14px 18px", background: "linear-gradient(135deg, rgba(76,175,80,0.05), rgba(155,81,224,0.05))", borderTop: "1px solid rgba(76,175,80,0.2)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                                    <span style={{ fontSize: 16 }}>✅</span>
                                                    <p style={{ color: "#4CAF50", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                                        Project Approved — Payment Required
                                                    </p>
                                                </div>

                                                <div className="payment-cards" style={{ display: "flex", alignItems: "stretch", gap: 8, marginBottom: 12 }}>
                                                    {/* ── Advance card ── */}
                                                    <div style={{
                                                        flex: 1, padding: "12px 14px",
                                                        background: (order.advanceVerified || order.advancePaid) ? "rgba(76,175,80,0.15)"
                                                            : order.advancePaymentStatus === "pending_verification" ? "rgba(255,169,77,0.1)"
                                                                : order.advanceRejected ? "rgba(244,67,54,0.1)"
                                                                    : "rgba(242,153,74,0.1)",
                                                        border: `1px solid ${(order.advanceVerified || order.advancePaid) ? "rgba(76,175,80,0.4)"
                                                            : order.advancePaymentStatus === "pending_verification" ? "rgba(255,169,77,0.4)"
                                                                : order.advanceRejected ? "rgba(244,67,54,0.4)"
                                                                    : "rgba(242,153,74,0.3)"}`,
                                                        borderRadius: 8,
                                                    }}>
                                                        <p style={{ color: "#9aa4bf", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>Advance (30%)</p>
                                                        <p style={{
                                                            color: (order.advanceVerified || order.advancePaid) ? "#4CAF50"
                                                                : order.advanceRejected ? "#F44336"
                                                                    : "#F2994A",
                                                            fontSize: 20, fontWeight: 700, marginTop: 4
                                                        }}>
                                                            ₹{calcPayment(order, "advance").toLocaleString("en-IN")}
                                                        </p>

                                                        {(order.advanceVerified || order.advancePaid) ? (
                                                            <>
                                                                <p style={{ color: "#4CAF50", fontSize: 11, marginTop: 4, fontWeight: 600 }}>✓ Verified by Admin</p>
                                                                {order.advanceVerifiedAt && <p style={{ color: "#9aa4bf", fontSize: 10 }}>{formatDateTime(order.advanceVerifiedAt)}</p>}
                                                                {order.advanceTxnId && <p style={{ color: "#9aa4bf", fontSize: 10, fontFamily: "monospace" }}>Txn: {order.advanceTxnId}</p>}
                                                            </>
                                                        ) : order.advancePaymentStatus === "pending_verification" ? (
                                                            <>
                                                                <p style={{ color: "#FFA94D", fontSize: 11, marginTop: 4, fontWeight: 600 }}>🔍 Under Verification</p>
                                                                <p style={{ color: "#9aa4bf", fontSize: 10 }}>Admin will verify within 2-4 hours</p>
                                                                {order.advanceTxnId && <p style={{ color: "#9aa4bf", fontSize: 10, fontFamily: "monospace" }}>Txn: {order.advanceTxnId}</p>}
                                                            </>
                                                        ) : order.advanceRejected ? (
                                                            <>
                                                                <p style={{ color: "#F44336", fontSize: 11, marginTop: 4, fontWeight: 600 }}>❌ Rejected</p>
                                                                {order.advanceRejectionReason && (
                                                                    <p style={{ color: "#FFA0A0", fontSize: 10, marginTop: 2 }}>{order.advanceRejectionReason}</p>
                                                                )}
                                                                <button
                                                                    onClick={() => openPaymentModal(order, "advance")}
                                                                    style={{ marginTop: 8, padding: "7px 14px", background: "#F44336", border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                                                                >
                                                                    Resubmit
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => openPaymentModal(order, "advance")}
                                                                className="pay-btn-pulse"
                                                                style={{ marginTop: 8, padding: "7px 14px", background: "linear-gradient(105deg,#F2994A,#9B51E0)", border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                                                            >
                                                                Pay Now
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* ── Final card ── */}
                                                    <div style={{
                                                        flex: 1, padding: "12px 14px",
                                                        background: (order.finalVerified || order.finalPaid) ? "rgba(76,175,80,0.15)"
                                                            : order.finalPaymentStatus === "pending_verification" ? "rgba(255,169,77,0.1)"
                                                                : order.finalRejected ? "rgba(244,67,54,0.1)"
                                                                    : "rgba(155,81,224,0.05)",
                                                        border: `1px solid ${(order.finalVerified || order.finalPaid) ? "rgba(76,175,80,0.4)"
                                                            : order.finalPaymentStatus === "pending_verification" ? "rgba(255,169,77,0.4)"
                                                                : order.finalRejected ? "rgba(244,67,54,0.4)"
                                                                    : "rgba(155,81,224,0.2)"}`,
                                                        borderRadius: 8,
                                                        opacity: (order.advanceVerified || order.advancePaid) ? 1 : 0.5,
                                                    }}>
                                                        <p style={{ color: "#9aa4bf", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>Final (70%)</p>
                                                        <p style={{
                                                            color: (order.finalVerified || order.finalPaid) ? "#4CAF50"
                                                                : order.finalRejected ? "#F44336"
                                                                    : "#9B51E0",
                                                            fontSize: 20, fontWeight: 700, marginTop: 4
                                                        }}>
                                                            ₹{calcPayment(order, "final").toLocaleString("en-IN")}
                                                        </p>

                                                        {(order.finalVerified || order.finalPaid) ? (
                                                            <>
                                                                <p style={{ color: "#4CAF50", fontSize: 11, marginTop: 4, fontWeight: 600 }}>✓ Verified by Admin</p>
                                                                {order.finalVerifiedAt && <p style={{ color: "#9aa4bf", fontSize: 10 }}>{formatDateTime(order.finalVerifiedAt)}</p>}
                                                                {order.finalTxnId && <p style={{ color: "#9aa4bf", fontSize: 10, fontFamily: "monospace" }}>Txn: {order.finalTxnId}</p>}
                                                            </>
                                                        ) : order.finalPaymentStatus === "pending_verification" ? (
                                                            <>
                                                                <p style={{ color: "#FFA94D", fontSize: 11, marginTop: 4, fontWeight: 600 }}>🔍 Under Verification</p>
                                                                <p style={{ color: "#9aa4bf", fontSize: 10 }}>Admin will verify shortly</p>
                                                                {order.finalTxnId && <p style={{ color: "#9aa4bf", fontSize: 10, fontFamily: "monospace" }}>Txn: {order.finalTxnId}</p>}
                                                            </>
                                                        ) : order.finalRejected ? (
                                                            <>
                                                                <p style={{ color: "#F44336", fontSize: 11, marginTop: 4, fontWeight: 600 }}>❌ Rejected</p>
                                                                {order.finalRejectionReason && (
                                                                    <p style={{ color: "#FFA0A0", fontSize: 10, marginTop: 2 }}>{order.finalRejectionReason}</p>
                                                                )}
                                                                <button
                                                                    onClick={() => openPaymentModal(order, "final")}
                                                                    style={{ marginTop: 8, padding: "7px 14px", background: "#F44336", border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                                                                >
                                                                    Resubmit
                                                                </button>
                                                            </>
                                                        ) : (order.advanceVerified || order.advancePaid) && order.workCompleted ? (
                                                            <button
                                                                onClick={() => openPaymentModal(order, "final")}
                                                                className="pay-btn-pulse"
                                                                style={{ marginTop: 8, padding: "7px 14px", background: "linear-gradient(105deg,#9B51E0,#F2994A)", border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                                                            >
                                                                Pay Final
                                                            </button>
                                                        ) : (order.advanceVerified || order.advancePaid) ? (
                                                            <p style={{ color: "#2196F3", fontSize: 10, marginTop: 6 }}>🔄 Awaiting work completion</p>
                                                        ) : (
                                                            <p style={{ color: "#9aa4bf", fontSize: 10, marginTop: 6 }}>Pay advance first</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Total summary */}
                                                <div style={{ background: "rgba(0,0,0,0.25)", padding: "8px 12px", borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span style={{ color: "#9aa4bf", fontSize: 11 }}>Total Project Cost:</span>
                                                    <div style={{ textAlign: "right" }}>
                                                        <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>₹{order.quotedAmount?.toLocaleString("en-IN")}</span>
                                                        {(order.finalVerified || order.finalPaid) && (
                                                            <span style={{ color: "#4CAF50", fontSize: 11, marginLeft: 8, fontWeight: 600 }}>• PAID IN FULL ✓</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Invoice download */}
                                                {showInvoice && (
                                                    <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.25)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div>
                                                            <p style={{ color: "#4CAF50", fontSize: 12, fontWeight: 600 }}>🎉 Project Fully Paid!</p>
                                                            <p style={{ color: "#9aa4bf", fontSize: 11, marginTop: 2 }}>Your invoice is ready to download.</p>
                                                        </div>
                                                        <button
                                                            onClick={() => downloadInvoicePDF(order)}
                                                            style={{ padding: "8px 16px", background: "linear-gradient(105deg,#4CAF50,#2E7D32)", border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                                                        >
                                                            📄 Download Invoice
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ════ NEW FULL-LIFECYCLE PROGRESS TRACKER ════ */}
                                        <div style={{ padding: "14px 18px 18px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                                <p style={{ color: "#9aa4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                                    Project Progress
                                                </p>
                                                <p style={{ color: progressPct === 100 ? "#4CAF50" : "#F2994A", fontSize: 11, fontWeight: 600 }}>
                                                    {progressPct}% Complete
                                                </p>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: 4 }} className="db-scroll">
                                                {steps.map((step, idx) => (
                                                    <div key={step.key} style={{ flex: "1 1 0", minWidth: 75, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                                                        {idx < steps.length - 1 && (
                                                            <div style={{
                                                                position: "absolute",
                                                                top: 8,
                                                                left: "50%",
                                                                width: "100%",
                                                                height: 2,
                                                                background: steps[idx + 1].completed || step.completed
                                                                    ? "#4CAF50"
                                                                    : "rgba(255,255,255,0.1)",
                                                                zIndex: 0,
                                                            }} />
                                                        )}
                                                        <div style={{
                                                            width: 18,
                                                            height: 18,
                                                            borderRadius: "50%",
                                                            zIndex: 1,
                                                            background: step.completed
                                                                ? "#4CAF50"
                                                                : step.active
                                                                    ? "#F2994A"
                                                                    : "rgba(255,255,255,0.1)",
                                                            border: step.active && !step.completed ? "2px solid #F2994A" : "none",
                                                            boxShadow: step.active && !step.completed ? "0 0 0 4px rgba(242,153,74,0.2)" : "none",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: 10,
                                                            color: "#fff",
                                                            fontWeight: 700,
                                                        }}>
                                                            {step.completed ? "✓" : ""}
                                                        </div>
                                                        <p style={{
                                                            fontSize: 9,
                                                            marginTop: 8,
                                                            color: step.completed ? "#fff" : step.active ? "#F2994A" : "#555",
                                                            textAlign: "center",
                                                            fontWeight: step.active ? 600 : 400,
                                                            lineHeight: 1.3,
                                                            maxWidth: 75,
                                                        }}>
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

                {/* ════════ PAYMENTS TAB ════════ */}
                {activeTab === "payments" && (
                    <div className="tab-panel">
                        <div style={{ marginBottom: 20 }}>
                            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>Payment Center</h2>
                            <p style={{ color: "#9aa4bf", fontSize: 13, marginTop: 4 }}>
                                Manage payments for approved projects. Pay 30% advance to start work, 70% after completion.
                            </p>
                        </div>

                        <div style={{ background: "rgba(33,150,243,0.08)", border: "1px solid rgba(33,150,243,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
                            <p style={{ color: "#64B5F6", fontSize: 12, lineHeight: 1.6 }}>
                                <strong>📋 How payments work:</strong> When admin approves your project, they set a price.
                                Pay <strong>30% advance</strong> to start work. After completion, pay remaining <strong>70%</strong> and download your invoice.
                            </p>
                        </div>

                        {payableOrders.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
                                <div style={{ fontSize: 52, marginBottom: 16 }}>⏳</div>
                                <p style={{ color: "#fff", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>No approved projects yet</p>
                                <p style={{ color: "#9aa4bf", fontSize: 14, maxWidth: 400, margin: "0 auto" }}>
                                    Payments appear here once admin approves your project with a price quote.
                                </p>
                                {orders.filter(o => o.status === "pending").length > 0 && (
                                    <p style={{ color: "#F2994A", fontSize: 12, marginTop: 12 }}>
                                        {orders.filter(o => o.status === "pending").length} order(s) pending admin review.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Action required */}
                                {pendingPayments.length > 0 && (
                                    <div style={{ marginBottom: 24 }}>
                                        <h3 style={{ color: "#F2994A", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                                            💳 Action Required ({pendingPayments.length})
                                        </h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            {pendingPayments.map(order => {
                                                const ps = getPaymentStatus(order);
                                                const amount = calcPayment(order, ps.type!);
                                                return (
                                                    <div key={order.id} className="order-card" style={{ padding: 18, border: "1px solid rgba(76,175,80,0.3)" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                                                            <div style={{ flex: 1, minWidth: 200 }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                                                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{order.orderNumber}</p>
                                                                    <span style={{ fontSize: 10, padding: "2px 6px", background: "rgba(76,175,80,0.2)", color: "#4CAF50", borderRadius: 4, fontWeight: 600 }}>APPROVED</span>
                                                                </div>
                                                                <p style={{ color: "#9aa4bf", fontSize: 12 }}>{order.service || order.items.map(i => i.name).join(", ")}</p>
                                                                <p style={{ color: ps.color, fontSize: 12, fontWeight: 600, marginTop: 6 }}>{ps.label}</p>
                                                                <p style={{ color: "#9aa4bf", fontSize: 11, marginTop: 4 }}>
                                                                    Project total: <span style={{ color: "#fff", fontWeight: 600 }}>₹{order.quotedAmount?.toLocaleString("en-IN")}</span>
                                                                </p>
                                                            </div>
                                                            <div style={{ textAlign: "right" }}>
                                                                <p style={{ color: "#9aa4bf", fontSize: 11 }}>Amount due now</p>
                                                                <p style={{ color: "#F2994A", fontSize: 26, fontWeight: 800 }}>₹{amount.toLocaleString("en-IN")}</p>
                                                                <p style={{ color: "#9aa4bf", fontSize: 10 }}>
                                                                    {ps.type === "advance" ? "30% advance" : "70% final"}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => openPaymentModal(order, ps.type!)}
                                                                className="pay-btn-pulse"
                                                                style={{ padding: "10px 22px", background: "linear-gradient(105deg,#4CAF50,#F2994A)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                                                            >
                                                                💳 Pay via UPI
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Under verification */}
                                {payableOrders.filter(o => o.advancePaymentStatus === "pending_verification" || o.finalPaymentStatus === "pending_verification").length > 0 && (
                                    <div style={{ marginBottom: 24 }}>
                                        <h3 style={{ color: "#FFA94D", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🔍 Under Verification</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {payableOrders.filter(o => o.advancePaymentStatus === "pending_verification" || o.finalPaymentStatus === "pending_verification").map(order => (
                                                <div key={order.id} className="order-card" style={{ padding: 14, border: "1px solid rgba(255,169,77,0.3)" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div>
                                                            <p style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</p>
                                                            <p style={{ color: "#9aa4bf", fontSize: 11, marginTop: 2 }}>{order.service}</p>
                                                            <p style={{ color: "#FFA94D", fontSize: 11, marginTop: 4, fontWeight: 600 }}>
                                                                🔍 Admin is verifying your {order.advancePaymentStatus === "pending_verification" ? "advance" : "final"} payment
                                                            </p>
                                                        </div>
                                                        <div style={{ textAlign: "right" }}>
                                                            <p style={{ color: "#9aa4bf", fontSize: 10, fontFamily: "monospace" }}>
                                                                Txn: {order.advancePaymentStatus === "pending_verification" ? order.advanceTxnId : order.finalTxnId}
                                                            </p>
                                                            <p style={{ color: "#9aa4bf", fontSize: 10, marginTop: 4 }}>Usually 2-4 hours</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Work in progress */}
                                {payableOrders.filter(o => (o.advanceVerified || o.advancePaid) && !o.finalPaid && !o.finalVerified && !o.workCompleted).length > 0 && (
                                    <div style={{ marginBottom: 24 }}>
                                        <h3 style={{ color: "#2196F3", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🔄 Work In Progress</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {payableOrders.filter(o => (o.advanceVerified || o.advancePaid) && !o.finalPaid && !o.finalVerified && !o.workCompleted).map(order => (
                                                <div key={order.id} className="order-card" style={{ padding: 14 }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div>
                                                            <p style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</p>
                                                            <p style={{ color: "#9aa4bf", fontSize: 11, marginTop: 2 }}>{order.service}</p>
                                                            <p style={{ color: "#4CAF50", fontSize: 11, marginTop: 4 }}>✓ Advance: ₹{order.advanceAmount?.toLocaleString("en-IN")}</p>
                                                        </div>
                                                        <div style={{ textAlign: "right" }}>
                                                            <p style={{ color: "#9aa4bf", fontSize: 10 }}>Pending final</p>
                                                            <p style={{ color: "#9B51E0", fontSize: 15, fontWeight: 700 }}>₹{calcPayment(order, "final").toLocaleString("en-IN")}</p>
                                                            <p style={{ color: "#9aa4bf", fontSize: 10 }}>awaiting completion</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Fully paid projects with invoice */}
                                {fullyPaidOrders.length > 0 && (
                                    <div style={{ marginBottom: 24 }}>
                                        <h3 style={{ color: "#4CAF50", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🎉 Completed & Paid</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                            {fullyPaidOrders.map(order => (
                                                <div key={order.id} className="order-card" style={{ padding: 14, border: "1px solid rgba(76,175,80,0.25)" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div>
                                                            <p style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</p>
                                                            <p style={{ color: "#9aa4bf", fontSize: 11, marginTop: 2 }}>{order.service}</p>
                                                            <p style={{ color: "#4CAF50", fontSize: 11, marginTop: 4, fontWeight: 600 }}>✓ Fully Paid — ₹{order.quotedAmount?.toLocaleString("en-IN")}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => downloadInvoicePDF(order)}
                                                            style={{ padding: "8px 16px", background: "linear-gradient(105deg,#4CAF50,#2E7D32)", border: "none", borderRadius: 6, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                                                        >
                                                            📄 Invoice
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Payment history table */}
                                <div>
                                    <h3 style={{ color: "#9aa4bf", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📋 Payment History</h3>
                                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead style={{ background: "rgba(0,0,0,0.3)" }}>
                                                <tr>
                                                    {["Order", "Type", "Amount", "Txn ID", "Status", "Date"].map(h => (
                                                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "#9aa4bf", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.filter(o => o.advanceTxnId || o.finalTxnId).flatMap(o => {
                                                    const rows: any[] = [];
                                                    if (o.advanceTxnId) rows.push({
                                                        order: o, type: "Advance (30%)", amount: o.advanceAmount, txn: o.advanceTxnId,
                                                        date: o.advancePaidAt,
                                                        status: o.advanceVerified ? "Verified" : o.advanceRejected ? "Rejected" : "Pending",
                                                    });
                                                    if (o.finalTxnId) rows.push({
                                                        order: o, type: "Final (70%)", amount: o.finalAmount, txn: o.finalTxnId,
                                                        date: o.finalPaidAt,
                                                        status: o.finalVerified ? "Verified" : o.finalRejected ? "Rejected" : "Pending",
                                                    });
                                                    return rows;
                                                }).map((row, i) => (
                                                    <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                                        <td style={{ padding: "12px 14px", fontSize: 12, color: "#fff" }}>{row.order.orderNumber}</td>
                                                        <td style={{ padding: "12px 14px", fontSize: 12, color: "#9aa4bf" }}>{row.type}</td>
                                                        <td style={{ padding: "12px 14px", fontSize: 12, color: "#4CAF50", fontWeight: 600 }}>₹{row.amount?.toLocaleString("en-IN")}</td>
                                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#9aa4bf", fontFamily: "monospace" }}>{row.txn}</td>
                                                        <td style={{ padding: "12px 14px", fontSize: 11 }}>
                                                            <span style={{
                                                                padding: "3px 8px", borderRadius: 4, fontWeight: 600,
                                                                background: row.status === "Verified" ? "rgba(76,175,80,0.15)"
                                                                    : row.status === "Rejected" ? "rgba(244,67,54,0.15)"
                                                                        : "rgba(255,193,7,0.15)",
                                                                color: row.status === "Verified" ? "#4CAF50"
                                                                    : row.status === "Rejected" ? "#F44336"
                                                                        : "#FFC107",
                                                            }}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#9aa4bf" }}>{row.date ? formatDateTime(row.date) : "—"}</td>
                                                    </tr>
                                                ))}
                                                {orders.filter(o => o.advanceTxnId || o.finalTxnId).length === 0 && (
                                                    <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "#555", fontSize: 13 }}>No payments recorded yet</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ════════ PROFILE TAB ════════ */}
                {activeTab === "profile" && (
                    <div className="tab-panel">
                        {/* Profile header card */}
                        <div style={{ background: "linear-gradient(135deg, rgba(155,81,224,0.12), rgba(242,153,74,0.08))", borderRadius: 16, padding: 28, border: "1px solid rgba(155,81,224,0.2)", marginBottom: 20 }}>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#9B51E0,#F2994A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, color: "#fff", flexShrink: 0, border: "3px solid rgba(255,255,255,0.1)" }}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>{user?.name}</h2>
                                    <p style={{ color: "#9aa4bf", fontSize: 13, marginTop: 4 }}>✉️ {user?.email}</p>
                                    {user?.mobile && <p style={{ color: "#9aa4bf", fontSize: 13, marginTop: 2 }}>📱 {user?.mobile}</p>}
                                    <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 4 }}>📅 Member since {user?.memberSince}</p>
                                </div>
                                <button
                                    onClick={() => setEditingProfile(!editingProfile)}
                                    style={{
                                        padding: "9px 20px",
                                        background: editingProfile ? "rgba(244,67,54,0.1)" : "rgba(155,81,224,0.15)",
                                        border: `1px solid ${editingProfile ? "rgba(244,67,54,0.3)" : "rgba(155,81,224,0.3)"}`,
                                        borderRadius: 8, color: editingProfile ? "#F87171" : "#9B51E0",
                                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                                    }}
                                >
                                    {editingProfile ? "✕ Cancel" : "✏️ Edit Profile"}
                                </button>
                            </div>
                        </div>

                        <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            {/* Personal info */}
                            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 22, border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 18, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span>👤</span> Personal Information
                                </h3>

                                {editingProfile ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                        <div>
                                            <label style={{ color: "#9aa4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Full Name</label>
                                            <input
                                                className="profile-input"
                                                type="text"
                                                value={profileForm.name}
                                                onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ color: "#9aa4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Email Address</label>
                                            <input
                                                className="profile-input"
                                                type="email"
                                                value={profileForm.email}
                                                disabled
                                                style={{ opacity: 0.5 }}
                                                placeholder="Email (cannot change)"
                                            />
                                            <p style={{ color: "#9aa4bf", fontSize: 10, marginTop: 4 }}>Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label style={{ color: "#9aa4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Mobile Number</label>
                                            <input
                                                className="profile-input"
                                                type="tel"
                                                value={profileForm.mobile}
                                                onChange={e => setProfileForm(f => ({ ...f, mobile: e.target.value }))}
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>
                                        <button
                                            onClick={saveProfile}
                                            disabled={savingProfile}
                                            style={{
                                                padding: "11px", background: savingProfile ? "rgba(155,81,224,0.3)" : "linear-gradient(105deg,#9B51E0,#F2994A)",
                                                border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600,
                                                cursor: savingProfile ? "not-allowed" : "pointer", marginTop: 4,
                                            }}
                                        >
                                            {savingProfile ? "Saving..." : "💾 Save Changes"}
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {[
                                            { label: "Full Name", value: user?.name, icon: "👤" },
                                            { label: "Email Address", value: user?.email, icon: "✉️" },
                                            { label: "Mobile Number", value: user?.mobile || "Not set", icon: "📱" },
                                            { label: "Member Since", value: user?.memberSince, icon: "📅" },
                                        ].map((f) => (
                                            <div key={f.label} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                                                <p style={{ color: "#9aa4bf", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{f.icon} {f.label}</p>
                                                <p style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{f.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Account stats */}
                            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 22, border: "1px solid rgba(255,255,255,0.08)" }}>
                                <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 18, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span>📊</span> Account Statistics
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {[
                                        { label: "Total Orders", value: orders.length, icon: "📦", color: "#fff" },
                                        { label: "Approved Projects", value: payableOrders.length, icon: "✅", color: "#4CAF50" },
                                        { label: "Work In Progress", value: payableOrders.filter(o => (o.advanceVerified || o.advancePaid) && !(o.finalVerified || o.finalPaid)).length, icon: "🔄", color: "#2196F3" },
                                        { label: "Completed Projects", value: fullyPaidOrders.length, icon: "🎉", color: "#9B51E0" },
                                        { label: "Total Amount Paid", value: `₹${totalPaid.toLocaleString("en-IN")}`, icon: "💰", color: "#F2994A" },
                                    ].map((s) => (
                                        <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 18 }}>{s.icon}</span>
                                                <p style={{ color: "#9aa4bf", fontSize: 12 }}>{s.label}</p>
                                            </div>
                                            <p style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Security / Danger zone */}
                        <div style={{ background: "rgba(244,67,54,0.05)", borderRadius: 14, padding: 22, border: "1px solid rgba(244,67,54,0.15)" }}>
                            <h3 style={{ color: "#F87171", fontWeight: 600, marginBottom: 14, fontSize: 15 }}>⚠️ Account Actions</h3>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <button
                                    onClick={handleLogout}
                                    style={{ padding: "9px 22px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.35)", borderRadius: 8, color: "#F87171", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                                >
                                    🚪 Logout Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ════════ PAYMENT MODAL ════════ */}
            {showPaymentModal && paymentOrder && (
                <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={() => !submittingPayment && setShowPaymentModal(false)}>
                    <div style={{ background: "#0E0E14", borderRadius: 16, maxWidth: 460, width: "100%", maxHeight: "92vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.1)", animation: "slideUp 0.25s ease" }} className="db-scroll" onClick={e => e.stopPropagation()}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0 }}>
                                    {paymentType === "advance" ? "Pay Advance (30%)" : "Pay Final Amount (70%)"}
                                </h2>
                                <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>{paymentOrder.orderNumber}</p>
                            </div>
                            <button onClick={() => !submittingPayment && setShowPaymentModal(false)} style={{ background: "none", border: "none", color: "#9aa4bf", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
                        </div>

                        <div style={{ padding: 20 }}>
                            {paymentStep === "qr" ? (
                                <>
                                    <div style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.25)", borderRadius: 8, padding: 10, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#9aa4bf", fontSize: 11 }}>Project Total:</span>
                                        <span style={{ color: "#4CAF50", fontSize: 13, fontWeight: 700 }}>₹{paymentOrder.quotedAmount?.toLocaleString("en-IN")}</span>
                                    </div>

                                    <div style={{ background: "linear-gradient(135deg, rgba(242,153,74,0.15), rgba(155,81,224,0.15))", border: "1px solid rgba(242,153,74,0.3)", borderRadius: 12, padding: 18, marginBottom: 20, textAlign: "center" }}>
                                        <p style={{ color: "#9aa4bf", fontSize: 12, marginBottom: 6 }}>You are paying</p>
                                        <p style={{ color: "#fff", fontSize: 36, fontWeight: 800 }}>₹{calcPayment(paymentOrder, paymentType).toLocaleString("en-IN")}</p>
                                        <p style={{ color: "#9aa4bf", fontSize: 11, marginTop: 6 }}>
                                            {paymentType === "advance"
                                                ? `30% advance of ₹${paymentOrder.quotedAmount?.toLocaleString("en-IN")}`
                                                : `Remaining balance of project`}
                                        </p>
                                    </div>

                                    <div style={{ background: "#fff", padding: 16, borderRadius: 12, textAlign: "center", marginBottom: 16 }}>
                                        <img
                                            src={getQrCodeUrl(getUpiLink(paymentOrder, calcPayment(paymentOrder, paymentType), paymentType))}
                                            alt="UPI QR Code"
                                            style={{ width: 220, height: 220, margin: "0 auto", display: "block" }}
                                        />
                                        <p style={{ color: "#333", fontSize: 11, marginTop: 8, fontWeight: 600 }}>Scan with any UPI app</p>
                                    </div>

                                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 14, marginBottom: 16 }}>
                                        <p style={{ color: "#9aa4bf", fontSize: 11, marginBottom: 4 }}>Or pay to UPI ID:</p>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                            <p style={{ color: "#F2994A", fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{PAYMENT_CONFIG.UPI_ID}</p>
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(PAYMENT_CONFIG.UPI_ID); showToast("UPI ID copied!", "success"); }}
                                                style={{ padding: "5px 12px", background: "rgba(242,153,74,0.15)", border: "1px solid rgba(242,153,74,0.4)", borderRadius: 6, color: "#F2994A", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                                        <a
                                            href={getUpiLink(paymentOrder, calcPayment(paymentOrder, paymentType), paymentType)}
                                            style={{ padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, textAlign: "center", textDecoration: "none" }}
                                        >
                                            📱 Open UPI App
                                        </a>
                                        <button
                                            onClick={() => setPaymentStep("confirm")}
                                            style={{ padding: "10px", background: "linear-gradient(105deg,#9B51E0,#F2994A)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                                        >
                                            ✓ I've Paid →
                                        </button>
                                    </div>

                                    <div style={{ padding: 12, background: "rgba(33,150,243,0.08)", border: "1px solid rgba(33,150,243,0.2)", borderRadius: 8 }}>
                                        <p style={{ color: "#64B5F6", fontSize: 11, lineHeight: 1.5 }}>
                                            💡 Scan QR or use UPI ID to pay. After payment, click "I've Paid" and enter your transaction ID.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                                        <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
                                        <p style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Confirm Your Payment</p>
                                        <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 4 }}>Enter the UPI transaction ID from your payment app</p>
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ color: "#9aa4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
                                            UPI Transaction ID / Reference No
                                        </label>
                                        <input
                                            type="text"
                                            value={txnId}
                                            onChange={e => setTxnId(e.target.value)}
                                            placeholder="e.g. 412345678901"
                                            style={{ width: "100%", padding: "12px 14px", background: "#1A1A24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
                                        />
                                        <p style={{ color: "#9aa4bf", fontSize: 10, marginTop: 4 }}>Find this in your UPI app's transaction history</p>
                                    </div>

                                    <div style={{ background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.25)", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ color: "#9aa4bf", fontSize: 12 }}>Amount:</span>
                                            <span style={{ color: "#4CAF50", fontSize: 14, fontWeight: 700 }}>₹{calcPayment(paymentOrder, paymentType).toLocaleString("en-IN")}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                            <span style={{ color: "#9aa4bf", fontSize: 12 }}>To UPI:</span>
                                            <span style={{ color: "#fff", fontSize: 12, fontFamily: "monospace" }}>{PAYMENT_CONFIG.UPI_ID}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: 10 }}>
                                        <button
                                            onClick={() => setPaymentStep("qr")}
                                            disabled={submittingPayment}
                                            style={{ padding: "11px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#9aa4bf", fontSize: 13, cursor: "pointer" }}
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            onClick={submitPayment}
                                            disabled={submittingPayment || txnId.trim().length < 6}
                                            style={{
                                                flex: 1, padding: "11px",
                                                background: txnId.trim().length >= 6 ? "linear-gradient(105deg,#4CAF50,#2E7D32)" : "rgba(76,175,80,0.3)",
                                                border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600,
                                                cursor: txnId.trim().length >= 6 && !submittingPayment ? "pointer" : "not-allowed",
                                                opacity: submittingPayment ? 0.6 : 1,
                                            }}
                                        >
                                            {submittingPayment ? "Submitting…" : "Confirm Payment ✓"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ════════ ORDER DETAIL MODAL ════════ */}
            {showOrderModal && selectedOrder && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={() => setShowOrderModal(false)}>
                    <div style={{ background: "#0E0E14", borderRadius: 16, maxWidth: 580, width: "100%", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.1)", animation: "slideUp 0.25s ease" }} className="db-scroll" onClick={e => e.stopPropagation()}>
                        <div style={{ position: "sticky", top: 0, background: "#0E0E14", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0 }}>Order Details</h2>
                                <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>{selectedOrder.orderNumber}</p>
                            </div>
                            <button onClick={() => setShowOrderModal(false)} style={{ background: "none", border: "none", color: "#9aa4bf", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
                        </div>

                        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
                            {/* Basic info */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                {[
                                    { label: "Order Number", value: selectedOrder.orderNumber },
                                    { label: "Order Date", value: formatDate(selectedOrder.date) },
                                    { label: "Service", value: selectedOrder.service || "—" },
                                    { label: "Status", value: selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) },
                                ].map(f => (
                                    <div key={f.label} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                                        <p style={{ color: "#9aa4bf", fontSize: 11, marginBottom: 4 }}>{f.label}</p>
                                        <p style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>{f.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quoted price */}
                            {selectedOrder.quotedAmount ? (
                                <div style={{ background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)", borderRadius: 10, padding: 14 }}>
                                    <p style={{ color: "#9aa4bf", fontSize: 11, marginBottom: 4 }}>Admin Quoted Price</p>
                                    <p style={{ color: "#4CAF50", fontSize: 26, fontWeight: 800 }}>₹{selectedOrder.quotedAmount.toLocaleString("en-IN")}</p>
                                    {selectedOrder.adminNotes && (
                                        <p style={{ color: "#CE93D8", fontSize: 12, marginTop: 6 }}>💬 {selectedOrder.adminNotes}</p>
                                    )}
                                </div>
                            ) : (
                                <div style={{ padding: 12, background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 8 }}>
                                    <p style={{ color: "#FFC107", fontSize: 12 }}>⏳ Quote not yet provided by admin</p>
                                </div>
                            )}

                            {/* Payment history in modal */}
                            {(selectedOrder.advanceTxnId || selectedOrder.finalTxnId) && (
                                <div>
                                    <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Payment Records</h3>
                                    <div style={{ background: "rgba(76,175,80,0.05)", borderRadius: 10, padding: 12, border: "1px solid rgba(76,175,80,0.2)", display: "flex", flexDirection: "column", gap: 8 }}>
                                        {selectedOrder.advanceTxnId && (
                                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: selectedOrder.finalTxnId ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                                                <div>
                                                    <p style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
                                                        Advance (30%)
                                                        <span style={{
                                                            marginLeft: 8, fontSize: 10, padding: "2px 6px", borderRadius: 4,
                                                            background: selectedOrder.advanceVerified ? "rgba(76,175,80,0.15)"
                                                                : selectedOrder.advanceRejected ? "rgba(244,67,54,0.15)"
                                                                    : "rgba(255,193,7,0.15)",
                                                            color: selectedOrder.advanceVerified ? "#4CAF50"
                                                                : selectedOrder.advanceRejected ? "#F44336"
                                                                    : "#FFC107",
                                                        }}>
                                                            {selectedOrder.advanceVerified ? "Verified" : selectedOrder.advanceRejected ? "Rejected" : "Pending"}
                                                        </span>
                                                    </p>
                                                    <p style={{ color: "#9aa4bf", fontSize: 10, fontFamily: "monospace", marginTop: 2 }}>Txn: {selectedOrder.advanceTxnId}</p>
                                                    {selectedOrder.advancePaidAt && <p style={{ color: "#9aa4bf", fontSize: 10 }}>{formatDateTime(selectedOrder.advancePaidAt)}</p>}
                                                </div>
                                                <p style={{ color: "#4CAF50", fontWeight: 700, fontSize: 16 }}>₹{(selectedOrder.advanceAmount || 0).toLocaleString("en-IN")}</p>
                                            </div>
                                        )}
                                        {selectedOrder.finalTxnId && (
                                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                                                <div>
                                                    <p style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
                                                        Final (70%)
                                                        <span style={{
                                                            marginLeft: 8, fontSize: 10, padding: "2px 6px", borderRadius: 4,
                                                            background: selectedOrder.finalVerified ? "rgba(76,175,80,0.15)"
                                                                : selectedOrder.finalRejected ? "rgba(244,67,54,0.15)"
                                                                    : "rgba(255,193,7,0.15)",
                                                            color: selectedOrder.finalVerified ? "#4CAF50"
                                                                : selectedOrder.finalRejected ? "#F44336"
                                                                    : "#FFC107",
                                                        }}>
                                                            {selectedOrder.finalVerified ? "Verified" : selectedOrder.finalRejected ? "Rejected" : "Pending"}
                                                        </span>
                                                    </p>
                                                    <p style={{ color: "#9aa4bf", fontSize: 10, fontFamily: "monospace", marginTop: 2 }}>Txn: {selectedOrder.finalTxnId}</p>
                                                    {selectedOrder.finalPaidAt && <p style={{ color: "#9aa4bf", fontSize: 10 }}>{formatDateTime(selectedOrder.finalPaidAt)}</p>}
                                                </div>
                                                <p style={{ color: "#4CAF50", fontWeight: 700, fontSize: 16 }}>₹{(selectedOrder.finalAmount || 0).toLocaleString("en-IN")}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Contact details */}
                            <div>
                                <h3 style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Contact Details</h3>
                                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px" }}>
                                    <p style={{ color: "#fff", fontWeight: 500 }}>{selectedOrder.shippingAddress?.name}</p>
                                    <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 4 }}>📞 {selectedOrder.shippingAddress?.phone}</p>
                                    {selectedOrder.shippingAddress?.address && (
                                        <p style={{ color: "#9aa4bf", fontSize: 12, marginTop: 2 }}>
                                            📍 {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Invoice download — only after full payment verified */}
                            {(selectedOrder.finalVerified || selectedOrder.finalPaid) && (
                                <button
                                    onClick={() => downloadInvoicePDF(selectedOrder)}
                                    style={{ width: "100%", padding: "12px 0", background: "linear-gradient(105deg,#4CAF50,#2E7D32)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                                >
                                    📄 Download Invoice PDF
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function OrdersSkeleton() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: 80, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
            ))}
        </div>
    );
}

export default UserDashboard;