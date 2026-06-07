/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";

export const Route = createFileRoute("/rental")({
    component: RentalPanel,
});

const ACCENT = "#4ECDC4";
const ACCENT2 = "#0097FF";

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface RentalOrder {
    _id?: string;
    id?: string;
    name: string;
    mobile: string;
    email: string;
    productId: number;
    productName: string;
    categoryName: string;
    pricePerDay: number;
    rentalDays: number;
    totalPrice: number;
    requirements?: string;
    status?: "pending" | "confirmed" | "active" | "completed" | "cancelled"
           | "Pending" | "Confirmed" | "Active" | "Returned" | "Cancelled";
    createdAt?: string;
    updatedAt?: string;
}

interface ServiceInquiry {
    _id?: string;
    id?: string;
    name: string;
    mobile: string;
    email: string;
    service: string;
    timeline: string;
    requirements?: string;
    status?: "Pending" | "Contacted" | "Closed";
    createdAt?: string;
}

// ─── RENTAL CATALOG ──────────────────────────────────────────────────────────
const RENTAL_CATALOG = [
    {
        category: "Cameras",
        items: [
            { id: 1,  name: "Canon EOS 200d mark2",  price: 700,  originalPrice: 1200, specs: "24.1MP, 4K Video" },
            { id: 2,  name: "Canon EOS 200d",         price: 600,  originalPrice: 1000, specs: "24.2MP, Full HD" },
            { id: 3,  name: "Canon m50",              price: 1500, originalPrice: 2500, specs: "24.1MP, 4K, Mirrorless" },
            { id: 4,  name: "Sony alpha 7 mark 3",    price: 2500, originalPrice: 4000, specs: "24.2MP, Full Frame, 4K" },
            { id: 5,  name: "Sony alpha 7 mark 4",    price: 3000, originalPrice: 5000, specs: "33MP, Full Frame, 4K 60fps" },
            { id: 6,  name: "Sony zv e10",            price: 2000, originalPrice: 3500, specs: "24.2MP, 4K, Vlogging" },
            { id: 7,  name: "Sony fx3",               price: 3500, originalPrice: 5500, specs: "10.2MP, 4K 120fps, Cinema" },
            { id: 8,  name: "Sony nx100",             price: 1500, originalPrice: 2800, specs: "Camcorder, 4K" },
            { id: 9,  name: "Insta 360 x3",           price: 1000, originalPrice: 1800, specs: "5.7K, 360° Camera" },
            { id: 10, name: "GoPro 12",               price: 800,  originalPrice: 1500, specs: "5.3K, Action Camera" },
        ],
    },
    {
        category: "Gimbals & Stabilizers",
        items: [
            { id: 11, name: "DJI RS Mini",        price: 1000, originalPrice: 1800, specs: "Compact, Lightweight" },
            { id: 12, name: "DJI RS4",            price: 1500, originalPrice: 2500, specs: "Professional, Payload 3kg" },
            { id: 13, name: "DJI Mobile Gimbal",  price: 400,  originalPrice: 800,  specs: "For Smartphones" },
        ],
    },
    {
        category: "Drones",
        items: [
            { id: 14, name: "DJI Mini 4 Pro", price: 2500, originalPrice: 4500, specs: "4K HDR, 45min Flight" },
            { id: 15, name: "DJI Air 3S",     price: 2500, originalPrice: 4200, specs: "Dual Camera, 4K" },
            { id: 16, name: "DJI Neo 2",      price: 2000, originalPrice: 3500, specs: "Compact, 4K" },
        ],
    },
];

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
    { id: "dashboard",  label: "Dashboard",          icon: "▦" },
    { id: "orders",     label: "Rental Orders",      icon: "◈" },
    { id: "catalog",    label: "Equipment Catalog",  icon: "▦" },
    { id: "customers",  label: "Customers",          icon: "◑" },
    { id: "inquiries",  label: "Service Inquiries",  icon: "◉" },
    { id: "reports",    label: "Reports",            icon: "◆" },
];

// ─── STATUS COLORS ───────────────────────────────────────────────────────────
const statusColor: Record<string, { bg: string; text: string }> = {
    // Uppercase
    Pending:   { bg: "rgba(255,165,61,0.12)",  text: "#FFA94D" },
    Confirmed: { bg: "rgba(0,151,255,0.12)",   text: "#0097FF" },
    Active:    { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
    Returned:  { bg: "rgba(136,136,170,0.12)", text: "#888899" },
    Cancelled: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    Contacted: { bg: "rgba(0,151,255,0.12)",   text: "#0097FF" },
    Closed:    { bg: "rgba(136,136,170,0.12)", text: "#888899" },
    // Lowercase (backend saves these)
    pending:   { bg: "rgba(255,165,61,0.12)",  text: "#FFA94D" },
    confirmed: { bg: "rgba(0,151,255,0.12)",   text: "#0097FF" },
    active:    { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
    completed: { bg: "rgba(136,136,170,0.12)", text: "#888899" },
    cancelled: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatINR = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const formatINRShort = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`;
    return formatINR(n);
};
const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
    }) : "—";
const formatDateTime = (d?: string) =>
    d ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    }) : "—";

const normalizeStatus = (s?: string) => {
    if (!s) return "Pending";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

// ─── API SERVICE ─────────────────────────────────────────────────────────────
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const Api = {
    async get<T>(path: string): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, {
            headers: { ...getAuthHeader() },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
    },

    async patch<T>(path: string, data: any): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`${res.status} ${errText}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : ({} as T);
    },

    async delete(path: string): Promise<void> {
        const res = await fetch(`${API_BASE}${path}`, {
            method: "DELETE",
            headers: { ...getAuthHeader() },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    },

    async tryGetList<T>(paths: string[]): Promise<T[]> {
        for (const p of paths) {
            try {
                const data = await this.get<any>(p);
                if (Array.isArray(data))            return data;
                if (Array.isArray(data?.data))      return data.data;
                if (Array.isArray(data?.orders))    return data.orders;
                if (Array.isArray(data?.inquiries)) return data.inquiries;
                if (Array.isArray(data?.rentals))   return data.rentals;
            } catch { /* try next path */ }
        }
        return [];
    },
};

// ─── DATA HOOK ───────────────────────────────────────────────────────────────
function useApi<T>(fn: () => Promise<T>) {
    const [data, setData]       = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setData(await fn());
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => { refetch(); }, [refetch]);
    return { data, loading, error, refetch };
}

// ─── SHARED UI ───────────────────────────────────────────────────────────────
const Badge = ({ s }: { s: string }) => {
    const normalized = normalizeStatus(s);
    const st = statusColor[s] || statusColor[normalized] || { bg: "#1E1F2A", text: "#888" };
    return (
        <span style={{
            fontSize: 10, padding: "3px 8px", borderRadius: 4,
            background: st.bg, color: st.text, fontWeight: 600,
        }}>
            {normalized}
        </span>
    );
};

const LoadingSpinner = () => (
    <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: 300, gap: 16,
    }}>
        <div style={{
            width: 40, height: 40,
            border: `3px solid #1E1F2A`,
            borderTop: `3px solid ${ACCENT}`,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 13, color: "#555577" }}>Loading from server…</p>
    </div>
);

