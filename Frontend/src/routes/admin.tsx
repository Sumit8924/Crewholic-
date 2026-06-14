/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";

export const Route = createFileRoute("/admin")({
    component: AdminDashboard,
});

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "⬡", sub: ["Overview", "Revenue Summary", "Active Projects", "Pending Tasks", "Team Performance", "Recent Activities", "Analytics Overview"] },
    { id: "website", label: "Website Creation", icon: "◈", sub: ["Projects Overview", "New Requests", "Quotations", "Payment Verification", "Assigned Teams", "Project Details", "Project Timeline", "Work Progress", "Client Communication", "File Management", "Deliverables", "Payments & Invoices", "Completed Projects", "Reports"] },
    { id: "marketing", label: "Marketing Panel", icon: "◉", sub: ["Campaign Management", "Lead Management", "Lead Assignment", "Call Center Activities", "Client Communication", "Marketing Reports", "Performance Analytics", "Social Media Campaigns", "Email Campaigns", "Team Management", "Target Tracking"] },
    { id: "rental", label: "Tech Rental", icon: "◧", sub: ["Products Inventory", "Product Categories", "Equipment Tracking", "Bookings / Orders", "Rental Requests", "Client Details", "Payments", "Payment Verification", "Delivery Tracking", "Maintenance Requests", "Support Tickets", "Reports"] },
    { id: "events", label: "Event Management", icon: "◫", sub: ["Event Requests", "Event Planning", "Event Scheduling", "Vendor Management", "Resource Allocation", "Work Progress", "Client Communication", "Payments", "Budget Tracking", "Event Reports", "Event Analytics"] },
    { id: "finance", label: "Finance Panel", icon: "◎", sub: ["Dashboard", "Income", "Expenses", "Transactions", "Invoices", "Payment Tracking", "Quotations", "Budget Management", "Profit & Loss", "Financial Reports", "Tax Records", "Export Reports"] },
    { id: "director", label: "Director Panel", icon: "◆", sub: ["Company Overview", "Department Overview", "KPI Monitoring", "Business Growth", "Performance Reports", "Analytics Dashboard", "Important Decisions", "Notifications", "Company Reports", "Strategic Planning"] },
    { id: "analyst", label: "Analyst Dashboard", icon: "◐", sub: ["Data Analysis", "Performance Reports", "Trend Analysis", "Business Insights", "Graphs & Charts", "Data Export", "Forecast Reports", "Department Analytics", "KPI Analytics", "Custom Reports"] },
    { id: "callcenter", label: "Call Center", icon: "◑", sub: ["Lead Calling", "Lead Management", "Customer Support", "Follow-Ups", "Lead Status Tracking", "Call Logs", "Call Reports", "Team Performance", "Ticket Management", "Outreach Analytics"] },
    { id: "reports", label: "Reports & Analytics", icon: "◓", sub: ["Revenue Reports", "Project Reports", "Marketing Reports", "Rental Reports", "Event Reports", "Team Reports", "Finance Reports", "KPI Reports", "Export Center"] },
    { id: "team", label: "Team Management", icon: "◒", sub: ["Employees", "Departments", "Roles & Permissions", "Attendance", "Performance Review", "Task Assignment", "Activity Logs"] },
    { id: "notifications", label: "Notifications Center", icon: "◔", sub: ["System Notifications", "Client Notifications", "Payment Alerts", "Task Alerts", "Approval Requests"] },
    { id: "settings", label: "Settings", icon: "◕", sub: ["Company Settings", "User Management", "Roles & Permissions", "Theme Settings", "Email Settings", "Security Settings", "Integrations", "Backup & Restore", "System Configuration"] },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface PaymentSubmission {
    type: "advance" | "final";
    txnId: string;
    submittedAt: string;
    amount: number;
    status: "pending_verification" | "approved" | "rejected";
    rejectionReason?: string;
    approvedAt?: string;
    rejectedAt?: string;
    screenshotUrl?: string;
    payerName?: string;
    paymentMethod?: string;
    upiId?: string;
}

interface RentalOrder {
    _id: string; name: string; email: string; mobile: string; productName: string;
    categoryName: string; pricePerDay: number; rentalDays: number; totalPrice: number;
    status: string; requirements?: string; createdAt: string;
    // Payment verification fields
    paymentTxnId?: string;
    paymentStatus?: "pending_verification" | "approved" | "rejected" | "not_submitted";
    paymentSubmittedAt?: string;
    paymentAmount?: number;
    paymentScreenshotUrl?: string;
    paymentMethod?: string;
    paymentRejectionReason?: string;
    paymentApprovedAt?: string;
}

interface ServiceInquiry {
    _id: string; name: string; email: string; mobile: string; service: string;
    timeline: string; requirements?: string; status: string; createdAt: string;
    quotedAmount?: number;
    adminNotes?: string;
    quoteSentAt?: string;
    workCompleted?: boolean;
    // Advance payment
    advancePaid?: boolean;
    advanceAmount?: number;
    advanceTxnId?: string;
    advancePaidAt?: string;
    advancePaymentStatus?: "pending_verification" | "approved" | "verified" | "rejected" | "not_submitted";
    advancePaymentMethod?: string;
    advanceScreenshotUrl?: string;
    advanceRejectionReason?: string;
    advanceSubmittedAt?: string;
    advancePayerName?: string;
    advanceUpiId?: string;
    // Final payment
    finalPaid?: boolean;
    finalAmount?: number;
    finalTxnId?: string;
    finalPaidAt?: string;
    finalPaymentStatus?: "pending_verification" | "approved" | "verified" | "rejected" | "not_submitted";
    finalPaymentMethod?: string;
    finalScreenshotUrl?: string;
    finalRejectionReason?: string;
    finalSubmittedAt?: string;
    finalPayerName?: string;
    finalUpiId?: string;
    // All payment submissions (for audit trail)
    paymentSubmissions?: PaymentSubmission[];
}

interface Project { _id: string; projectId?: string; name: string; client: string; type: string; status: string; progress: number; team: string; budget: number; dueDate: string; createdAt: string; }
interface User { _id: string; name: string; email: string; mobile?: string; role?: string; createdAt: string; }
interface Invoice { _id: string; invoiceId?: string; projectName: string; client: string; amount: number; status: string; dueDate: string; createdAt: string; }
interface Lead { _id: string; name: string; email: string; mobile: string; source: string; status: string; assignedTo?: string; notes?: string; createdAt: string; }
interface Event { _id: string; eventName: string; client: string; date: string; venue?: string; type?: string; status: string; budget?: number; createdAt: string; }

// ─── STATUS COLORS ────────────────────────────────────────────────────────────
const SC: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(255,193,7,0.12)", text: "#FFC107" },
    confirmed: { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
    active: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    approved: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    completed: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    cancelled: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    Pending: { bg: "rgba(255,193,7,0.12)", text: "#FFC107" },
    Approved: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    Contacted: { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
    Closed: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    Quoted: { bg: "rgba(108,99,255,0.12)", text: "#9D97FF" },
    "Advance Paid": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    "In Progress": { bg: "rgba(108,99,255,0.12)", text: "#9D97FF" },
    Review: { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
    Started: { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    Paid: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    "Fully Paid": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    Overdue: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    New: { bg: "rgba(108,99,255,0.12)", text: "#9D97FF" },
    Qualified: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    Lost: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    Planned: { bg: "rgba(108,99,255,0.12)", text: "#9D97FF" },
    Ongoing: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    Completed: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    "Not Started": { bg: "rgba(100,100,120,0.12)", text: "#888899" },
    "On Hold": { bg: "rgba(255,193,7,0.12)", text: "#FFC107" },
    Cancelled: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    User: { bg: "rgba(108,99,255,0.12)", text: "#9D97FF" },
    Admin: { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    Manager: { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    Developer: { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
    Designer: { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    Analyst: { bg: "rgba(78,205,196,0.12)", text: "#4ECDC4" },
    Rental: { bg: "rgba(168,230,207,0.12)", text: "#A8E6CF" },
    // Payment verification statuses
    "Pending Verification": { bg: "rgba(255,193,7,0.15)", text: "#FFD60A" },
    "Payment Approved": { bg: "rgba(0,201,167,0.15)", text: "#00C9A7" },
    "Payment Rejected": { bg: "rgba(255,107,107,0.15)", text: "#FF6B6B" },
    "Not Submitted": { bg: "rgba(100,100,120,0.12)", text: "#888899" },
    "Awaiting Final": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    "Quote": { bg: "rgba(108,99,255,0.12)", text: "#9D97FF" },
    "Payment": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    "Work": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
};

const Badge = ({ s }: { s: string }) => {
    const c = SC[s] || { bg: "#1E1F2A", text: "#888" };
    return (
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: c.bg, color: c.text, fontWeight: 600, whiteSpace: "nowrap" }}>
            {s}
        </span>
    );
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getAuth = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
};
const fmt = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtDT = (d?: string) => d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
const fmtINR = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const fmtK = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : fmtINR(n);
const calcAdvance = (total: number) => Math.round((total * 30) / 100);
const calcFinal = (total: number, advance?: number) => total - (advance || calcAdvance(total));

// ─── API ──────────────────────────────────────────────────────────────────────
const Api = {
    async get<T>(path: string): Promise<T> {
        const r = await fetch(`${API_BASE}${path}`, { headers: { ...getAuth() } });
        if (!r.ok) throw new Error(`${r.status} @ ${path}`);
        return r.json();
    },
    async post<T>(path: string, data: any): Promise<T> {
        const r = await fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuth() },
            body: JSON.stringify(data),
        });
        if (!r.ok) {
            const txt = await r.text();
            throw new Error(`POST ${path}: ${r.status} - ${txt}`);
        }
        return r.json();
    },
    async patch<T>(path: string, data: any): Promise<T> {
        const r = await fetch(`${API_BASE}${path}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...getAuth() },
            body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error(`PATCH ${path}: ${r.status}`);
        const txt = await r.text();
        return txt ? JSON.parse(txt) : ({} as T);
    },
    async delete(path: string) {
        const r = await fetch(`${API_BASE}${path}`, {
            method: "DELETE",
            headers: { ...getAuth() },
        });
        if (!r.ok) throw new Error(`DELETE ${path}: ${r.status}`);
    },
    async smartUpdate(paths: string[], data: any): Promise<{ success: boolean; error?: string }> {
        const methods = ["PATCH", "PUT"] as const;
        const errors: string[] = [];
        for (const path of paths) {
            for (const method of methods) {
                try {
                    const r = await fetch(`${API_BASE}${path}`, {
                        method,
                        headers: { "Content-Type": "application/json", ...getAuth() },
                        body: JSON.stringify(data),
                    });
                    if (r.ok) { console.log(`✅ ${method} ${path} succeeded`); return { success: true }; }
                    const txt = await r.text();
                    errors.push(`${method} ${path}: ${r.status} ${txt}`);
                } catch (e: any) {
                    errors.push(`${method} ${path}: ${e.message}`);
                }
            }
        }
        console.error("smartUpdate: all attempts failed", errors);
        return { success: false, error: errors.join(" | ") };
    },
    async tryList<T>(paths: string[]): Promise<T[]> {
        for (const p of paths) {
            try {
                const d: any = await this.get(p);
                if (Array.isArray(d)) return d;
                const keys = ["data", "orders", "projects", "inquiries", "users", "invoices", "leads", "events", "members", "rentals", "items"];
                for (const key of keys) {
                    if (Array.isArray(d?.[key])) return d[key];
                }
            } catch (e) { console.warn(`tryList failed: ${p}`, e); }
        }
        return [];
    },
};

// ─── DATA HOOK ────────────────────────────────────────────────────────────────
function useData<T>(fn: () => Promise<T[]>, deps: any[] = []) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const load = useCallback(async () => {
        setLoading(true); setError(null);
        try { setData(await fn()); }
        catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    useEffect(() => { load(); }, [load]);
    return { data, loading, error, refetch: load };
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Spinner = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
        <div style={{ width: 32, height: 32, border: "3px solid #1E1F2A", borderTop: "3px solid #6C63FF", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

const Empty = ({ msg }: { msg: string }) => (
    <div style={{ textAlign: "center", padding: 40, color: "#555577" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
        <p style={{ fontSize: 13 }}>{msg}</p>
    </div>
);

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
    return (
        <div style={{ position: "fixed", top: 70, right: 20, zIndex: 9999, background: type === "success" ? "#00C9A7" : "#FF6B6B", color: "#000", padding: "10px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", animation: "fadeIn 0.3s ease" }}>
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
            {type === "success" ? "✓ " : "✕ "}{msg}
        </div>
    );
}

function useToast() {
    const [t, setT] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const show = (msg: string, type: "success" | "error" = "success") => {
        setT({ msg, type });
        setTimeout(() => setT(null), 3500);
    };
    const T = () => (t ? <Toast msg={t.msg} type={t.type} /> : null);
    return { show, T };
}

function Confirm({ msg, onOk, onNo }: { msg: string; onOk: () => void; onNo: () => void }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 12, padding: 24, maxWidth: 360, width: "90%" }}>
                <p style={{ color: "#E8E8EF", fontSize: 14, marginBottom: 20 }}>{msg}</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onNo} style={{ padding: "7px 16px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 6, color: "#888", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <button onClick={onOk} style={{ padding: "7px 16px", background: "#FF6B6B", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

function Table({ cols, rows }: { cols: string[]; rows: (string | React.ReactNode)[][] }) {
    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                    <tr style={{ background: "#0F1017" }}>
                        {cols.map(c => (
                            <th key={c} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                            {row.map((cell, j) => (
                                <td key={j} style={{ padding: "11px 14px", fontSize: 12, color: "#AAAACC" }}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
    return (
        <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, background: color, opacity: 0.07, borderRadius: "0 10px 0 50px" }} />
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
                <span style={{ fontSize: 22 }}>{icon}</span>
            </div>
        </div>
    );
}

function StatusSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
    return (
        <select value={value} onChange={e => onChange(e.target.value)}
            style={{ background: SC[value]?.bg || "#1E1F2A", border: `1px solid ${SC[value]?.text || "#333"}44`, borderRadius: 4, color: SC[value]?.text || "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "3px 6px" }}>
            {options.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ✨ PAYMENT VERIFICATION MODAL ✨ ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function PaymentVerificationModal({
    item,
    paymentType,
    onClose,
    onApprove,
    onReject,
}: {
    item: ServiceInquiry | RentalOrder;
    paymentType: "advance" | "final" | "rental";
    onClose: () => void;
    onApprove: () => Promise<void>;
    onReject: (reason: string) => Promise<void>;
}) {
    const [rejecting, setRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [saving, setSaving] = useState(false);
    const [imageZoom, setImageZoom] = useState(false);

    // Extract relevant payment info based on type
    const getPaymentInfo = () => {
        if (paymentType === "rental") {
            const r = item as RentalOrder;
            return {
                txnId: r.paymentTxnId,
                amount: r.paymentAmount || r.totalPrice,
                submittedAt: r.paymentSubmittedAt,
                screenshotUrl: r.paymentScreenshotUrl,
                method: r.paymentMethod,
                status: r.paymentStatus,
                label: "Rental Payment",
            };
        }
        const s = item as ServiceInquiry;
        if (paymentType === "advance") {
            return {
                txnId: s.advanceTxnId,
                amount: s.advanceAmount || calcAdvance(s.quotedAmount || 0),
                submittedAt: s.advanceSubmittedAt,
                screenshotUrl: s.advanceScreenshotUrl,
                method: s.advancePaymentMethod,
                payerName: s.advancePayerName,
                upiId: s.advanceUpiId,
                status: s.advancePaymentStatus,
                label: "Advance Payment (30%)",
            };
        }
        return {
            txnId: s.finalTxnId,
            amount: s.finalAmount || calcFinal(s.quotedAmount || 0, s.advanceAmount),
            submittedAt: s.finalSubmittedAt,
            screenshotUrl: s.finalScreenshotUrl,
            method: s.finalPaymentMethod,
            payerName: s.finalPayerName,
            upiId: s.finalUpiId,
            status: s.finalPaymentStatus,
            label: "Final Payment (70%)",
        };
    };

    const info = getPaymentInfo();

    const handleApprove = async () => {
        setSaving(true);
        try { await onApprove(); onClose(); }
        finally { setSaving(false); }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) { alert("Please provide a rejection reason"); return; }
        setSaving(true);
        try { await onReject(rejectReason); onClose(); }
        finally { setSaving(false); }
    };

    const QUICK_REJECT_REASONS = [
        "Transaction ID not found",
        "Amount does not match",
        "Screenshot unclear/invalid",
        "Duplicate submission",
        "Payment already reversed",
        "Invalid payment method",
    ];

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            {/* Screenshot zoom overlay */}
            {imageZoom && info.screenshotUrl && (
                <div
                    onClick={() => setImageZoom(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 5000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
                >
                    <img src={info.screenshotUrl} alt="Payment screenshot" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8, boxShadow: "0 0 60px rgba(108,99,255,0.3)" }} />
                    <button onClick={() => setImageZoom(false)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 24, borderRadius: 8, padding: "4px 12px", cursor: "pointer" }}>×</button>
                </div>
            )}

            <div style={{ background: "#13141C", border: "1px solid #2A2B38", borderRadius: 16, padding: 28, maxWidth: 580, width: "100%", maxHeight: "92vh", overflowY: "auto" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #1E1F2A" }}>
                    <div>
                        <h2 style={{ color: "#E8E8EF", fontSize: 17, fontWeight: 700, margin: 0 }}>
                            🔍 Verify Payment
                        </h2>
                        <p style={{ color: "#666688", fontSize: 12, marginTop: 4 }}>{info.label}</p>
                    </div>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#888", fontSize: 22, cursor: "pointer" }}>×</button>
                </div>

                {/* Client Info */}
                <div style={{ background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.15)", borderRadius: 10, padding: 14, marginBottom: 16 }}>
                    <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Client Details</p>
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "5px 14px", fontSize: 12 }}>
                        <span style={{ color: "#666688" }}>Name:</span>
                        <span style={{ color: "#E8E8EF", fontWeight: 600 }}>{item.name}</span>
                        <span style={{ color: "#666688" }}>Email:</span>
                        <span style={{ color: "#6C63FF" }}>{item.email}</span>
                        <span style={{ color: "#666688" }}>Mobile:</span>
                        <span style={{ color: "#E8E8EF" }}>{item.mobile}</span>
                        {"service" in item && (
                            <>
                                <span style={{ color: "#666688" }}>Service:</span>
                                <span style={{ color: "#FFA94D", fontWeight: 600 }}>{(item as ServiceInquiry).service}</span>
                            </>
                        )}
                        {"productName" in item && (
                            <>
                                <span style={{ color: "#666688" }}>Product:</span>
                                <span style={{ color: "#FFA94D", fontWeight: 600 }}>{(item as RentalOrder).productName}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Payment Details */}
                <div style={{
                    background: "linear-gradient(135deg, rgba(0,201,167,0.08), rgba(108,99,255,0.08))",
                    border: "1px solid rgba(0,201,167,0.2)",
                    borderRadius: 12, padding: 16, marginBottom: 16,
                }}>
                    <p style={{ fontSize: 10, color: "#00C9A7", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12, fontWeight: 700 }}>
                        💳 Payment Submission Details
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12 }}>
                            <p style={{ fontSize: 10, color: "#666688", marginBottom: 4 }}>AMOUNT</p>
                            <p style={{ fontSize: 22, fontWeight: 800, color: "#00C9A7" }}>{fmtINR(info.amount)}</p>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 12 }}>
                            <p style={{ fontSize: 10, color: "#666688", marginBottom: 4 }}>SUBMITTED</p>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#E8E8EF" }}>{fmtDT(info.submittedAt)}</p>
                        </div>
                    </div>

                    {/* Transaction ID — highlighted */}
                    <div style={{ background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                        <p style={{ fontSize: 10, color: "#9D97FF", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
                            Transaction / UTR ID
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <code style={{ fontSize: 16, color: "#FFFFFF", fontFamily: "monospace", fontWeight: 700, flex: 1, letterSpacing: "0.05em", wordBreak: "break-all" }}>
                                {info.txnId || "Not provided"}
                            </code>
                            {info.txnId && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(info.txnId!)}
                                    title="Copy"
                                    style={{ background: "rgba(108,99,255,0.2)", border: "1px solid rgba(108,99,255,0.4)", borderRadius: 6, color: "#9D97FF", cursor: "pointer", fontSize: 14, padding: "4px 10px", fontFamily: "inherit" }}
                                >
                                    📋
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Extra fields */}
                    {(info.method || (info as any).payerName || (info as any).upiId) && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {info.method && (
                                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: 8 }}>
                                    <p style={{ fontSize: 9, color: "#555577", marginBottom: 2 }}>PAYMENT METHOD</p>
                                    <p style={{ fontSize: 12, color: "#CCCCE0", fontWeight: 600 }}>{info.method}</p>
                                </div>
                            )}
                            {(info as any).payerName && (
                                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: 8 }}>
                                    <p style={{ fontSize: 9, color: "#555577", marginBottom: 2 }}>PAYER NAME</p>
                                    <p style={{ fontSize: 12, color: "#CCCCE0", fontWeight: 600 }}>{(info as any).payerName}</p>
                                </div>
                            )}
                            {(info as any).upiId && (
                                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: 8, gridColumn: "1/-1" }}>
                                    <p style={{ fontSize: 9, color: "#555577", marginBottom: 2 }}>UPI ID</p>
                                    <p style={{ fontSize: 12, color: "#CCCCE0", fontFamily: "monospace" }}>{(info as any).upiId}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Screenshot */}
                {info.screenshotUrl ? (
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 11, color: "#666688", marginBottom: 8, fontWeight: 600 }}>📸 Payment Screenshot</p>
                        <div
                            onClick={() => setImageZoom(true)}
                            style={{
                                position: "relative", cursor: "zoom-in", borderRadius: 10,
                                overflow: "hidden", border: "1px solid #2A2B38",
                                background: "#0F1017", maxHeight: 220,
                            }}
                        >
                            <img
                                src={info.screenshotUrl}
                                alt="Payment screenshot"
                                style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block" }}
                                onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%231E1F2A' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E"; }}
                            />
                            <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#fff" }}>
                                🔍 Click to zoom
                            </div>
                        </div>
                        <a href={info.screenshotUrl} target="_blank" rel="noreferrer"
                            style={{ fontSize: 11, color: "#6C63FF", display: "inline-block", marginTop: 6 }}>
                            ↗ Open in new tab
                        </a>
                    </div>
                ) : (
                    <div style={{ background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 8, padding: 12, marginBottom: 16, textAlign: "center" }}>
                        <span style={{ fontSize: 20 }}>📷</span>
                        <p style={{ fontSize: 12, color: "#FFC107", marginTop: 4 }}>No screenshot uploaded by client</p>
                        <p style={{ fontSize: 10, color: "#666688" }}>Verify using transaction ID only</p>
                    </div>
                )}

                {/* Verification checklist */}
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #1E1F2A", borderRadius: 10, padding: 14, marginBottom: 18 }}>
                    <p style={{ fontSize: 11, color: "#CCCCE0", fontWeight: 600, marginBottom: 10 }}>✅ Verification Checklist</p>
                    {[
                        "Transaction ID / UTR number is valid",
                        `Amount matches: ${fmtINR(info.amount)}`,
                        "Payment received in company account",
                        "Screenshot matches transaction details",
                    ].map((check, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                            <div style={{ width: 14, height: 14, border: "1px solid #2A2B38", borderRadius: 3, background: "rgba(108,99,255,0.1)", flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: "#AAAACC" }}>{check}</span>
                        </div>
                    ))}
                </div>

                {/* Rejection input */}
                {rejecting && (
                    <div style={{ marginBottom: 16, background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 10, padding: 14 }}>
                        <p style={{ fontSize: 12, color: "#FF6B6B", fontWeight: 600, marginBottom: 10 }}>Rejection Reason</p>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                            {QUICK_REJECT_REASONS.map(r => (
                                <button key={r} onClick={() => setRejectReason(r)}
                                    style={{
                                        fontSize: 10, padding: "4px 10px",
                                        background: rejectReason === r ? "rgba(255,107,107,0.2)" : "#0F1017",
                                        border: `1px solid ${rejectReason === r ? "#FF6B6B" : "#1E1F2A"}`,
                                        borderRadius: 5, color: rejectReason === r ? "#FF6B6B" : "#888",
                                        cursor: "pointer", fontFamily: "inherit",
                                    }}>
                                    {r}
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Or type custom reason…"
                            rows={2}
                            style={{ width: "100%", padding: "8px 10px", background: "#0F1017", border: "1px solid #2A2B38", borderRadius: 7, color: "#E8E8EF", fontSize: 12, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                        />
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                            <button onClick={() => setRejecting(false)} style={{ flex: 1, padding: "8px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 7, color: "#888", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>
                                Cancel
                            </button>
                            <button onClick={handleReject} disabled={saving || !rejectReason.trim()}
                                style={{ flex: 2, padding: "8px", background: "#FF6B6B", border: "none", borderRadius: 7, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 12, opacity: saving ? 0.6 : 1 }}>
                                {saving ? "Rejecting…" : "✕ Confirm Reject & Notify Client"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                {!rejecting && (
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setRejecting(true)}
                            style={{ flex: 1, padding: "11px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.4)", borderRadius: 8, color: "#FF6B6B", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>
                            ✕ Reject
                        </button>
                        <button onClick={handleApprove} disabled={saving}
                            style={{ flex: 2, padding: "11px", background: "linear-gradient(105deg, #00C9A7, #4ECDC4)", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13, opacity: saving ? 0.6 : 1 }}>
                            {saving ? "Approving…" : "✓ Approve Payment"}
                        </button>
                    </div>
                )}

                <p style={{ fontSize: 10, color: "#555577", marginTop: 12, textAlign: "center" }}>
                    Client will be notified automatically after approval/rejection
                </p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ✨ PAYMENT VERIFICATION PANEL ✨ ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function PaymentVerificationPanel() {
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));
    const rentals = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"]));
    const [verifyModal, setVerifyModal] = useState<{
        item: ServiceInquiry | RentalOrder;
        type: "advance" | "final" | "rental";
    } | null>(null);
    const [filterTab, setFilterTab] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const { show, T } = useToast();

    // Collect all pending payment verifications
    const servicePayments: Array<{
        item: ServiceInquiry;
        type: "advance" | "final";
        txnId: string;
        amount: number;
        status: string;
        submittedAt?: string;
    }> = [];

    inquiries.data.forEach(inq => {
        if (inq.advanceTxnId && inq.advancePaymentStatus) {
            servicePayments.push({
                item: inq, type: "advance",
                txnId: inq.advanceTxnId,
                amount: inq.advanceAmount || calcAdvance(inq.quotedAmount || 0),
                status: inq.advancePaymentStatus,
                submittedAt: inq.advanceSubmittedAt,
            });
        }
        if (inq.finalTxnId && inq.finalPaymentStatus) {
            servicePayments.push({
                item: inq, type: "final",
                txnId: inq.finalTxnId,
                amount: inq.finalAmount || calcFinal(inq.quotedAmount || 0, inq.advanceAmount),
                status: inq.finalPaymentStatus,
                submittedAt: inq.finalSubmittedAt,
            });
        }
    });

    const rentalPayments = rentals.data.filter(r => r.paymentTxnId && r.paymentStatus);

    const allPayments = [
        ...servicePayments.map(p => ({
            key: `${p.item._id}-${p.type}`,
            clientName: p.item.name,
            clientEmail: p.item.email,
            service: p.item.service,
            txnId: p.txnId,
            amount: p.amount,
            status: p.status,
            submittedAt: p.submittedAt,
            paymentType: p.type === "advance" ? "Advance (30%)" : "Final (70%)",
            item: p.item as ServiceInquiry | RentalOrder,
            modalType: p.type as "advance" | "final" | "rental",
            hasScreenshot: !!p.item.advanceScreenshotUrl || !!p.item.finalScreenshotUrl,
        })),
        ...rentalPayments.map(r => ({
            key: r._id,
            clientName: r.name,
            clientEmail: r.email,
            service: r.productName,
            txnId: r.paymentTxnId!,
            amount: r.paymentAmount || r.totalPrice,
            status: r.paymentStatus!,
            submittedAt: r.paymentSubmittedAt,
            paymentType: "Rental",
            item: r as ServiceInquiry | RentalOrder,
            modalType: "rental" as const,
            hasScreenshot: !!r.paymentScreenshotUrl,
        })),
    ];

    const filtered = allPayments.filter(p => {
        if (filterTab === "all") return true;
        if (filterTab === "pending") return p.status === "pending_verification";
        if (filterTab === "approved") return p.status === "approved";
        if (filterTab === "rejected") return p.status === "rejected";
        return true;
    });

    const pendingCount = allPayments.filter(p => p.status === "pending_verification").length;
    const approvedCount = allPayments.filter(p => p.status === "approved").length;
    const rejectedCount = allPayments.filter(p => p.status === "rejected").length;
    const totalApproved = allPayments.filter(p => p.status === "approved").reduce((s, p) => s + p.amount, 0);

    // ─── Approve payment ───────────────────────────────────────────────────────
    const approvePayment = async (item: ServiceInquiry | RentalOrder, type: "advance" | "final" | "rental") => {
        const now = new Date().toISOString();

        if (type === "rental") {
            const result = await Api.smartUpdate(
                [`/api/rental-inquiry/${item._id}`, `/api/rental-inquiries/${item._id}`],
                { paymentStatus: "approved", paymentApprovedAt: now, status: "confirmed" }
            );
            if (result.success) { show("✓ Rental payment approved!"); rentals.refetch(); }
            else show("Failed to approve", "error");
            return;
        }

        const updateData = type === "advance"
            ? {
                advancePaymentStatus: "verified",
                advancePaid: true,
                advanceVerified: true,
                advancePaidAt: now,
                advanceVerifiedAt: now,
                advanceRejected: false,
                advanceRejectionReason: "",
                status: "processing",
            }
            : {
                finalPaymentStatus: "verified",
                finalPaid: true,
                finalVerified: true,
                finalPaidAt: now,
                finalVerifiedAt: now,
                finalRejected: false,
                finalRejectionReason: "",
                status: "completed",
            };

        const result = await Api.smartUpdate(
            [
                `/api/orders/${item._id}`,
                `/api/service-inquiry/${item._id}`,
                `/api/service-inquiries/${item._id}`,
            ],
            updateData
        );
        if (result.success) { show(`✓ ${type === "advance" ? "Advance" : "Final"} payment approved!`); inquiries.refetch(); }
        else show("Failed to approve", "error");
    };

    // ─── Reject payment ────────────────────────────────────────────────────────
    const rejectPayment = async (item: ServiceInquiry | RentalOrder, type: "advance" | "final" | "rental", reason: string) => {
        const now = new Date().toISOString();

        if (type === "rental") {
            const result = await Api.smartUpdate(
                [`/api/rental-inquiry/${item._id}`, `/api/rental-inquiries/${item._id}`],
                { paymentStatus: "rejected", paymentRejectionReason: reason, paymentRejectedAt: now }
            );
            if (result.success) { show("Payment rejected — client notified", "error"); rentals.refetch(); }
            else show("Failed to reject", "error");
            return;
        }

        const updateData = type === "advance"
            ? { advancePaymentStatus: "rejected", advanceRejectionReason: reason, advanceRejectedAt: now }
            : { finalPaymentStatus: "rejected", finalRejectionReason: reason, finalRejectedAt: now };

        const result = await Api.smartUpdate(
            [`/api/service-inquiry/${item._id}`, `/api/service-inquiries/${item._id}`],
            updateData
        );
        if (result.success) { show("Payment rejected — client notified", "error"); inquiries.refetch(); }
        else show("Failed to reject", "error");
    };

    if (inquiries.loading || rentals.loading) return <Spinner />;

    const TAB_STYLE = (active: boolean, color = "#6C63FF") => ({
        padding: "7px 16px",
        background: active ? `${color}22` : "transparent",
        border: `1px solid ${active ? color : "#1E1F2A"}`,
        borderRadius: 7,
        color: active ? color : "#666688",
        fontSize: 12,
        fontWeight: active ? 700 : 400,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
    });

    return (
        <div>
            <T />
            {verifyModal && (
                <PaymentVerificationModal
                    item={verifyModal.item}
                    paymentType={verifyModal.type}
                    onClose={() => setVerifyModal(null)}
                    onApprove={async () => { await approvePayment(verifyModal.item, verifyModal.type); setVerifyModal(null); }}
                    onReject={async (reason) => { await rejectPayment(verifyModal.item, verifyModal.type, reason); setVerifyModal(null); }}
                />
            )}

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
                <StatCard label="Pending Review" value={pendingCount} color="#FFD60A" icon="⏳" />
                <StatCard label="Approved" value={approvedCount} color="#00C9A7" icon="✅" />
                <StatCard label="Rejected" value={rejectedCount} color="#FF6B6B" icon="✕" />
                <StatCard label="Total Approved ₹" value={fmtK(totalApproved)} color="#6C63FF" icon="💰" />
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <button style={TAB_STYLE(filterTab === "pending", "#FFD60A")} onClick={() => setFilterTab("pending")}>
                    ⏳ Pending ({pendingCount})
                </button>
                <button style={TAB_STYLE(filterTab === "all")} onClick={() => setFilterTab("all")}>
                    All ({allPayments.length})
                </button>
                <button style={TAB_STYLE(filterTab === "approved", "#00C9A7")} onClick={() => setFilterTab("approved")}>
                    ✅ Approved ({approvedCount})
                </button>
                <button style={TAB_STYLE(filterTab === "rejected", "#FF6B6B")} onClick={() => setFilterTab("rejected")}>
                    ✕ Rejected ({rejectedCount})
                </button>
                <button onClick={() => { inquiries.refetch(); rentals.refetch(); }}
                    style={{ marginLeft: "auto", fontSize: 11, color: "#6C63FF", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                    ↻ Refresh
                </button>
            </div>

            {/* Alert banner for pending */}
            {pendingCount > 0 && filterTab === "pending" && (
                <div style={{
                    background: "rgba(255,214,10,0.08)", border: "1px solid rgba(255,214,10,0.3)",
                    borderRadius: 10, padding: "12px 16px", marginBottom: 16,
                    display: "flex", alignItems: "center", gap: 10,
                }}>
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <div>
                        <p style={{ fontSize: 13, color: "#FFD60A", fontWeight: 700 }}>
                            {pendingCount} payment{pendingCount > 1 ? "s" : ""} awaiting verification
                        </p>
                        <p style={{ fontSize: 11, color: "#888" }}>Review transaction IDs and screenshots to approve or reject</p>
                    </div>
                </div>
            )}

            {/* Payments Table */}
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>
                        Payment Submissions ({filtered.length})
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <Empty msg={filterTab === "pending" ? "No pending payments 🎉" : "No payments in this category"} />
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                            <thead>
                                <tr style={{ background: "#0F1017" }}>
                                    {["Submitted", "Client", "Service", "Type", "Amount", "Transaction ID", "Screenshot", "Status", "Action"].map(c => (
                                        <th key={c} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => (
                                    <tr key={p.key} style={{
                                        borderTop: "1px solid #1A1B24",
                                        background: p.status === "pending_verification"
                                            ? "rgba(255,214,10,0.03)"
                                            : i % 2 === 0 ? "transparent" : "#0D0E14",
                                    }}>
                                        <td style={{ padding: "11px 14px", fontSize: 11, color: "#666688" }}>{fmtDT(p.submittedAt)}</td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <p style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{p.clientName}</p>
                                            <p style={{ fontSize: 10, color: "#6C63FF" }}>{p.clientEmail}</p>
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <span style={{ fontSize: 11, color: "#FFA94D", fontWeight: 600 }}>{p.service}</span>
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <span style={{
                                                fontSize: 10, padding: "3px 8px", borderRadius: 4,
                                                background: p.paymentType === "Advance (30%)" ? "rgba(255,165,61,0.12)" : p.paymentType === "Final (70%)" ? "rgba(108,99,255,0.12)" : "rgba(78,205,196,0.12)",
                                                color: p.paymentType === "Advance (30%)" ? "#FFA94D" : p.paymentType === "Final (70%)" ? "#9D97FF" : "#4ECDC4",
                                                fontWeight: 600,
                                            }}>
                                                {p.paymentType}
                                            </span>
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#00C9A7" }}>{fmtINR(p.amount)}</span>
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <code style={{
                                                    fontSize: 11, color: "#FFFFFF", fontFamily: "monospace",
                                                    background: "rgba(108,99,255,0.12)", padding: "3px 8px",
                                                    borderRadius: 5, letterSpacing: "0.03em", maxWidth: 140,
                                                    display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                                    verticalAlign: "middle",
                                                }} title={p.txnId}>
                                                    {p.txnId}
                                                </code>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(p.txnId)}
                                                    title="Copy TXN ID"
                                                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, opacity: 0.7, padding: 0 }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            {p.hasScreenshot ? (
                                                <span style={{ fontSize: 10, color: "#00C9A7", background: "rgba(0,201,167,0.1)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                                                    ✓ Uploaded
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>None</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            {p.status === "pending_verification" && (
                                                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "rgba(255,214,10,0.15)", color: "#FFD60A", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD60A", display: "inline-block", animation: "pulse 1.5s ease infinite" }} />
                                                    Pending
                                                    <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }`}</style>
                                                </span>
                                            )}
                                            {p.status === "approved" && <Badge s="Payment Approved" />}
                                            {p.status === "rejected" && <Badge s="Payment Rejected" />}
                                        </td>
                                        <td style={{ padding: "11px 14px" }}>
                                            {p.status === "pending_verification" ? (
                                                <button
                                                    onClick={() => setVerifyModal({ item: p.item, type: p.modalType })}
                                                    style={{
                                                        fontSize: 11, color: "#fff",
                                                        background: "linear-gradient(105deg, #FFD60A, #FFA94D)",
                                                        border: "none", borderRadius: 6,
                                                        padding: "7px 14px", cursor: "pointer",
                                                        fontFamily: "inherit", fontWeight: 700,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    🔍 Verify
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setVerifyModal({ item: p.item, type: p.modalType })}
                                                    style={{
                                                        fontSize: 11, color: "#888",
                                                        background: "transparent",
                                                        border: "1px solid #2A2B38",
                                                        borderRadius: 6, padding: "5px 12px",
                                                        cursor: "pointer", fontFamily: "inherit",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    👁 View
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── QUOTATION MODAL ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function QuotationModal({
    inquiry, onClose, onSubmit,
}: {
    inquiry: ServiceInquiry; onClose: () => void; onSubmit: (amount: number, notes: string) => Promise<void>;
}) {
    const [amount, setAmount] = useState<string>(inquiry.quotedAmount?.toString() || "");
    const [notes, setNotes] = useState<string>(inquiry.adminNotes || "");
    const [saving, setSaving] = useState(false);
    const numAmount = parseFloat(amount) || 0;
    const advanceAmt = calcAdvance(numAmount);
    const finalAmt = calcFinal(numAmount);

    const handleSubmit = async () => {
        if (numAmount < 100) { alert("Minimum ₹100"); return; }
        setSaving(true);
        try { await onSubmit(numAmount, notes); onClose(); }
        finally { setSaving(false); }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#13141C", border: "1px solid #2A2B38", borderRadius: 14, padding: 26, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
                <div style={{ marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <h2 style={{ color: "#E8E8EF", fontSize: 17, fontWeight: 700, margin: 0 }}>💼 Send Quotation</h2>
                        <p style={{ color: "#666688", fontSize: 12, marginTop: 4 }}>Approve this project and set the price</p>
                    </div>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#888", fontSize: 22, cursor: "pointer" }}>×</button>
                </div>
                <div style={{ background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.15)", borderRadius: 10, padding: 14, marginBottom: 18 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", fontSize: 12 }}>
                        <span style={{ color: "#666688" }}>Name:</span><span style={{ color: "#E8E8EF", fontWeight: 600 }}>{inquiry.name}</span>
                        <span style={{ color: "#666688" }}>Email:</span><span style={{ color: "#6C63FF" }}>{inquiry.email}</span>
                        <span style={{ color: "#666688" }}>Service:</span><span style={{ color: "#FFA94D", fontWeight: 600 }}>{inquiry.service}</span>
                        <span style={{ color: "#666688" }}>Timeline:</span><span style={{ color: "#E8E8EF" }}>{inquiry.timeline}</span>
                    </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", color: "#CCCCE0", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Project Quote Amount (₹) *</label>
                    <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#666688", fontSize: 16, fontWeight: 700 }}>₹</span>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 30000" min="100" autoFocus
                            style={{ width: "100%", padding: "12px 14px 12px 32px", background: "#0F1017", border: "1px solid #2A2B38", borderRadius: 8, color: "#E8E8EF", fontSize: 18, fontWeight: 600, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                    </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {[10000, 20000, 30000, 50000, 75000, 100000].map(v => (
                            <button key={v} onClick={() => setAmount(v.toString())}
                                style={{ padding: "5px 12px", background: numAmount === v ? "rgba(108,99,255,0.2)" : "#0F1017", border: `1px solid ${numAmount === v ? "#6C63FF" : "#1E1F2A"}`, borderRadius: 6, color: numAmount === v ? "#9D97FF" : "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {fmtK(v)}
                            </button>
                        ))}
                    </div>
                </div>
                {numAmount >= 100 && (
                    <div style={{ background: "linear-gradient(135deg, rgba(0,201,167,0.08), rgba(108,99,255,0.08))", border: "1px solid rgba(0,201,167,0.25)", borderRadius: 10, padding: 14, marginBottom: 18 }}>
                        <p style={{ fontSize: 10, color: "#00C9A7", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>💰 Payment Breakdown</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                            <div style={{ background: "rgba(255,165,61,0.1)", border: "1px solid rgba(255,165,61,0.25)", borderRadius: 8, padding: 12 }}>
                                <p style={{ fontSize: 10, color: "#FFA94D", fontWeight: 600 }}>ADVANCE (30%)</p>
                                <p style={{ fontSize: 20, color: "#FFA94D", fontWeight: 800, marginTop: 4 }}>{fmtINR(advanceAmt)}</p>
                            </div>
                            <div style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.25)", borderRadius: 8, padding: 12 }}>
                                <p style={{ fontSize: 10, color: "#9D97FF", fontWeight: 600 }}>FINAL (70%)</p>
                                <p style={{ fontSize: 20, color: "#9D97FF", fontWeight: 800, marginTop: 4 }}>{fmtINR(finalAmt)}</p>
                            </div>
                        </div>
                        <div style={{ paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, color: "#CCCCE0", fontWeight: 600 }}>Total:</span>
                            <span style={{ fontSize: 16, color: "#00C9A7", fontWeight: 800 }}>{fmtINR(numAmount)}</span>
                        </div>
                    </div>
                )}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", color: "#CCCCE0", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Notes for Client (Optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                        style={{ width: "100%", padding: "10px 12px", background: "#0F1017", border: "1px solid #2A2B38", borderRadius: 8, color: "#E8E8EF", fontSize: 12, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 7, color: "#888", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={saving || numAmount < 100}
                        style={{ padding: "10px 24px", background: numAmount >= 100 ? "linear-gradient(105deg, #00C9A7, #6C63FF)" : "rgba(108,99,255,0.3)", border: "none", borderRadius: 7, color: "#fff", fontWeight: 700, cursor: numAmount >= 100 ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 12, opacity: saving ? 0.6 : 1 }}>
                        {saving ? "Sending…" : "✓ Approve & Send Quote"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── WORK COMPLETE MODAL ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function WorkCompleteModal({ inquiry, onClose, onSubmit }: { inquiry: ServiceInquiry; onClose: () => void; onSubmit: () => Promise<void> }) {
    const [saving, setSaving] = useState(false);
    const handleSubmit = async () => {
        setSaving(true);
        try { await onSubmit(); onClose(); }
        finally { setSaving(false); }
    };
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#13141C", border: "1px solid #2A2B38", borderRadius: 14, padding: 26, maxWidth: 440, width: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
                    <h2 style={{ color: "#E8E8EF", fontSize: 17, fontWeight: 700 }}>Mark Work as Completed?</h2>
                    <p style={{ color: "#888", fontSize: 12 }}>Notify client to pay the remaining 70%</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 7, color: "#888", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={saving}
                        style={{ flex: 2, padding: "10px", background: "linear-gradient(105deg, #00C9A7, #4ECDC4)", border: "none", borderRadius: 7, color: "#000", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
                        {saving ? "Marking…" : "✓ Mark Complete & Notify"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── DASHBOARD PANEL ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardPanel({ sub }: { sub: string }) {
    const rentals = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));
    const projects = useData<Project>(() => Api.tryList(["/api/projects", "/api/web-projects"]));
    const users = useData<User>(() => Api.tryList(["/api/users", "/api/admin/users"]));

    const totalQuoted = inquiries.data.reduce((s, i) => s + (i.quotedAmount || 0), 0);
    const totalCollected = inquiries.data.reduce((s, i) => s + (i.advanceAmount || 0) + (i.finalAmount || 0), 0);
    const rentalRevenue = rentals.data.reduce((s, r) => s + (r.totalPrice || 0), 0);
    const activeProj = projects.data.filter(p => p.status === "In Progress").length;
    const pendingRental = rentals.data.filter(r => r.status === "pending").length;
    const pendingQuotes = inquiries.data.filter(i => !i.quotedAmount).length;

    // Count all pending payment verifications
    const pendingVerifications =
        inquiries.data.filter(i => i.advancePaymentStatus === "pending_verification" || i.finalPaymentStatus === "pending_verification").length +
        rentals.data.filter(r => r.paymentStatus === "pending_verification").length;

    if (rentals.loading && inquiries.loading) return <Spinner />;

    if (sub === "Overview" || sub === "Analytics Overview" || sub === "Recent Activities") {
        return (
            <div>
                {pendingVerifications > 0 && (
                    <div style={{ background: "rgba(255,214,10,0.08)", border: "1px solid rgba(255,214,10,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 22 }}>⚠️</span>
                        <div>
                            <p style={{ fontSize: 13, color: "#FFD60A", fontWeight: 700 }}>
                                {pendingVerifications} payment{pendingVerifications > 1 ? "s" : ""} pending verification!
                            </p>
                            <p style={{ fontSize: 11, color: "#888" }}>Go to Website → Payment Verification or Rental → Payment Verification</p>
                        </div>
                    </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
                    <StatCard label="Total Revenue" value={fmtK(rentalRevenue + totalCollected)} color="#6C63FF" icon="💰" />
                    <StatCard label="Quoted (Pipeline)" value={fmtK(totalQuoted)} color="#FFA94D" icon="📋" />
                    <StatCard label="Collected" value={fmtK(totalCollected)} color="#00C9A7" icon="✅" />
                    <StatCard label="Pending Verifications" value={pendingVerifications} color="#FFD60A" icon="🔍" />
                    <StatCard label="Pending Quotes" value={pendingQuotes} color="#FF6B6B" icon="⏳" />
                    <StatCard label="Active Projects" value={activeProj} color="#9D97FF" icon="🔄" />
                    <StatCard label="Rental Orders" value={rentals.data.length} color="#4ECDC4" icon="📷" />
                    <StatCard label="Total Users" value={users.data.length} color="#A8E6CF" icon="👥" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 12 }}>Recent Rental Orders</h3>
                        {rentals.data.slice(0, 6).map(r => (
                            <div key={r._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1A1B24", gap: 8 }}>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <p style={{ fontSize: 11, fontWeight: 500, color: "#D0D0E8" }}>{r.name}</p>
                                    <p style={{ fontSize: 10, color: "#555577" }}>{r.productName} · {r.rentalDays}d</p>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "#6C63FF" }}>{fmtINR(r.totalPrice)}</p>
                                    <Badge s={r.paymentStatus === "pending_verification" ? "Pending Verification" : r.status} />
                                </div>
                            </div>
                        ))}
                        {rentals.data.length === 0 && <Empty msg="No rental orders yet" />}
                    </div>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 12 }}>Recent Service Inquiries</h3>
                        {inquiries.data.slice(0, 6).map(q => (
                            <div key={q._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1A1B24", gap: 8 }}>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <p style={{ fontSize: 11, fontWeight: 500, color: "#D0D0E8" }}>{q.name}</p>
                                    <p style={{ fontSize: 10, color: "#555577" }}>{q.service}</p>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    {q.quotedAmount ? <p style={{ fontSize: 11, fontWeight: 600, color: "#00C9A7" }}>{fmtINR(q.quotedAmount)}</p> : <p style={{ fontSize: 9, color: "#FF6B6B" }}>Not quoted</p>}
                                    {(q.advancePaymentStatus === "pending_verification" || q.finalPaymentStatus === "pending_verification") ? (
                                        <Badge s="Pending Verification" />
                                    ) : (
                                        <Badge s={q.status} />
                                    )}
                                </div>
                            </div>
                        ))}
                        {inquiries.data.length === 0 && <Empty msg="No inquiries yet" />}
                    </div>
                </div>
            </div>
        );
    }
    return <Empty msg={`${sub} — data loading from backend`} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── RENTAL PANEL ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function RentalPanel({ sub }: { sub: string }) {
    const { data, loading, error, refetch } = useData<RentalOrder>(() =>
        Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"])
    );
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [confirm, setConfirm] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const { show, T } = useToast();
    const RENTAL_STATUS_OPTIONS = ["pending", "confirmed", "active", "completed", "cancelled"];

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id);
        const result = await Api.smartUpdate(
            [`/api/rental-inquiry/${id}`, `/api/rental-inquiry/${id}/status`, `/api/rental-inquiries/${id}`],
            { status }
        );
        if (result.success) { show(`Status → ${status}`); refetch(); }
        else show("Update failed", "error");
        setUpdating(null);
    };

    const handleDelete = async (id: string) => {
        try { await Api.delete(`/api/rental-inquiry/${id}`); show("Deleted"); refetch(); }
        catch { try { await Api.delete(`/api/rental-inquiries/${id}`); show("Deleted"); refetch(); } catch { show("Delete failed", "error"); } }
    };

    if (loading) return <Spinner />;
    if (error) return <Empty msg={`Error: ${error}`} />;

    // Payment verification sub
    if (sub === "Payment Verification") {
        return <PaymentVerificationPanel />;
    }

    const filtered = data
        .filter(o => filter === "All" || o.status === filter)
        .filter(o => !search || o.name?.toLowerCase().includes(search.toLowerCase()) || o.productName?.toLowerCase().includes(search.toLowerCase()));

    const pendingVerifications = data.filter(r => r.paymentStatus === "pending_verification").length;

    if (sub === "Products Inventory" || sub === "Bookings / Orders" || sub === "Rental Requests") {
        return (
            <div>
                <T />
                {confirm && <Confirm msg="Delete this rental order?" onOk={() => { handleDelete(confirm); setConfirm(null); }} onNo={() => setConfirm(null)} />}

                {pendingVerifications > 0 && (
                    <div style={{ background: "rgba(255,214,10,0.08)", border: "1px solid rgba(255,214,10,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>⚠️</span>
                        <span style={{ fontSize: 12, color: "#FFD60A", fontWeight: 600 }}>
                            {pendingVerifications} rental payment{pendingVerifications > 1 ? "s" : ""} pending verification
                        </span>
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Orders" value={data.length} color="#6C63FF" icon="📷" />
                    <StatCard label="Total Revenue" value={fmtK(data.reduce((s, o) => s + (o.totalPrice || 0), 0))} color="#00C9A7" icon="💰" />
                    <StatCard label="Pending" value={data.filter(o => o.status === "pending").length} color="#FFA94D" icon="⏳" />
                    <StatCard label="Verify Payments" value={pendingVerifications} color="#FFD60A" icon="🔍" />
                </div>

                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", flex: 1 }}>Rental Orders ({filtered.length})</span>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                            style={{ padding: "5px 10px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, outline: "none", width: 180, fontFamily: "inherit" }} />
                        <select value={filter} onChange={e => setFilter(e.target.value)}
                            style={{ padding: "5px 10px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, fontFamily: "inherit" }}>
                            {["All", ...RENTAL_STATUS_OPTIONS].map(s => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
                        </select>
                        <button onClick={refetch} style={{ fontSize: 11, color: "#6C63FF", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>↻ Refresh</button>
                    </div>
                    <Table
                        cols={["Date", "Customer", "Product", "Days", "Total", "Payment", "Status", "Actions"]}
                        rows={filtered.map(o => [
                            fmtDT(o.createdAt),
                            <div>
                                <p style={{ fontWeight: 500, color: "#D0D0E8", fontSize: 12 }}>{o.name}</p>
                                <p style={{ fontSize: 10, color: "#555577" }}>{o.email}</p>
                            </div>,
                            o.productName,
                            `${o.rentalDays}d`,
                            <span style={{ color: "#6C63FF", fontWeight: 600 }}>{fmtINR(o.totalPrice)}</span>,
                            // Payment verification status column
                            o.paymentTxnId ? (
                                <div>
                                    {o.paymentStatus === "pending_verification" && (
                                        <span style={{ fontSize: 10, color: "#FFD60A", background: "rgba(255,214,10,0.1)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                                            ⏳ Verifying
                                        </span>
                                    )}
                                    {o.paymentStatus === "approved" && (
                                        <span style={{ fontSize: 10, color: "#00C9A7", background: "rgba(0,201,167,0.1)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                                            ✓ Verified
                                        </span>
                                    )}
                                    {o.paymentStatus === "rejected" && (
                                        <span style={{ fontSize: 10, color: "#FF6B6B", background: "rgba(255,107,107,0.1)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                                            ✕ Rejected
                                        </span>
                                    )}
                                    <p style={{ fontSize: 9, color: "#555577", fontFamily: "monospace", marginTop: 2 }}>
                                        {o.paymentTxnId?.slice(0, 12)}…
                                    </p>
                                </div>
                            ) : <span style={{ fontSize: 10, color: "#444", fontStyle: "italic" }}>No payment</span>,
                            updating === o._id ? "Saving…" : <StatusSelect value={o.status} options={RENTAL_STATUS_OPTIONS} onChange={v => updateStatus(o._id, v)} />,
                            <button onClick={() => setConfirm(o._id)}
                                style={{ fontSize: 10, color: "#FF6B6B", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>
                                Del
                            </button>,
                        ])}
                    />
                    {filtered.length === 0 && <Empty msg="No orders match" />}
                </div>
            </div>
        );
    }
    return <Empty msg={`${sub} — select sub-section above`} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── WEBSITE PANEL ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function WebsitePanel({ sub }: { sub: string }) {
    const projects = useData<Project>(() => Api.tryList(["/api/projects", "/api/web-projects"]));
    const requests = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));
    const invoices = useData<Invoice>(() => Api.tryList(["/api/invoices", "/api/web-invoices"]));
    const [updating, setUpdating] = useState<string | null>(null);
    const [quoteModal, setQuoteModal] = useState<ServiceInquiry | null>(null);
    const [completeModal, setCompleteModal] = useState<ServiceInquiry | null>(null);
    const { show, T } = useToast();
    const PROJECT_STATUS_OPTIONS = ["Not Started", "Started", "In Progress", "Review", "Completed", "On Hold", "Cancelled"];

    // Route to payment verification panel
    if (sub === "Payment Verification") {
        return <PaymentVerificationPanel />;
    }

    const sendQuotation = async (id: string, amount: number, notes: string) => {
        const result = await Api.smartUpdate(
            [`/api/service-inquiry/${id}`, `/api/service-inquiries/${id}`],
            { quotedAmount: amount, amount, adminNotes: notes, status: "approved", quoteSentAt: new Date().toISOString() }
        );
        if (result.success) { show(`✓ Quote sent: ${fmtINR(amount)}`); requests.refetch(); }
        else show("Failed to send quote", "error");
    };

    const markWorkComplete = async (id: string) => {
        const result = await Api.smartUpdate(
            [
                `/api/orders/${id}/work-complete`,
                `/api/orders/${id}`,
                `/api/service-inquiry/${id}`,
                `/api/service-inquiries/${id}`,
            ],
            {
                workCompleted: true,
                status: "work_completed",
            }
        );

        if (result.success) {
            show("✓ Work marked complete. Client can now pay final amount.");
            requests.refetch();
        } else {
            show("Failed to mark work complete", "error");
        }
    };

    const updateProjStatus = async (id: string, status: string) => {
        setUpdating(id);
        const result = await Api.smartUpdate([`/api/projects/${id}`, `/api/web-projects/${id}`], { status });
        if (result.success) { show(`Project → ${status}`); projects.refetch(); }
        else show("Update failed", "error");
        setUpdating(null);
    };

    const updateInvoiceStatus = async (id: string, status: string) => {
        const result = await Api.smartUpdate([`/api/invoices/${id}`, `/api/web-invoices/${id}`], { status });
        if (result.success) { show(`Invoice → ${status}`); invoices.refetch(); }
        else show("Update failed", "error");
    };

    if (projects.loading && requests.loading) return <Spinner />;

    const data = projects.data;
    const totalBudget = data.reduce((s, p) => s + (p.budget || 0), 0);
    const inProgress = data.filter(p => p.status === "In Progress").length;
    const completed = data.filter(p => p.status === "Completed").length;

    // Count pending payment verifications for banner
    const pendingVerifications = requests.data.filter(r =>
        r.advancePaymentStatus === "pending_verification" || r.finalPaymentStatus === "pending_verification"
    ).length;

    const PendingBanner = () => pendingVerifications > 0 ? (
        <div style={{ background: "rgba(255,214,10,0.08)", border: "1px solid rgba(255,214,10,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠️</span>
            <span style={{ fontSize: 12, color: "#FFD60A", fontWeight: 600 }}>
                {pendingVerifications} payment{pendingVerifications > 1 ? "s" : ""} awaiting verification — go to Payment Verification tab
            </span>
        </div>
    ) : null;

    if (sub === "Quotations") {
        const quoted = requests.data.filter(r => r.quotedAmount && r.quotedAmount > 0);
        const totalQuoted = quoted.reduce((s, r) => s + (r.quotedAmount || 0), 0);
        const advanceCollected = quoted.filter(r => r.advancePaid).reduce((s, r) => s + (r.advanceAmount || 0), 0);
        const finalCollected = quoted.filter(r => r.finalPaid).reduce((s, r) => s + (r.finalAmount || 0), 0);
        return (
            <div>
                <T />
                <PendingBanner />
                {quoteModal && (
                    <QuotationModal inquiry={quoteModal} onClose={() => setQuoteModal(null)}
                        onSubmit={async (amount, notes) => { await sendQuotation(quoteModal._id, amount, notes); }} />
                )}
                {completeModal && (
                    <WorkCompleteModal inquiry={completeModal} onClose={() => setCompleteModal(null)}
                        onSubmit={async () => { await markWorkComplete(completeModal._id); }} />
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Quotes" value={quoted.length} color="#6C63FF" icon="📋" />
                    <StatCard label="Quoted Amount" value={fmtK(totalQuoted)} color="#FFA94D" icon="💼" />
                    <StatCard label="Advance Received" value={fmtK(advanceCollected)} color="#00C9A7" icon="💰" />
                    <StatCard label="Pending Verify" value={pendingVerifications} color="#FFD60A" icon="🔍" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Active Quotations ({quoted.length})</span>
                        <button onClick={requests.refetch} style={{ fontSize: 11, color: "#6C63FF", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>↻ Refresh</button>
                    </div>
                    <Table
                        cols={["Client", "Service", "Quoted", "Advance", "Final", "Payment Status", "Actions"]}
                        rows={quoted.map(q => {
                            const advance = q.advanceAmount || calcAdvance(q.quotedAmount || 0);
                            const final = calcFinal(q.quotedAmount || 0, q.advanceAmount);
                            const advStatus = q.advancePaymentStatus;
                            const finStatus = q.finalPaymentStatus;

                            return [
                                <div>
                                    <p style={{ fontWeight: 500, color: "#D0D0E8", fontSize: 12 }}>{q.name}</p>
                                    <p style={{ fontSize: 10, color: "#555577" }}>{q.email}</p>
                                </div>,
                                <span style={{ fontSize: 11, color: "#FFA94D", fontWeight: 600 }}>{q.service}</span>,
                                <span style={{ color: "#9D97FF", fontWeight: 700 }}>{fmtINR(q.quotedAmount || 0)}</span>,
                                <div>
                                    <span style={{ color: q.advancePaid ? "#00C9A7" : "#FFA94D", fontWeight: 600 }}>
                                        {q.advancePaid ? "✓ " : ""}{fmtINR(advance)}
                                    </span>
                                    {advStatus === "pending_verification" && (
                                        <span style={{ display: "block", fontSize: 9, color: "#FFD60A", marginTop: 2 }}>⏳ Verifying TXN</span>
                                    )}
                                    {advStatus === "rejected" && (
                                        <span style={{ display: "block", fontSize: 9, color: "#FF6B6B", marginTop: 2 }}>✕ Rejected</span>
                                    )}
                                </div>,
                                <div>
                                    <span style={{ color: q.finalPaid ? "#00C9A7" : "#888", fontWeight: 600 }}>
                                        {q.finalPaid ? "✓ " : ""}{fmtINR(final)}
                                    </span>
                                    {finStatus === "pending_verification" && (
                                        <span style={{ display: "block", fontSize: 9, color: "#FFD60A", marginTop: 2 }}>⏳ Verifying TXN</span>
                                    )}
                                </div>,
                                // Combined payment status
                                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    {advStatus === "pending_verification" && <Badge s="Pending Verification" />}
                                    {advStatus === "approved" && !q.finalPaid && <Badge s="Advance Paid" />}
                                    {finStatus === "pending_verification" && <Badge s="Pending Verification" />}
                                    {q.finalPaid && <Badge s="Fully Paid" />}
                                    {!advStatus && !q.advancePaid && !q.finalPaid && <Badge s="Quoted" />}
                                </div>,
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    <button onClick={() => setQuoteModal(q)}
                                        style={{ fontSize: 11, color: "#fff", background: "linear-gradient(105deg, #00C9A7, #4ECDC4)", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                                        💼 Quote
                                    </button>
                                    {(
                                        q.advancePaid ||
                                        q.advanceVerified ||
                                        q.advancePaymentStatus === "approved" ||
                                        q.advancePaymentStatus === "verified"
                                    ) && !q.workCompleted && (
                                            <button
                                                onClick={() => setCompleteModal(q)}
                                                style={{
                                                    fontSize: 10,
                                                    color: "#00C9A7",
                                                    background: "rgba(0,201,167,0.1)",
                                                    border: "1px solid rgba(0,201,167,0.3)",
                                                    borderRadius: 4,
                                                    padding: "4px 8px",
                                                    cursor: "pointer",
                                                    fontFamily: "inherit",
                                                }}
                                            >
                                                ✓ Done
                                            </button>
                                        )}
                                </div>,
                            ];
                        })}
                    />
                    {quoted.length === 0 && <Empty msg="No quotations yet" />}
                </div>
            </div>
        );
    }

    if (sub === "New Requests" || sub === "Client Communication") {
        return (
            <div>
                <T />
                <PendingBanner />

                {quoteModal && (
                    <QuotationModal
                        inquiry={quoteModal}
                        onClose={() => setQuoteModal(null)}
                        onSubmit={async (amount, notes) => {
                            await sendQuotation(quoteModal._id, amount, notes);
                        }}
                    />
                )}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    <StatCard
                        label="Total Requests"
                        value={requests.data.length}
                        color="#6C63FF"
                        icon="📩"
                    />
                    <StatCard
                        label="Pending Quote"
                        value={requests.data.filter((r) => !r.quotedAmount).length}
                        color="#FF6B6B"
                        icon="⏳"
                    />
                    <StatCard
                        label="Quoted"
                        value={requests.data.filter((r) => r.quotedAmount).length}
                        color="#00C9A7"
                        icon="💼"
                    />
                    <StatCard
                        label="Verify Payments"
                        value={pendingVerifications}
                        color="#FFD60A"
                        icon="🔍"
                    />
                </div>

                <div
                    style={{
                        background: "#13141C",
                        border: "1px solid #1E1F2A",
                        borderRadius: 10,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #1E1F2A",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#CCCCE0",
                            }}
                        >
                            Service Requests ({requests.data.length})
                        </span>

                        <button
                            onClick={requests.refetch}
                            style={{
                                fontSize: 11,
                                color: "#6C63FF",
                                background: "rgba(108,99,255,0.08)",
                                border: "1px solid rgba(108,99,255,0.3)",
                                borderRadius: 6,
                                padding: "5px 12px",
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    <Table
                        cols={["Date", "Client", "Service", "Timeline", "Quote", "Payment", "Action"]}
                        rows={requests.data.map((q) => [
                            fmtDT(q.createdAt),

                            <div>
                                <p
                                    style={{
                                        fontWeight: 500,
                                        color: "#D0D0E8",
                                        fontSize: 12,
                                    }}
                                >
                                    {q.name}
                                </p>
                                <p
                                    style={{
                                        fontSize: 10,
                                        color: "#6C63FF",
                                    }}
                                >
                                    {q.email}
                                </p>
                            </div>,

                            <span
                                style={{
                                    fontSize: 11,
                                    color: "#FFA94D",
                                    fontWeight: 600,
                                }}
                            >
                                {q.service}
                            </span>,

                            q.timeline,

                            q.quotedAmount ? (
                                <span
                                    style={{
                                        color: "#00C9A7",
                                        fontWeight: 700,
                                    }}
                                >
                                    {fmtINR(q.quotedAmount)}
                                </span>
                            ) : (
                                <span
                                    style={{
                                        fontSize: 10,
                                        color: "#FF6B6B",
                                    }}
                                >
                                    Not quoted
                                </span>
                            ),

                            <div>
                                {q.advancePaymentStatus === "pending_verification" && (
                                    <span
                                        style={{
                                            fontSize: 10,
                                            color: "#FFD60A",
                                            background: "rgba(255,214,10,0.1)",
                                            padding: "2px 6px",
                                            borderRadius: 4,
                                            fontWeight: 700,
                                            display: "block",
                                            marginBottom: 2,
                                        }}
                                    >
                                        ⏳ Adv. Verifying
                                    </span>
                                )}

                                {q.finalPaymentStatus === "pending_verification" && (
                                    <span
                                        style={{
                                            fontSize: 10,
                                            color: "#FFD60A",
                                            background: "rgba(255,214,10,0.1)",
                                            padding: "2px 6px",
                                            borderRadius: 4,
                                            fontWeight: 700,
                                            display: "block",
                                        }}
                                    >
                                        ⏳ Final Verifying
                                    </span>
                                )}

                                {(q.advancePaid ||
                                    q.advanceVerified ||
                                    q.advancePaymentStatus === "approved" ||
                                    q.advancePaymentStatus === "verified") && (
                                        <span
                                            style={{
                                                fontSize: 10,
                                                color: "#00C9A7",
                                                display: "block",
                                            }}
                                        >
                                            ✓ Adv. Paid
                                        </span>
                                    )}

                                {(q.finalPaid ||
                                    q.finalVerified ||
                                    q.finalPaymentStatus === "approved" ||
                                    q.finalPaymentStatus === "verified") && (
                                        <span
                                            style={{
                                                fontSize: 10,
                                                color: "#00C9A7",
                                                display: "block",
                                            }}
                                        >
                                            ✓ Final Paid
                                        </span>
                                    )}

                                {q.workCompleted && (
                                    <span
                                        style={{
                                            fontSize: 10,
                                            color: "#4ECDC4",
                                            display: "block",
                                        }}
                                    >
                                        ✓ Work Done
                                    </span>
                                )}

                                {!q.advanceTxnId && !q.finalTxnId && !q.workCompleted && (
                                    <span
                                        style={{
                                            fontSize: 10,
                                            color: "#444",
                                        }}
                                    >
                                        —
                                    </span>
                                )}
                            </div>,

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap",
                                }}
                            >
                                <button
                                    onClick={() => setQuoteModal(q)}
                                    style={{
                                        fontSize: 11,
                                        color: "#fff",
                                        background: q.quotedAmount
                                            ? "linear-gradient(105deg, #6C63FF, #9D97FF)"
                                            : "linear-gradient(105deg, #00C9A7, #4ECDC4)",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "6px 14px",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {q.quotedAmount ? "✎ Edit Quote" : "💼 Send Quote"}
                                </button>

                                {q.quotedAmount && q.quotedAmount > 0 && (
                                    <button
                                        onClick={() => markWorkComplete(q._id)}
                                        disabled={q.workCompleted}
                                        style={{
                                            fontSize: 11,
                                            color: q.workCompleted ? "#888" : "#000",
                                            background: q.workCompleted
                                                ? "rgba(100,100,120,0.12)"
                                                : "linear-gradient(105deg, #00C9A7, #4ECDC4)",
                                            border: q.workCompleted
                                                ? "1px solid #2A2B38"
                                                : "none",
                                            borderRadius: 6,
                                            padding: "6px 12px",
                                            cursor: q.workCompleted ? "not-allowed" : "pointer",
                                            fontFamily: "inherit",
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {q.workCompleted ? "✓ Done" : "✓ Mark Done"}
                                    </button>
                                )}
                            </div>,
                        ])}
                    />

                    {requests.data.length === 0 && <Empty msg="No service requests yet" />}
                </div>
            </div>
        );
    }

    if (sub === "Projects Overview" || sub === "Work Progress") {
        return (
            <div>
                <T />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Projects" value={data.length} color="#6C63FF" icon="📋" />
                    <StatCard label="Total Budget" value={fmtK(totalBudget)} color="#FFA94D" icon="💰" />
                    <StatCard label="In Progress" value={inProgress} color="#00C9A7" icon="🔄" />
                    <StatCard label="Completed" value={completed} color="#4ECDC4" icon="✅" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <Table
                        cols={["Project", "Client", "Type", "Progress", "Budget", "Due", "Status"]}
                        rows={data.map(p => [
                            <span style={{ fontWeight: 500, color: "#D0D0E8" }}>{p.name}</span>,
                            p.client, p.type,
                            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 100 }}>
                                <div style={{ flex: 1, height: 3, background: "#1E1F2A", borderRadius: 2 }}>
                                    <div style={{ height: "100%", width: `${p.progress || 0}%`, background: "#6C63FF", borderRadius: 2 }} />
                                </div>
                                <span style={{ fontSize: 10, color: "#888" }}>{p.progress || 0}%</span>
                            </div>,
                            fmtINR(p.budget), fmt(p.dueDate),
                            updating === p._id ? "Saving…" : <StatusSelect value={p.status} options={PROJECT_STATUS_OPTIONS} onChange={v => updateProjStatus(p._id, v)} />,
                        ])}
                    />
                    {data.length === 0 && <Empty msg="No projects yet" />}
                </div>
            </div>
        );
    }

    if (sub === "Payments & Invoices") {
        const quotedWithPayments = requests.data.filter(r => r.advancePaid || r.finalPaid || r.advancePaymentStatus === "pending_verification" || r.finalPaymentStatus === "pending_verification");
        return (
            <div>
                <T />
                <PendingBanner />
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <Table
                        cols={["Client", "Service", "Quoted", "Advance", "Final", "Status"]}
                        rows={quotedWithPayments.map(q => [
                            q.name, q.service,
                            <span style={{ color: "#9D97FF", fontWeight: 600 }}>{fmtINR(q.quotedAmount || 0)}</span>,
                            <div>
                                {q.advancePaymentStatus === "pending_verification" ? (
                                    <span style={{ fontSize: 11, color: "#FFD60A", fontWeight: 700 }}>⏳ Pending Verify</span>
                                ) : q.advancePaid ? (
                                    <span style={{ color: "#00C9A7", fontWeight: 600 }}>✓ {fmtINR(q.advanceAmount || 0)}</span>
                                ) : <span style={{ color: "#666" }}>—</span>}
                            </div>,
                            <div>
                                {q.finalPaymentStatus === "pending_verification" ? (
                                    <span style={{ fontSize: 11, color: "#FFD60A", fontWeight: 700 }}>⏳ Pending Verify</span>
                                ) : q.finalPaid ? (
                                    <span style={{ color: "#00C9A7", fontWeight: 600 }}>✓ {fmtINR(q.finalAmount || 0)}</span>
                                ) : <span style={{ color: "#666" }}>—</span>}
                            </div>,
                            <Badge s={q.finalPaid ? "Fully Paid" : q.advancePaid ? "Advance Paid" : q.advancePaymentStatus === "pending_verification" ? "Pending Verification" : "Quoted"} />,
                        ])}
                    />
                    {quotedWithPayments.length === 0 && <Empty msg="No payments yet" />}
                </div>
                {invoices.data.length > 0 && (
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden", marginTop: 16 }}>
                        <Table
                            cols={["Invoice", "Project", "Client", "Amount", "Status", "Action"]}
                            rows={invoices.data.map(i => [
                                i.invoiceId || i._id.slice(-6).toUpperCase(), i.projectName, i.client,
                                <span style={{ color: "#6C63FF", fontWeight: 600 }}>{fmtINR(i.amount)}</span>,
                                <Badge s={i.status} />,
                                <StatusSelect value={i.status} options={["Pending", "Paid", "Overdue", "Cancelled"]} onChange={v => updateInvoiceStatus(i._id, v)} />,
                            ])}
                        />
                    </div>
                )}
            </div>
        );
    }

    return <Empty msg={`${sub} — coming soon`} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── OTHER PANELS (unchanged) ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function MarketingPanel({ sub }: { sub: string }) {
    const leads = useData<Lead>(() => Api.tryList(["/api/leads", "/api/marketing/leads"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));
    const [updating, setUpdating] = useState<string | null>(null);
    const { show, T } = useToast();
    const LEAD_STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Lost"];

    const updateLead = async (id: string, status: string) => {
        setUpdating(id);
        const result = await Api.smartUpdate([`/api/leads/${id}`, `/api/marketing/leads/${id}`], { status });
        if (result.success) { show(`Lead → ${status}`); leads.refetch(); }
        else show("Update failed", "error");
        setUpdating(null);
    };

    if (leads.loading) return <Spinner />;
    const data = leads.data;

    if (sub === "Lead Management" || sub === "Campaign Management") {
        return (
            <div>
                <T />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Leads" value={data.length} color="#6C63FF" icon="👥" />
                    <StatCard label="New" value={data.filter(l => l.status === "New").length} color="#00C9A7" icon="⚡" />
                    <StatCard label="Qualified" value={data.filter(l => l.status === "Qualified").length} color="#FFA94D" icon="✅" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <Table
                        cols={["Name", "Email", "Mobile", "Source", "Status", "Date", "Action"]}
                        rows={data.map(l => [
                            l.name,
                            <span style={{ color: "#6C63FF" }}>{l.email}</span>,
                            l.mobile, l.source || "—", <Badge s={l.status} />, fmt(l.createdAt),
                            updating === l._id ? "Saving…" : <StatusSelect value={l.status} options={LEAD_STATUS_OPTIONS} onChange={v => updateLead(l._id, v)} />,
                        ])}
                    />
                    {data.length === 0 && <Empty msg="No leads yet" />}
                </div>
            </div>
        );
    }
    if (sub === "Client Communication") {
        return (
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <Table
                    cols={["Date", "Name", "Email", "Service", "Quote", "Status"]}
                    rows={inquiries.data.map(q => [
                        fmtDT(q.createdAt), q.name,
                        <span style={{ color: "#6C63FF" }}>{q.email}</span>,
                        q.service,
                        q.quotedAmount ? <span style={{ color: "#00C9A7" }}>{fmtINR(q.quotedAmount)}</span> : "—",
                        <Badge s={q.status} />,
                    ])}
                />
                {inquiries.data.length === 0 && <Empty msg="No inquiries" />}
            </div>
        );
    }
    return <Empty msg={`${sub} — coming soon`} />;
}

function FinancePanel({ sub }: { sub: string }) {
    const invoices = useData<Invoice>(() => Api.tryList(["/api/invoices", "/api/web-invoices"]));
    const rentals = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));

    if (invoices.loading || rentals.loading || inquiries.loading) return <Spinner />;

    const rentalRev = rentals.data.filter(r => r.paymentStatus === "approved").reduce((s, r) => s + (r.paymentAmount || r.totalPrice), 0);
    const advanceCollected = inquiries.data.filter(i => i.advancePaid && i.advancePaymentStatus === "approved").reduce((s, i) => s + (i.advanceAmount || 0), 0);
    const finalCollected = inquiries.data.filter(i => i.finalPaid && i.finalPaymentStatus === "approved").reduce((s, i) => s + (i.finalAmount || 0), 0);
    const totalCollected = advanceCollected + finalCollected + rentalRev;
    const pendingVerify = inquiries.data.filter(i => i.advancePaymentStatus === "pending_verification" || i.finalPaymentStatus === "pending_verification").length + rentals.data.filter(r => r.paymentStatus === "pending_verification").length;

    if (sub === "Dashboard" || sub === "Income") {
        return (
            <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Collected" value={fmtK(totalCollected)} color="#00C9A7" icon="💰" />
                    <StatCard label="Project Income" value={fmtK(advanceCollected + finalCollected)} color="#6C63FF" icon="💼" />
                    <StatCard label="Rental Income" value={fmtK(rentalRev)} color="#FFA94D" icon="📷" />
                    <StatCard label="Pending Verify" value={pendingVerify} color="#FFD60A" icon="🔍" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 14 }}>📊 Verified Income Breakdown</p>
                    {[
                        { label: "Advance Payments (30%) — Verified", amount: advanceCollected, color: "#FFA94D" },
                        { label: "Final Payments (70%) — Verified", amount: finalCollected, color: "#9D97FF" },
                        { label: "Rental Revenue — Verified", amount: rentalRev, color: "#00C9A7" },
                    ].map(s => (
                        <div key={s.label} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: "#AAAACC" }}>{s.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{fmtINR(s.amount)}</span>
                            </div>
                            <div style={{ height: 5, background: "#1E1F2A", borderRadius: 3 }}>
                                <div style={{ height: "100%", width: `${totalCollected > 0 ? (s.amount / totalCollected) * 100 : 0}%`, background: s.color, borderRadius: 3 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return <Empty msg={`${sub} — coming soon`} />;
}

function EventsPanel({ sub }: { sub: string }) {
    const events = useData<Event>(() => Api.tryList(["/api/events", "/api/event-requests"]));
    if (events.loading) return <Spinner />;
    const data = events.data;
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                <StatCard label="Total Events" value={data.length} color="#6C63FF" icon="🎪" />
                <StatCard label="Total Budget" value={fmtK(data.reduce((s, e) => s + (e.budget || 0), 0))} color="#FFA94D" icon="💰" />
            </div>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <Table
                    cols={["Event", "Client", "Date", "Budget", "Status"]}
                    rows={data.map(e => [e.eventName, e.client, fmt(e.date), e.budget ? fmtINR(e.budget) : "—", <Badge s={e.status} />])}
                />
                {data.length === 0 && <Empty msg="No events yet" />}
            </div>
            <p style={{ fontSize: 11, color: "#555", marginTop: 14, textAlign: "center" }}>{sub}</p>
        </div>
    );
}

function TeamPanel({ sub }: { sub: string }) {
    const users = useData<User>(() => Api.tryList(["/api/users", "/api/admin/users"]));
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", role: "User" });
    const [saving, setSaving] = useState(false);
    const { show, T } = useToast();
    const ROLE_OPTIONS = ["User", "Admin", "Manager", "Developer", "Designer", "Analyst", "Rental"];

    const handleAdd = async () => {
        if (!form.name || !form.email) { show("Name & email required", "error"); return; }
        setSaving(true);
        try {
            await Api.post("/api/admin/users", { ...form, password: "Admin@1234" });
            show("Member added!"); users.refetch();
            setShowForm(false); setForm({ name: "", email: "", role: "User" });
        } catch (e: any) { show(`Failed: ${e.message}`, "error"); }
        finally { setSaving(false); }
    };

    const updateRole = async (id: string, role: string) => {
        const result = await Api.smartUpdate([`/api/users/${id}`, `/api/admin/users/${id}`], { role });
        if (result.success) { show("Role updated"); users.refetch(); }
        else show("Failed", "error");
    };

    if (users.loading) return <Spinner />;

    return (
        <div>
            <T />
            {showForm && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 12, padding: 24, width: 360 }}>
                        <h3 style={{ color: "#E8E8EF", marginBottom: 16 }}>Add Team Member</h3>
                        {[{ label: "Name", key: "name" }, { label: "Email", key: "email" }].map(f => (
                            <div key={f.key} style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>{f.label}</label>
                                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    style={{ width: "100%", padding: "8px 12px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 7, color: "#E8E8EF", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 16 }}>
                            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                                style={{ width: "100%", padding: "8px 12px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 7, color: "#E8E8EF", fontSize: 12, fontFamily: "inherit" }}>
                                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={handleAdd} disabled={saving}
                                style={{ flex: 1, padding: "9px", background: "#6C63FF", border: "none", borderRadius: 7, color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {saving ? "Adding…" : "Add"}
                            </button>
                            <button onClick={() => setShowForm(false)}
                                style={{ padding: "9px 16px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 7, color: "#888", cursor: "pointer", fontFamily: "inherit" }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Team ({users.data.length}) — {sub}</span>
                    <button onClick={() => setShowForm(true)}
                        style={{ fontSize: 11, color: "#fff", background: "#6C63FF", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>
                        + Add
                    </button>
                </div>
                <Table
                    cols={["Name", "Email", "Role", "Joined", "Change Role"]}
                    rows={users.data.map(u => [u.name, <span style={{ color: "#6C63FF" }}>{u.email}</span>, <Badge s={u.role || "User"} />, fmt(u.createdAt), <StatusSelect value={u.role || "User"} options={ROLE_OPTIONS} onChange={v => updateRole(u._id, v)} />])}
                />
                {users.data.length === 0 && <Empty msg="No team members" />}
            </div>
        </div>
    );
}

function NotificationsPanel() {
    const rentals = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry"]));

    const pendingRentals = rentals.data.filter(r => r.status === "pending");
    const pendingQuotes = inquiries.data.filter(q => !q.quotedAmount);
    const pendingVerifications = [
        ...inquiries.data.filter(i => i.advancePaymentStatus === "pending_verification"),
        ...inquiries.data.filter(i => i.finalPaymentStatus === "pending_verification"),
        ...rentals.data.filter(r => r.paymentStatus === "pending_verification"),
    ];
    const workToComplete = inquiries.data.filter(q => q.advancePaid && !q.workCompleted);

    if (rentals.loading || inquiries.loading) return <Spinner />;

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                <StatCard label="Pending Verify" value={pendingVerifications.length} color="#FFD60A" icon="🔍" />
                <StatCard label="Need Quote" value={pendingQuotes.length} color="#FF6B6B" icon="💼" />
                <StatCard label="Work to Complete" value={workToComplete.length} color="#00C9A7" icon="✅" />
                <StatCard label="Pending Rentals" value={pendingRentals.length} color="#6C63FF" icon="📷" />
            </div>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 14 }}>Action Items</h3>
                {[
                    ...pendingVerifications.map(item => ({
                        icon: "🔍", color: "#FFD60A",
                        msg: `Verify payment — ${"service" in item ? (item as ServiceInquiry).service : (item as RentalOrder).productName} — ${item.name}`,
                        time: "advanceSubmittedAt" in item ? (item as ServiceInquiry).advanceSubmittedAt : (item as RentalOrder).paymentSubmittedAt,
                        type: "Payment",
                    })),
                    ...pendingQuotes.map(q => ({ icon: "💼", color: "#FF6B6B", msg: `Send quote: ${q.service} — ${q.name}`, time: q.createdAt, type: "Quote" })),
                    ...workToComplete.map(q => ({ icon: "🔄", color: "#00C9A7", msg: `Work in progress: ${q.service} — ${q.name}`, time: q.createdAt, type: "Work" })),
                    ...pendingRentals.map(r => ({ icon: "📷", color: "#6C63FF", msg: `New rental: ${r.productName} — ${r.name}`, time: r.createdAt, type: "Rental" })),
                ].map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #1A1B24" }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${n.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{n.icon}</div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, color: "#AAAACC" }}>{n.msg}</p>
                            <span style={{ fontSize: 10, color: "#555577" }}>{fmtDT(n.time)}</span>
                        </div>
                        <Badge s={n.type} />
                    </div>
                ))}
                {pendingVerifications.length === 0 && pendingQuotes.length === 0 && workToComplete.length === 0 && pendingRentals.length === 0 && (
                    <Empty msg="All caught up! No pending actions 🎉" />
                )}
            </div>
        </div>
    );
}

function ReportsPanel({ sub }: { sub: string }) {
    const rentals = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry"]));
    if (rentals.loading) return <Spinner />;

    const quoted = inquiries.data.filter(q => q.quotedAmount);
    const verifiedAdvance = inquiries.data.filter(i => i.advancePaid && i.advancePaymentStatus === "approved").reduce((s, i) => s + (i.advanceAmount || 0), 0);
    const verifiedFinal = inquiries.data.filter(i => i.finalPaid && i.finalPaymentStatus === "approved").reduce((s, i) => s + (i.finalAmount || 0), 0);
    const verifiedRental = rentals.data.filter(r => r.paymentStatus === "approved").reduce((s, r) => s + (r.paymentAmount || r.totalPrice), 0);

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                <StatCard label="Total Quotes" value={quoted.length} color="#6C63FF" icon="📋" />
                <StatCard label="Verified Project Rev" value={fmtK(verifiedAdvance + verifiedFinal)} color="#FFA94D" icon="💼" />
                <StatCard label="Verified Rental Rev" value={fmtK(verifiedRental)} color="#00C9A7" icon="✅" />
                <StatCard label="Total Verified" value={fmtK(verifiedAdvance + verifiedFinal + verifiedRental)} color="#4ECDC4" icon="📷" />
            </div>
            <p style={{ textAlign: "center", color: "#555", fontSize: 11, marginTop: 30 }}>{sub}</p>
        </div>
    );
}

function SettingsPanel({ sub }: { sub: string }) {
    const users = useData<User>(() => Api.tryList(["/api/users", "/api/admin/users"]));
    if (users.loading) return <Spinner />;
    if (sub === "User Management") {
        return (
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <Table
                    cols={["Name", "Email", "Role", "Joined"]}
                    rows={users.data.map(u => [u.name, <span style={{ color: "#6C63FF" }}>{u.email}</span>, <Badge s={u.role || "User"} />, fmt(u.createdAt)])}
                />
            </div>
        );
    }
    return <Empty msg={`${sub} — coming soon`} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function AdminDashboard() {
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState("dashboard");
    const [activeSub, setActiveSub] = useState("Overview");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [clock, setClock] = useState(new Date());
    const [profileOpen, setProfileOpen] = useState(false);
    const [adminUser, setAdminUser] = useState<{ name: string; email: string; role?: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate({ to: "/login" }); return; }
        try { setAdminUser(JSON.parse(localStorage.getItem("user") || "{}")); } catch { }
        const t = setInterval(() => setClock(new Date()), 1000);
        const click = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest("[data-admin-profile]")) setProfileOpen(false);
        };
        document.addEventListener("click", click);
        return () => { clearInterval(t); document.removeEventListener("click", click); };
    }, [navigate]);

    const currentNav = NAV.find(n => n.id === activePanel);

    const renderPanel = () => {
        switch (activePanel) {
            case "dashboard": return <DashboardPanel sub={activeSub} />;
            case "rental": return <RentalPanel sub={activeSub} />;
            case "website": return <WebsitePanel sub={activeSub} />;
            case "marketing": return <MarketingPanel sub={activeSub} />;
            case "finance": return <FinancePanel sub={activeSub} />;
            case "events": return <EventsPanel sub={activeSub} />;
            case "team": return <TeamPanel sub={activeSub} />;
            case "notifications": return <NotificationsPanel />;
            case "reports": return <ReportsPanel sub={activeSub} />;
            case "settings": return <SettingsPanel sub={activeSub} />;
            default: return (
                <div style={{ textAlign: "center", padding: 60, color: "#555577" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{currentNav?.icon}</div>
                    <p style={{ fontSize: 16, color: "#888" }}>{currentNav?.label}</p>
                </div>
            );
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF", overflow: "hidden" }}>
            <aside style={{ width: sidebarOpen ? 240 : 64, background: "#0F1117", borderRight: "1px solid #1E1F2A", display: "flex", flexDirection: "column", transition: "width 0.25s", overflow: "hidden", flexShrink: 0, zIndex: 10 }}>
                <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #1E1F2A", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#6C63FF,#00C9A7)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⬡</div>
                    {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", background: "linear-gradient(90deg,#fff,#A0A0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CREWHOLIC ADMIN</span>}
                </div>
                <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0", scrollbarWidth: "none" }}>
                    {NAV.map(n => (
                        <button key={n.id} onClick={() => { setActivePanel(n.id); setActiveSub(n.sub[0]); if (!sidebarOpen) setSidebarOpen(true); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", background: activePanel === n.id ? "rgba(108,99,255,0.15)" : "transparent", border: "none", cursor: "pointer", color: activePanel === n.id ? "#6C63FF" : "#8888AA", fontSize: 13, fontWeight: activePanel === n.id ? 600 : 400, borderLeft: activePanel === n.id ? "2px solid #6C63FF" : "2px solid transparent", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                            <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                            {sidebarOpen && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{n.label}</span>}
                        </button>
                    ))}
                </nav>
                <button onClick={() => setSidebarOpen(p => !p)}
                    style={{ margin: "8px 12px", padding: 8, background: "#1A1B25", border: "1px solid #2A2B38", borderRadius: 8, cursor: "pointer", color: "#6666AA", fontSize: 12, fontFamily: "inherit" }}>
                    {sidebarOpen ? "← collapse" : "→"}
                </button>
            </aside>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <header style={{ background: "#0F1117", borderBottom: "1px solid #1E1F2A", padding: "0 20px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{currentNav?.label}</h1>
                        <span style={{ fontSize: 11, color: "#555577", padding: "2px 8px", background: "#1A1B25", borderRadius: 4 }}>{activeSub}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ fontSize: 11, color: "#555577", fontFamily: "monospace" }}>{clock.toLocaleTimeString()}</span>
                        <div data-admin-profile style={{ position: "relative" }}>
                            <button onClick={e => { e.stopPropagation(); setProfileOpen(p => !p); }}
                                style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF,#00C9A7)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>
                                {adminUser?.name?.charAt(0).toUpperCase() || "A"}
                            </button>
                            {profileOpen && (
                                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 220, background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 100, overflow: "hidden" }}>
                                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1E1F2A" }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "#E8E8EF" }}>{adminUser?.name || "Admin"}</p>
                                        <p style={{ fontSize: 10, color: "#666688" }}>{adminUser?.email}</p>
                                    </div>
                                    <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }}
                                        style={{ width: "100%", padding: "9px 16px", background: "transparent", border: "none", color: "#FF6B6B", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                                        ⎋ Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                    <aside style={{ width: 190, background: "#0D0E14", borderRight: "1px solid #1A1B24", overflowY: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
                        <div style={{ padding: "10px 0" }}>
                            {currentNav?.sub.map(s => (
                                <button key={s} onClick={() => setActiveSub(s)}
                                    style={{ width: "100%", textAlign: "left", padding: "8px 14px", background: activeSub === s ? "rgba(108,99,255,0.1)" : "transparent", border: "none", cursor: "pointer", color: activeSub === s ? "#9D97FF" : "#666688", fontSize: 11, fontWeight: activeSub === s ? 500 : 400, borderLeft: activeSub === s ? "2px solid #6C63FF" : "2px solid transparent", fontFamily: "inherit" }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </aside>
                    <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
                        {renderPanel()}
                    </main>
                </div>
            </div>
        </div>
    );
}