const ErrorBox = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div style={{
        background: "#13141C", border: "1px solid rgba(255,107,107,0.3)",
        borderRadius: 10, padding: 24, textAlign: "center",
    }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <p style={{ fontSize: 14, color: "#FF6B6B", fontWeight: 600, marginBottom: 8 }}>
            Failed to connect to backend
        </p>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{message}</p>
        <p style={{ fontSize: 11, color: "#555", marginBottom: 16, fontFamily: "monospace" }}>
            {API_BASE}
        </p>
        <button
            onClick={onRetry}
            style={{
                fontSize: 12, color: "#000", background: ACCENT,
                border: "none", borderRadius: 6, padding: "8px 16px",
                cursor: "pointer", fontWeight: 600, fontFamily: "inherit",
            }}
        >
            Retry Connection
        </button>
    </div>
);

const EmptyState = ({ message, hint }: { message: string; hint?: string }) => (
    <div style={{ padding: 60, textAlign: "center", color: "#555577" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
        <p style={{ fontSize: 14, marginBottom: hint ? 8 : 0 }}>{message}</p>
        {hint && <p style={{ fontSize: 11, color: "#444" }}>{hint}</p>}
    </div>
);

// ─── CONFIRM MODAL ───────────────────────────────────────────────────────────
function ConfirmModal({
    isOpen,
    message,
    onConfirm,
    onCancel,
}: {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!isOpen) return null;
    return (
        <div
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)", zIndex: 2000,
                display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            }}
        >
            <div style={{
                background: "#13141C", border: "1px solid #1E1F2A",
                borderRadius: 12, width: "100%", maxWidth: 380, padding: 24,
            }}>
                <p style={{ fontSize: 14, color: "#E8E8EF", marginBottom: 20, lineHeight: 1.6 }}>
                    {message}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: "8px 18px", background: "transparent",
                            border: "1px solid #1E1F2A", borderRadius: 6,
                            color: "#888", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: "8px 18px", background: "#FF6B6B",
                            border: "none", borderRadius: 6,
                            color: "#fff", fontSize: 12, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function DashboardTab() {
    const ordersQ = useApi(() =>
        Api.tryGetList<RentalOrder>([
            "/api/rental-inquiry", "/api/rental-inquiries",
            "/api/rentals", "/api/rental-orders",
        ])
    );
    const inquiriesQ = useApi(() =>
        Api.tryGetList<ServiceInquiry>([
            "/api/service-inquiry", "/api/service-inquiries", "/api/inquiries",
        ])
    );

    if (ordersQ.loading || inquiriesQ.loading) return <LoadingSpinner />;
    if (ordersQ.error) return <ErrorBox message={ordersQ.error} onRetry={ordersQ.refetch} />;

    const orders    = ordersQ.data    || [];
    const inquiries = inquiriesQ.data || [];

    const totalRevenue    = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const pendingOrders   = orders.filter(o => !o.status || normalizeStatus(o.status) === "Pending").length;
    const activeOrders    = orders.filter(o => {
        const ns = normalizeStatus(o.status);
        return ns === "Active" || ns === "Confirmed";
    }).length;
    const uniqueCustomers = new Set(orders.map(o => o.email)).size;

    const recentOrders = [...orders]
        .sort((a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5);

    return (
        <div>
            {/* Stats Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 14, marginBottom: 20,
            }}>
                {[
                    { label: "Total Orders",      value: orders.length.toString(),      color: ACCENT,    sub: "all-time" },
                    { label: "Total Revenue",      value: formatINRShort(totalRevenue),  color: "#00C9A7", sub: "from rentals" },
                    { label: "Pending Orders",     value: pendingOrders.toString(),      color: "#FFA94D", sub: "awaiting action" },
                    { label: "Active Rentals",     value: activeOrders.toString(),       color: ACCENT2,   sub: "in progress" },
                    { label: "Unique Customers",   value: uniqueCustomers.toString(),    color: "#FFD93D", sub: "registered" },
                    { label: "Service Inquiries",  value: inquiries.length.toString(),   color: "#6C63FF", sub: "from website" },
                ].map(m => (
                    <div
                        key={m.label}
                        style={{
                            background: "#13141C", border: "1px solid #1E1F2A",
                            borderRadius: 10, padding: "16px 18px",
                        }}
                    >
                        <p style={{
                            fontSize: 10, color: "#666688", textTransform: "uppercase",
                            letterSpacing: "0.08em", marginBottom: 8,
                        }}>
                            {m.label}
                        </p>
                        <p style={{ fontSize: 26, fontWeight: 700, color: m.color, marginBottom: 4 }}>
                            {m.value}
                        </p>
                        <p style={{ fontSize: 10, color: "#555577" }}>{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div style={{
                background: "#13141C", border: "1px solid #1E1F2A",
                borderRadius: 10, padding: 18,
            }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 16 }}>
                    Recent Rental Orders
                </h4>
                {recentOrders.length === 0 ? (
                    <EmptyState
                        message="No orders yet"
                        hint="Orders submitted from your website will appear here"
                    />
                ) : (
                    recentOrders.map((o, i) => (
                        <div
                            key={o._id || o.id || i}
                            style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "10px 0", borderBottom: "1px solid #1A1B24", gap: 12,
                            }}
                        >
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>
                                    {o.name}
                                </p>
                                <p style={{ fontSize: 10, color: "#555577" }}>
                                    {o.productName} • {o.rentalDays} day(s) • {o.categoryName}
                                </p>
                                <p style={{ fontSize: 10, color: "#444466" }}>
                                    {formatDateTime(o.createdAt)}
                                </p>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 4 }}>
                                    {formatINR(o.totalPrice)}
                                </p>
                                <Badge s={o.status || "Pending"} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── ORDERS TAB ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function OrdersTab() {
    const { data, loading, error, refetch } = useApi(() =>
        Api.tryGetList<RentalOrder>([
            "/api/rental-inquiry", "/api/rental-inquiries",
            "/api/rentals", "/api/rental-orders",
        ])
    );

    const [filter, setFilter]   = useState("All");
    const [search, setSearch]   = useState("");
    const [selected, setSelected] = useState<RentalOrder | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        const paths = [
            `/api/rental-inquiry/${id}/status`,
            `/api/rental-inquiries/${id}/status`,
            `/api/rental-inquiry/${id}`,
            `/api/rental-inquiries/${id}`,
            `/api/rentals/${id}`,
            `/api/rental-orders/${id}`,
        ];
        let success = false;
        for (const p of paths) {
            try {
                await Api.patch(p, { status });
                success = true;
                break;
            } catch { /* try next */ }
        }
        setUpdatingId(null);
        if (success) {
            showToast(`Status updated to ${normalizeStatus(status)}`);
            await refetch();
            // Update selected modal if open
            setSelected(prev =>
                prev && (prev._id === id || prev.id === id)
                    ? { ...prev, status: status as RentalOrder["status"] }
                    : prev
            );
        } else {
            showToast("Failed to update status — check backend connection", "error");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete) return;
        const id = confirmDelete;
        setConfirmDelete(null);
        setDeletingId(id);
        const paths = [
            `/api/rental-inquiry/${id}`,
            `/api/rental-inquiries/${id}`,
            `/api/rentals/${id}`,
            `/api/rental-orders/${id}`,
        ];
        let success = false;
        for (const p of paths) {
            try {
                await Api.delete(p);
                success = true;
                break;
            } catch { /* try next */ }
        }
        setDeletingId(null);
        if (success) {
            showToast("Order deleted successfully");
            await refetch();
            setSelected(prev =>
                prev && (prev._id === id || prev.id === id) ? null : prev
            );
        } else {
            showToast("Failed to delete — check backend connection", "error");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error)   return <ErrorBox message={error} onRetry={refetch} />;

    const orders = data || [];
    const filtered = orders
        .filter(o =>
            filter === "All" ||
            normalizeStatus(o.status) === filter
        )
        .filter(o =>
            !search ||
            o.name?.toLowerCase().includes(search.toLowerCase()) ||
            o.email?.toLowerCase().includes(search.toLowerCase()) ||
            o.productName?.toLowerCase().includes(search.toLowerCase()) ||
            o.mobile?.includes(search)
        );

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", top: 70, right: 20, zIndex: 3000,
                    background: toast.type === "success" ? "#00C9A7" : "#FF6B6B",
                    color: "#000", padding: "10px 18px", borderRadius: 8,
                    fontSize: 12, fontWeight: 600,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    animation: "fadeInDown 0.3s ease",
                }}>
                    <style>{`@keyframes fadeInDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
                    {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={!!confirmDelete}
                message="Are you sure you want to delete this rental order? This action cannot be undone."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDelete(null)}
            />

            <div style={{
                background: "#13141C", border: "1px solid #1E1F2A",
                borderRadius: 10, overflow: "hidden",
            }}>
                {/* Header */}
                <div style={{
                    padding: "14px 18px", borderBottom: "1px solid #1E1F2A",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", gap: 12, flexWrap: "wrap",
                }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>
                        Rental Orders ({filtered.length} / {orders.length})
                    </span>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <input
                            type="text"
                            placeholder="Search name / email / product…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: 220, padding: "6px 10px",
                                background: "#0F1017", border: "1px solid #1E1F2A",
                                borderRadius: 6, color: "#E8E8EF",
                                fontSize: 12, outline: "none", fontFamily: "inherit",
                            }}
                        />
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            style={{
                                padding: "6px 10px", background: "#0F1017",
                                border: "1px solid #1E1F2A", borderRadius: 6,
                                color: "#E8E8EF", fontSize: 12,
                                outline: "none", fontFamily: "inherit", width: 140,
                            }}
                        >
                            {["All","Pending","Confirmed","Active","Completed","Cancelled"].map(s => (
                                <option key={s} value={s}>
                                    {s === "All" ? "All Status" : s}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={refetch}
                            style={{
                                fontSize: 11, color: ACCENT,
                                background: "rgba(78,205,196,0.08)",
                                border: `1px solid ${ACCENT}30`, borderRadius: 6,
                                padding: "5px 12px", cursor: "pointer", fontFamily: "inherit",
                            }}
                        >
                            ↻ Refresh
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
                        <thead>
                            <tr style={{ background: "#0F1017" }}>
                                {["Date","Customer","Contact","Product","Days","Total","Status","Actions"].map(h => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: "10px 14px", textAlign: "left",
                                            fontSize: 10, color: "#555577",
                                            fontWeight: 500, textTransform: "uppercase",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8}>
                                        <EmptyState
                                            message="No orders match filters"
                                            hint="Orders from your service page will show here automatically"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((o, i) => {
                                    const id = o._id || o.id || String(i);
                                    const isUpdating = updatingId === id;
                                    const isDeleting = deletingId === id;
                                    return (
                                        <tr
                                            key={id}
                                            style={{
                                                borderTop: "1px solid #1A1B24",
                                                background: i % 2 === 0 ? "transparent" : "#0D0E14",
                                                cursor: "pointer",
                                                opacity: isDeleting ? 0.4 : 1,
                                                transition: "opacity 0.2s",
                                            }}
                                            onClick={() => setSelected(o)}
                                        >
                                            <td style={{ padding: "12px 14px", fontSize: 10, color: "#555577" }}>
                                                {formatDateTime(o.createdAt)}
                                            </td>
                                            <td style={{ padding: "12px 14px" }}>
                                                <div style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>
                                                    {o.name}
                                                </div>
                                                <div style={{ fontSize: 10, color: "#555577" }}>
                                                    {o.categoryName}
                                                </div>
                                            </td>
                                            <td style={{ padding: "12px 14px", fontSize: 11 }}>
                                                <div style={{ color: ACCENT2 }}>{o.email}</div>
                                                <div style={{ color: "#8888AA" }}>{o.mobile}</div>
                                            </td>
                                            <td style={{ padding: "12px 14px", fontSize: 11, color: "#D0D0E8" }}>
                                                {o.productName}
                                                <div style={{ fontSize: 10, color: "#555577" }}>
                                                    {formatINR(o.pricePerDay)}/day
                                                </div>
                                            </td>
                                            <td style={{
                                                padding: "12px 14px", fontSize: 12,
                                                fontWeight: 600, color: "#EEEEF5", textAlign: "center",
                                            }}>
                                                {o.rentalDays}
                                            </td>
                                            <td style={{
                                                padding: "12px 14px", fontSize: 13,
                                                fontWeight: 700, color: ACCENT,
                                            }}>
                                                {formatINR(o.totalPrice)}
                                            </td>

                                            {/* Status Dropdown */}
                                            <td
                                                style={{ padding: "12px 14px" }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <select
                                                    value={normalizeStatus(o.status)}
                                                    disabled={isUpdating}
                                                    onChange={e => updateStatus(id, e.target.value)}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        color: statusColor[o.status || "pending"]?.text
                                                            || statusColor["Pending"].text,
                                                        fontSize: 11, fontWeight: 600,
                                                        cursor: isUpdating ? "wait" : "pointer",
                                                        fontFamily: "inherit",
                                                        opacity: isUpdating ? 0.5 : 1,
                                                    }}
                                                >
                                                    {["Pending","Confirmed","Active","Completed","Cancelled"].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                {isUpdating && (
                                                    <span style={{ fontSize: 9, color: "#555", marginLeft: 4 }}>
                                                        saving…
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td
                                                style={{ padding: "12px 14px" }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button
                                                        onClick={() => setSelected(o)}
                                                        style={{
                                                            fontSize: 11, color: ACCENT,
                                                            background: "rgba(78,205,196,0.1)",
                                                            border: `1px solid ${ACCENT}30`,
                                                            borderRadius: 4, padding: "4px 10px",
                                                            cursor: "pointer", fontFamily: "inherit",
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete(id)}
                                                        disabled={isDeleting}
                                                        style={{
                                                            fontSize: 11, color: "#FF6B6B",
                                                            background: "rgba(255,107,107,0.1)",
                                                            border: "1px solid rgba(255,107,107,0.3)",
                                                            borderRadius: 4, padding: "4px 10px",
                                                            cursor: isDeleting ? "wait" : "pointer",
                                                            fontFamily: "inherit",
                                                            opacity: isDeleting ? 0.5 : 1,
                                                        }}
                                                    >
                                                        {isDeleting ? "…" : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.75)",
                        backdropFilter: "blur(4px)", zIndex: 1000,
                        display: "flex", alignItems: "center",
                        justifyContent: "center", padding: 20,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#13141C", border: "1px solid #1E1F2A",
                            borderRadius: 12, width: "100%",
                            maxWidth: 600, maxHeight: "90vh", overflow: "auto",
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: "16px 20px", borderBottom: "1px solid #1E1F2A",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            position: "sticky", top: 0,
                            background: "#13141C", zIndex: 10,
                        }}>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>
                                    Order Details
                                </h3>
                                <p style={{ fontSize: 10, color: "#555577", marginTop: 2 }}>
                                    ID: {(selected._id || selected.id || "").slice(-8).toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    background: "none", border: "none",
                                    color: "#777", fontSize: 22, cursor: "pointer",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: 20 }}>
                            {/* Status Row */}
                            <div style={{
                                display: "flex", alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 14px", background: "#0F1017",
                                borderRadius: 8, marginBottom: 16,
                            }}>
                                <div>
                                    <p style={{ fontSize: 10, color: "#555577", marginBottom: 4 }}>
                                        Current Status
                                    </p>
                                    <Badge s={selected.status || "pending"} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, color: "#555577", marginBottom: 4 }}>
                                        Update Status
                                    </p>
                                    <select
                                        value={normalizeStatus(selected.status)}
                                        onChange={e => {
                                            const id = selected._id || selected.id || "";
                                            updateStatus(id, e.target.value);
                                        }}
                                        style={{
                                            background: "#13141C",
                                            border: "1px solid #1E1F2A",
                                            borderRadius: 6, color: "#E8E8EF",
                                            fontSize: 12, padding: "5px 10px",
                                            cursor: "pointer", fontFamily: "inherit",
                                        }}
                                    >
                                        {["Pending","Confirmed","Active","Completed","Cancelled"].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Fields */}
                            {[
                                ["Customer Name",  selected.name],
                                ["Email",          selected.email],
                                ["Mobile",         selected.mobile],
                                ["Category",       selected.categoryName],
                                ["Product",        selected.productName],
                                ["Product ID",     `#${selected.productId}`],
                                ["Daily Rate",     formatINR(selected.pricePerDay)],
                                ["Rental Days",    `${selected.rentalDays} day(s)`],
                                ["Total Amount",   formatINR(selected.totalPrice)],
                                ["Submitted",      formatDateTime(selected.createdAt)],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex", justifyContent: "space-between",
                                        padding: "10px 0", borderBottom: "1px solid #1A1B24",
                                    }}
                                >
                                    <span style={{ fontSize: 11, color: "#666688", textTransform: "uppercase" }}>
                                        {label}
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "#D0D0E8", textAlign: "right" }}>
                                        {value}
                                    </span>
                                </div>
                            ))}

                            {/* Special Requests */}
                            {selected.requirements && (
                                <div style={{
                                    marginTop: 12, padding: "12px 14px",
                                    background: "#0F1017", borderRadius: 8,
                                }}>
                                    <p style={{
                                        fontSize: 11, color: "#666688",
                                        textTransform: "uppercase", marginBottom: 6,
                                    }}>
                                        Special Requests
                                    </p>
                                    <p style={{ fontSize: 12, color: "#D0D0E8", lineHeight: 1.6 }}>
                                        {selected.requirements}
                                    </p>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                                <a
                                    href={`tel:${selected.mobile}`}
                                    style={{
                                        flex: 1, padding: "10px",
                                        background: "rgba(78,205,196,0.1)",
                                        border: `1px solid ${ACCENT}30`,
                                        borderRadius: 8, color: ACCENT,
                                        fontSize: 12, fontWeight: 600,
                                        textAlign: "center",
                                        textDecoration: "none",
                                    }}
                                >
                                    📞 Call
                                </a>
                                <a
                                    href={`mailto:${selected.email}`}
                                    style={{
                                        flex: 1, padding: "10px",
                                        background: "rgba(0,151,255,0.1)",
                                        border: `1px solid ${ACCENT2}30`,
                                        borderRadius: 8, color: ACCENT2,
                                        fontSize: 12, fontWeight: 600,
                                        textAlign: "center",
                                        textDecoration: "none",
                                    }}
                                >
                                    ✉️ Email
                                </a>
                                <button
                                    onClick={() => {
                                        const id = selected._id || selected.id || "";
                                        setSelected(null);
                                        setConfirmDelete(id);
                                    }}
                                    style={{
                                        flex: 1, padding: "10px",
                                        background: "rgba(255,107,107,0.1)",
                                        border: "1px solid rgba(255,107,107,0.3)",
                                        borderRadius: 8, color: "#FF6B6B",
                                        fontSize: 12, fontWeight: 600,
                                        cursor: "pointer", fontFamily: "inherit",
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── CATALOG TAB ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function CatalogTab() {
    const ordersQ = useApi(() =>
        Api.tryGetList<RentalOrder>([
            "/api/rental-inquiry", "/api/rental-inquiries",
            "/api/rentals", "/api/rental-orders",
        ])
    );
    const orders = ordersQ.data || [];

    const rentCountByProduct = orders.reduce((acc, o) => {
        acc[o.productId] = (acc[o.productId] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const revenueByProduct = orders.reduce((acc, o) => {
        acc[o.productId] = (acc[o.productId] || 0) + (o.totalPrice || 0);
        return acc;
    }, {} as Record<number, number>);

    return (
        <div>
            <div style={{
                background: "#13141C", border: "1px solid #1E1F2A",
                borderRadius: 10, padding: "12px 18px", marginBottom: 16,
            }}>
                <p style={{ fontSize: 12, color: "#888" }}>
                    📋 Catalog defined in <code style={{ color: ACCENT }}>/service</code> page.
                    Rental counts and revenue are pulled from real orders.
                </p>
            </div>

            {RENTAL_CATALOG.map(cat => (
                <div key={cat.category} style={{ marginBottom: 20 }}>
                    <h3 style={{
                        fontSize: 14, fontWeight: 600, color: "#CCCCE0",
                        marginBottom: 12, display: "flex", alignItems: "center", gap: 10,
                    }}>
                        {cat.category}
                        <span style={{ fontSize: 11, color: "#555", fontWeight: 400 }}>
                            ({cat.items.length} items)
                        </span>
                    </h3>
                    <div style={{
                        background: "#13141C", border: "1px solid #1E1F2A",
                        borderRadius: 10, overflow: "hidden",
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#0F1017" }}>
                                    {["ID","Product","Specs","Daily Rate","Original","Rentals","Revenue"].map(h => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: "10px 14px", textAlign: "left",
                                                fontSize: 10, color: "#555577",
                                                fontWeight: 500, textTransform: "uppercase",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cat.items.map((item, i) => {
                                    const count   = rentCountByProduct[item.id] || 0;
                                    const revenue = revenueByProduct[item.id]   || 0;
                                    return (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderTop: "1px solid #1A1B24",
                                                background: i % 2 === 0 ? "transparent" : "#0D0E14",
                                            }}
                                        >
                                            <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT }}>
                                                #{item.id}
                                            </td>
                                            <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>
                                                {item.name}
                                            </td>
                                            <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>
                                                {item.specs}
                                            </td>
                                            <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: ACCENT }}>
                                                {formatINR(item.price)}
                                            </td>
                                            <td style={{ padding: "12px 14px", fontSize: 11, color: "#555577", textDecoration: "line-through" }}>
                                                {formatINR(item.originalPrice)}
                                            </td>
                                            <td style={{ padding: "12px 14px" }}>
                                                <span style={{
                                                    fontSize: 11, fontWeight: 600,
                                                    padding: "3px 10px", borderRadius: 4,
                                                    background: count > 0 ? "rgba(0,201,167,0.12)" : "#1E1F2A",
                                                    color: count > 0 ? "#00C9A7" : "#555",
                                                }}>
                                                    {count} {count === 1 ? "rental" : "rentals"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#FFA94D" }}>
                                                {revenue > 0 ? formatINR(revenue) : "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── CUSTOMERS TAB ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function CustomersTab() {
    const { data, loading, error, refetch } = useApi(() =>
        Api.tryGetList<RentalOrder>([
            "/api/rental-inquiry", "/api/rental-inquiries",
            "/api/rentals", "/api/rental-orders",
        ])
    );
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<any>(null);

    if (loading) return <LoadingSpinner />;
    if (error)   return <ErrorBox message={error} onRetry={refetch} />;

    // Aggregate by email
    const customerMap = (data || []).reduce((acc, o) => {
        if (!o.email) return acc;
        if (!acc[o.email]) {
            acc[o.email] = {
                name: o.name, email: o.email, mobile: o.mobile,
                orderCount: 0, totalSpent: 0,
                lastOrder: o.createdAt, orders: [],
            };
        }
        acc[o.email].orderCount  += 1;
        acc[o.email].totalSpent  += o.totalPrice || 0;
        acc[o.email].orders.push(o);
        if (new Date(o.createdAt || 0) > new Date(acc[o.email].lastOrder || 0)) {
            acc[o.email].lastOrder = o.createdAt;
        }
        return acc;
    }, {} as Record<string, any>);

    const customers = Object.values(customerMap)
        .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
        .filter((c: any) =>
            !search ||
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.mobile?.includes(search)
        );

    return (
        <div>
            <div style={{
                background: "#13141C", border: "1px solid #1E1F2A",
                borderRadius: 10, overflow: "hidden",
            }}>
                {/* Header */}
                <div style={{
                    padding: "14px 18px", borderBottom: "1px solid #1E1F2A",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", gap: 12, flexWrap: "wrap",
                }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>
                        Customers ({customers.length})
                    </span>
                    <input
                        type="text"
                        placeholder="Search name / email / mobile…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: 220, padding: "6px 10px",
                            background: "#0F1017", border: "1px solid #1E1F2A",
                            borderRadius: 6, color: "#E8E8EF",
                            fontSize: 12, outline: "none", fontFamily: "inherit",
                        }}
                    />
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                        <thead>
                            <tr style={{ background: "#0F1017" }}>
                                {["Customer","Email","Mobile","Orders","Total Spent","Last Order",""].map(h => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: "10px 14px", textAlign: "left",
                                            fontSize: 10, color: "#555577",
                                            fontWeight: 500, textTransform: "uppercase",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <EmptyState
                                            message="No customers yet"
                                            hint="Customers appear here when they place orders from your website"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                customers.map((c: any, i: number) => (
                                    <tr
                                        key={c.email}
                                        style={{
                                            borderTop: "1px solid #1A1B24",
                                            background: i % 2 === 0 ? "transparent" : "#0D0E14",
                                        }}
                                    >
                                        <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>
                                            {c.name}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT2 }}>
                                            {c.email}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>
                                            {c.mobile}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#EEEEF5", textAlign: "center" }}>
                                            {c.orderCount}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: ACCENT }}>
                                            {formatINR(c.totalSpent)}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#555577" }}>
                                            {formatDate(c.lastOrder)}
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <button
                                                onClick={() => setSelected(c)}
                                                style={{
                                                    fontSize: 11, color: ACCENT,
                                                    background: "rgba(78,205,196,0.08)",
                                                    border: `1px solid ${ACCENT}30`,
                                                    borderRadius: 4, padding: "4px 10px",
                                                    cursor: "pointer", fontFamily: "inherit",
                                                }}
                                            >
                                                View Orders
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Orders Modal */}
            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.75)",
                        backdropFilter: "blur(4px)", zIndex: 1000,
                        display: "flex", alignItems: "center",
                        justifyContent: "center", padding: 20,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#13141C", border: "1px solid #1E1F2A",
                            borderRadius: 12, width: "100%",
                            maxWidth: 560, maxHeight: "90vh", overflow: "auto",
                        }}
                    >
                        <div style={{
                            padding: "16px 20px", borderBottom: "1px solid #1E1F2A",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            position: "sticky", top: 0, background: "#13141C", zIndex: 10,
                        }}>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>
                                    {selected.name}
                                </h3>
                                <p style={{ fontSize: 10, color: "#555577", marginTop: 2 }}>
                                    {selected.email} • {selected.mobile}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                style={{ background: "none", border: "none", color: "#777", fontSize: 22, cursor: "pointer" }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{
                                display: "grid", gridTemplateColumns: "1fr 1fr",
                                gap: 12, marginBottom: 16,
                            }}>
                                {[
                                    { label: "Total Orders",  value: selected.orderCount,          color: ACCENT },
                                    { label: "Total Spent",   value: formatINR(selected.totalSpent), color: "#00C9A7" },
                                ].map(s => (
                                    <div
                                        key={s.label}
                                        style={{
                                            background: "#0F1017", borderRadius: 8,
                                            padding: "12px 14px", textAlign: "center",
                                        }}
                                    >
                                        <p style={{ fontSize: 20, fontWeight: 700, color: s.color }}>
                                            {s.value}
                                        </p>
                                        <p style={{ fontSize: 10, color: "#555577", marginTop: 4 }}>
                                            {s.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <h4 style={{ fontSize: 12, color: "#666688", marginBottom: 10, textTransform: "uppercase" }}>
                                Order History
                            </h4>
                            {selected.orders.map((o: RentalOrder, i: number) => (
                                <div
                                    key={o._id || o.id || i}
                                    style={{
                                        padding: "10px 12px", background: "#0F1017",
                                        borderRadius: 8, marginBottom: 8,
                                        border: "1px solid #1A1B24",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>
                                            {o.productName}
                                        </span>
                                        <Badge s={o.status || "pending"} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 10, color: "#555577" }}>
                                            {o.categoryName} • {o.rentalDays} day(s)
                                        </span>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>
                                            {formatINR(o.totalPrice)}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 10, color: "#444466", marginTop: 4 }}>
                                        {formatDateTime(o.createdAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── INQUIRIES TAB ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function InquiriesTab() {
    const { data, loading, error, refetch } = useApi(() =>
        Api.tryGetList<ServiceInquiry>([
            "/api/service-inquiry", "/api/service-inquiries", "/api/inquiries",
        ])
    );
    const [selected, setSelected] = useState<ServiceInquiry | null>(null);

    if (loading) return <LoadingSpinner />;
    if (error)   return <ErrorBox message={error} onRetry={refetch} />;

    const inquiries = data || [];

    return (
        <div>
            <div style={{
                background: "#13141C", border: "1px solid #1E1F2A",
                borderRadius: 10, overflow: "hidden",
            }}>
                <div style={{
                    padding: "14px 18px", borderBottom: "1px solid #1E1F2A",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>
                        Service Inquiries ({inquiries.length})
                    </span>
                    <button
                        onClick={refetch}
                        style={{
                            fontSize: 11, color: ACCENT,
                            background: "rgba(78,205,196,0.08)",
                            border: `1px solid ${ACCENT}30`,
                            borderRadius: 6, padding: "5px 12px",
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        ↻ Refresh
                    </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                        <thead>
                            <tr style={{ background: "#0F1017" }}>
                                {["Date","Name","Contact","Service","Timeline","Requirements",""].map(h => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: "10px 14px", textAlign: "left",
                                            fontSize: 10, color: "#555577",
                                            fontWeight: 500, textTransform: "uppercase",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <EmptyState
                                            message="No service inquiries yet"
                                            hint="Inquiries from your service page form will appear here"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map((q, i) => (
                                    <tr
                                        key={q._id || q.id || i}
                                        style={{
                                            borderTop: "1px solid #1A1B24",
                                            background: i % 2 === 0 ? "transparent" : "#0D0E14",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setSelected(q)}
                                    >
                                        <td style={{ padding: "12px 14px", fontSize: 10, color: "#555577" }}>
                                            {formatDateTime(q.createdAt)}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>
                                            {q.name}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 11 }}>
                                            <div style={{ color: ACCENT2 }}>{q.email}</div>
                                            <div style={{ color: "#8888AA" }}>{q.mobile}</div>
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 12, color: ACCENT, fontWeight: 500 }}>
                                            {q.service}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>
                                            {q.timeline}
                                        </td>
                                        <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688", maxWidth: 200 }}>
                                            <span style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            } as any}>
                                                {q.requirements || "—"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <button
                                                onClick={e => { e.stopPropagation(); setSelected(q); }}
                                                style={{
                                                    fontSize: 11, color: ACCENT,
                                                    background: "rgba(78,205,196,0.08)",
                                                    border: `1px solid ${ACCENT}30`,
                                                    borderRadius: 4, padding: "4px 10px",
                                                    cursor: "pointer", fontFamily: "inherit",
                                                }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inquiry Detail Modal */}
            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.75)",
                        backdropFilter: "blur(4px)", zIndex: 1000,
                        display: "flex", alignItems: "center",
                        justifyContent: "center", padding: 20,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#13141C", border: "1px solid #1E1F2A",
                            borderRadius: 12, width: "100%",
                            maxWidth: 500, maxHeight: "90vh", overflow: "auto",
                        }}
                    >
                        <div style={{
                            padding: "16px 20px", borderBottom: "1px solid #1E1F2A",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            position: "sticky", top: 0, background: "#13141C", zIndex: 10,
                        }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>
                                Inquiry Details
                            </h3>
                            <button
                                onClick={() => setSelected(null)}
                                style={{ background: "none", border: "none", color: "#777", fontSize: 22, cursor: "pointer" }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ padding: 20 }}>
                            {[
                                ["Name",      selected.name],
                                ["Email",     selected.email],
                                ["Mobile",    selected.mobile],
                                ["Service",   selected.service],
                                ["Timeline",  selected.timeline],
                                ["Submitted", formatDateTime(selected.createdAt)],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex", justifyContent: "space-between",
                                        padding: "10px 0", borderBottom: "1px solid #1A1B24",
                                    }}
                                >
                                    <span style={{ fontSize: 11, color: "#666688", textTransform: "uppercase" }}>
                                        {label}
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "#D0D0E8", textAlign: "right" }}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                            {selected.requirements && (
                                <div style={{ marginTop: 12, padding: "12px 14px", background: "#0F1017", borderRadius: 8 }}>
                                    <p style={{ fontSize: 11, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>
                                        Requirements
                                    </p>
                                    <p style={{ fontSize: 12, color: "#D0D0E8", lineHeight: 1.6 }}>
                                        {selected.requirements}
                                    </p>
                                </div>
                            )}
                            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                                <a
                                    href={`tel:${selected.mobile}`}
                                    style={{
                                        flex: 1, padding: "10px",
                                        background: "rgba(78,205,196,0.1)",
                                        border: `1px solid ${ACCENT}30`,
                                        borderRadius: 8, color: ACCENT,
                                        fontSize: 12, fontWeight: 600,
                                        textAlign: "center", textDecoration: "none",
                                    }}
                                >
                                    📞 Call
                                </a>
                                <a
                                    href={`mailto:${selected.email}`}
                                    style={{
                                        flex: 1, padding: "10px",
                                        background: "rgba(0,151,255,0.1)",
                                        border: `1px solid ${ACCENT2}30`,
                                        borderRadius: 8, color: ACCENT2,
                                        fontSize: 12, fontWeight: 600,
                                        textAlign: "center", textDecoration: "none",
                                    }}
                                >
                                    ✉️ Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── REPORTS TAB ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function ReportsTab() {
    const { data, loading, error, refetch } = useApi(() =>
        Api.tryGetList<RentalOrder>([
            "/api/rental-inquiry", "/api/rental-inquiries",
            "/api/rentals", "/api/rental-orders",
        ])
    );

    if (loading) return <LoadingSpinner />;
    if (error)   return <ErrorBox message={error} onRetry={refetch} />;

    const orders       = data || [];
    const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const avgOrder     = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    const byCategory = orders.reduce((acc, o) => {
        if (o.categoryName) acc[o.categoryName] = (acc[o.categoryName] || 0) + (o.totalPrice || 0);
        return acc;
    }, {} as Record<string, number>);

    const productCounts = orders.reduce((acc, o) => {
        if (o.productName) acc[o.productName] = (acc[o.productName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topProducts = Object.entries(productCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const byStatus = orders.reduce((acc, o) => {
        const s = normalizeStatus(o.status);
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const exportCSV = () => {
        const headers = ["Name","Email","Mobile","Product","Category","Days","Total","Status","Date"];
        const rows = orders.map(o => [
            o.name, o.email, o.mobile, o.productName,
            o.categoryName, o.rentalDays, o.totalPrice,
            normalizeStatus(o.status), formatDate(o.createdAt),
        ]);
        const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `rental-report-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {
        const blob = new Blob([JSON.stringify({
            generatedAt: new Date().toISOString(),
            summary: { totalOrders: orders.length, totalRevenue, avgOrder },
            orders, byCategory, topProducts, byStatus,
        }, null, 2)], { type: "application/json" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `rental-report-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, color: "#CCCCE0", fontWeight: 600 }}>Business Reports</h3>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={exportCSV}
                        style={{
                            fontSize: 11, color: ACCENT,
                            background: "rgba(78,205,196,0.1)",
                            border: `1px solid ${ACCENT}30`,
                            borderRadius: 6, padding: "6px 14px",
                            cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                        }}
                    >
                        📥 Export CSV
                    </button>
                    <button
                        onClick={exportJSON}
                        style={{
                            fontSize: 11, color: ACCENT2,
                            background: "rgba(0,151,255,0.1)",
                            border: `1px solid ${ACCENT2}30`,
                            borderRadius: 6, padding: "6px 14px",
                            cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                        }}
                    >
                        📥 Export JSON
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 14, marginBottom: 20,
            }}>
                {[
                    { label: "Total Orders",    value: orders.length.toString(),              color: ACCENT },
                    { label: "Total Revenue",   value: formatINR(totalRevenue),               color: "#00C9A7" },
                    { label: "Avg Order Value", value: formatINR(avgOrder),                   color: ACCENT2 },
                    { label: "Unique Products", value: Object.keys(productCounts).length.toString(), color: "#FFA94D" },
                ].map(m => (
                    <div
                        key={m.label}
                        style={{
                            background: "#13141C", border: "1px solid #1E1F2A",
                            borderRadius: 10, padding: 18,
                        }}
                    >
                        <p style={{ fontSize: 11, color: "#555577", textTransform: "uppercase", marginBottom: 8 }}>
                            {m.label}
                        </p>
                        <p style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {/* Revenue by Category */}
                <div style={{
                    background: "#13141C", border: "1px solid #1E1F2A",
                    borderRadius: 10, padding: 18,
                }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 16 }}>
                        Revenue by Category
                    </h4>
                    {Object.entries(byCategory).length === 0 ? (
                        <p style={{ fontSize: 12, color: "#555" }}>No data yet</p>
                    ) : (
                        Object.entries(byCategory)
                            .sort(([, a], [, b]) => b - a)
                            .map(([cat, rev]) => {
                                const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
                                return (
                                    <div key={cat} style={{ marginBottom: 14 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                            <span style={{ fontSize: 12, color: "#888" }}>{cat}</span>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>
                                                {formatINR(rev)}
                                            </span>
                                        </div>
                                        <div style={{ height: 6, background: "#1E1F2A", borderRadius: 3 }}>
                                            <div style={{
                                                height: "100%", width: `${pct}%`,
                                                background: ACCENT, borderRadius: 3,
                                                transition: "width 0.5s ease",
                                            }} />
                                        </div>
                                        <p style={{ fontSize: 9, color: "#555", marginTop: 2 }}>
                                            {pct.toFixed(1)}% of total
                                        </p>
                                    </div>
                                );
                            })
                    )}
                </div>

                {/* Top Products */}
                <div style={{
                    background: "#13141C", border: "1px solid #1E1F2A",
                    borderRadius: 10, padding: 18,
                }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 16 }}>
                        Top Rented Products
                    </h4>
                    {topProducts.length === 0 ? (
                        <p style={{ fontSize: 12, color: "#555" }}>No data yet</p>
                    ) : (
                        topProducts.map(([name, count], i) => (
                            <div
                                key={name}
                                style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", padding: "10px 0",
                                    borderBottom: "1px solid #1A1B24",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{
                                        width: 22, height: 22, borderRadius: 4,
                                        background: i === 0 ? "rgba(255,215,0,0.15)" : "#1E1F2A",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 10, fontWeight: 700,
                                        color: i === 0 ? "#FFD700" : "#555",
                                        flexShrink: 0,
                                    }}>
                                        {i + 1}
                                    </span>
                                    <p style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{name}</p>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#FFA94D" }}>
                                    {count}×
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Status Distribution */}
            <div style={{
                background: "#13141C", border: "1px solid #1E1F2A",
                borderRadius: 10, padding: 18,
            }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 16 }}>
                    Orders by Status
                </h4>
                {Object.keys(byStatus).length === 0 ? (
                    <p style={{ fontSize: 12, color: "#555" }}>No data yet</p>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                        gap: 12,
                    }}>
                        {Object.entries(byStatus).map(([status, count]) => (
                            <div
                                key={status}
                                style={{
                                    padding: 14, background: "#0F1017",
                                    borderRadius: 8, textAlign: "center",
                                    border: `1px solid ${statusColor[status]?.text || "#555"}22`,
                                }}
                            >
                                <p style={{
                                    fontSize: 28, fontWeight: 700,
                                    color: statusColor[status]?.text || "#888",
                                }}>
                                    {count}
                                </p>
                                <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MAIN PANEL ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function RentalPanel() {
    const [active, setActive]           = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile]       = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [adminUser, setAdminUser]     = useState<{
        name: string; email: string; role?: string;
    } | null>(null);

    useEffect(() => {
        const link   = document.createElement("link");
        link.rel     = "stylesheet";
        link.href    = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);

        const onResize = () => setIsMobile(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);

        try {
            const raw = localStorage.getItem("user");
            if (raw) setAdminUser(JSON.parse(raw));
        } catch { /* ignore */ }

        const onClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-profile-menu]")) setProfileOpen(false);
        };
        document.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("resize", onResize);
            document.removeEventListener("click", onClick);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const getInitial = () =>
        adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A";

    const renderContent = () => {
        switch (active) {
            case "dashboard": return <DashboardTab />;
            case "orders":    return <OrdersTab />;
            case "catalog":   return <CatalogTab />;
            case "customers": return <CustomersTab />;
            case "inquiries": return <InquiriesTab />;
            case "reports":   return <ReportsTab />;
            default:          return null;
        }
    };

    return (
        <div style={{
            display: "flex", height: "100vh",
            background: "#0B0C10",
            fontFamily: "'DM Sans','Segoe UI',sans-serif",
            color: "#E8E8EF",
        }}>
            {/* Mobile hamburger */}
            {isMobile && (
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        position: "fixed", top: 12, left: 12, zIndex: 100,
                        background: "#13141C", border: "1px solid #1E1F2A",
                        borderRadius: 6, padding: "8px 12px",
                        color: "#E8E8EF", cursor: "pointer", fontSize: 16,
                    }}
                >
                    ☰
                </button>
            )}

            {/* Sidebar */}
            <aside style={{
                width: 220, background: "#0F1117",
                borderRight: "1px solid #1E1F2A",
                flexShrink: 0, display: "flex", flexDirection: "column",
                position: isMobile ? "fixed" : "relative",
                left: isMobile && !sidebarOpen ? -220 : 0,
                top: 0, bottom: 0, zIndex: 50,
                transition: "left 0.3s",
            }}>
                {/* Logo */}
                <div style={{
                    padding: "18px 16px 14px",
                    borderBottom: "1px solid #1E1F2A",
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <div style={{
                        width: 30, height: 30,
                        background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
                        borderRadius: 7, display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}>
                        ◧
                    </div>
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#E8E8EF" }}>Crewholic</p>
                        <p style={{ fontSize: 10, color: "#555577" }}>Rental Admin</p>
                    </div>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                    {SIDEBAR_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                            style={{
                                width: "100%", display: "flex",
                                alignItems: "center", gap: 10,
                                padding: "10px 16px",
                                background: active === item.id ? "rgba(78,205,196,0.12)" : "transparent",
                                border: "none", cursor: "pointer",
                                color: active === item.id ? ACCENT : "#777799",
                                fontSize: 12,
                                fontWeight: active === item.id ? 600 : 400,
                                borderLeft: `2px solid ${active === item.id ? ACCENT : "transparent"}`,
                                transition: "all 0.15s",
                                textAlign: "left", fontFamily: "inherit",
                            }}
                        >
                            <span style={{ fontSize: 13 }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Connection indicator */}
                <div style={{ padding: "10px 16px", borderTop: "1px solid #1E1F2A" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00C9A7" }} />
                        <span style={{ fontSize: 10, color: "#555577" }}>Connected</span>
                    </div>
                    <p style={{
                        fontSize: 9, color: "#333344", marginTop: 4,
                        fontFamily: "monospace", wordBreak: "break-all",
                    }}>
                        {API_BASE}
                    </p>
                </div>
            </aside>

            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
                />
            )}

            {/* Main content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Header */}
                <header style={{
                    background: "#0F1117", borderBottom: "1px solid #1E1F2A",
                    padding: "0 16px 0 24px", height: 54,
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", flexShrink: 0, gap: 12,
                }}>
                    <h1 style={{
                        fontSize: 15, fontWeight: 600, color: "#E8E8EF",
                        margin: 0, paddingLeft: isMobile ? 40 : 0,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                        {SIDEBAR_ITEMS.find(s => s.id === active)?.label}
                    </h1>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* Back to Main Site */}
                        <button
                            onClick={() => window.location.href = "/"}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "7px 12px",
                                background: "rgba(78,205,196,0.08)",
                                border: `1px solid ${ACCENT}30`,
                                borderRadius: 6, color: ACCENT,
                                fontSize: 11, fontWeight: 600,
                                cursor: "pointer", fontFamily: "inherit",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <span>⌂</span>
                            {!isMobile && <span>Main Site</span>}
                        </button>

                        {/* Profile Dropdown */}
                        <div data-profile-menu style={{ position: "relative" }}>
                            <button
                                onClick={e => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "5px 10px 5px 5px",
                                    background: profileOpen ? "rgba(255,255,255,0.05)" : "transparent",
                                    border: "1px solid",
                                    borderColor: profileOpen ? "#1E1F2A" : "transparent",
                                    borderRadius: 20, cursor: "pointer",
                                    fontFamily: "inherit", transition: "all 0.15s",
                                }}
                            >
                                <div style={{
                                    width: 30, height: 30, borderRadius: "50%",
                                    background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12, fontWeight: 700, color: "#000",
                                    flexShrink: 0,
                                }}>
                                    {getInitial()}
                                </div>
                                {!isMobile && (
                                    <>
                                        <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "#E8E8EF" }}>
                                                {adminUser?.name || "Admin"}
                                            </div>
                                            <div style={{ fontSize: 9, color: "#666688" }}>
                                                {adminUser?.role || "Administrator"}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: 9, color: "#555",
                                            transition: "transform 0.2s",
                                            display: "inline-block",
                                            transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        }}>
                                            ▼
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* Dropdown */}
                            {profileOpen && (
                                <div style={{
                                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                                    width: 240, background: "#13141C",
                                    border: "1px solid #1E1F2A", borderRadius: 10,
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                                    zIndex: 100, overflow: "hidden",
                                }}>
                                    {/* User info */}
                                    <div style={{
                                        padding: "14px 16px", borderBottom: "1px solid #1E1F2A",
                                        background: "linear-gradient(135deg, rgba(78,205,196,0.05), rgba(0,151,255,0.05))",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: "50%",
                                                background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
                                                display: "flex", alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 16, fontWeight: 700, color: "#000", flexShrink: 0,
                                            }}>
                                                {getInitial()}
                                            </div>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <p style={{
                                                    fontSize: 13, fontWeight: 600, color: "#E8E8EF",
                                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                }}>
                                                    {adminUser?.name || "Admin User"}
                                                </p>
                                                <p style={{
                                                    fontSize: 10, color: "#666688",
                                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                }}>
                                                    {adminUser?.email || "admin@crewholic.com"}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{
                                            marginTop: 10, display: "inline-flex",
                                            alignItems: "center", gap: 6,
                                            padding: "3px 8px",
                                            background: "rgba(0,201,167,0.12)", borderRadius: 4,
                                        }}>
                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C9A7" }} />
                                            <span style={{ fontSize: 10, color: "#00C9A7", fontWeight: 600 }}>
                                                {adminUser?.role || "Administrator"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Menu items */}
                                    <div style={{ padding: "6px 0" }}>
                                        {[
                                            { label: "Go to Main Website", icon: "⌂", href: "/" },
                                            { label: "View Services",      icon: "◈", href: "/service" },
                                        ].map(item => (
                                            <button
                                                key={item.label}
                                                onClick={() => { setProfileOpen(false); window.location.href = item.href; }}
                                                style={{
                                                    width: "100%", display: "flex",
                                                    alignItems: "center", gap: 10,
                                                    padding: "10px 16px",
                                                    background: "transparent", border: "none",
                                                    color: "#CCCCE0", fontSize: 12,
                                                    cursor: "pointer", textAlign: "left",
                                                    fontFamily: "inherit",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(78,205,196,0.08)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                            </button>
                                        ))}

                                        <div style={{ height: 1, background: "#1E1F2A", margin: "6px 0" }} />

                                        <button
                                            onClick={() => { setProfileOpen(false); handleLogout(); }}
                                            style={{
                                                width: "100%", display: "flex",
                                                alignItems: "center", gap: 10,
                                                padding: "10px 16px",
                                                background: "transparent", border: "none",
                                                color: "#FF6B6B", fontSize: 12, fontWeight: 500,
                                                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.08)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                        >
                                            <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>⎋</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}