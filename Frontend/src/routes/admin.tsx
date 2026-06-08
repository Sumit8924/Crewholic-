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
    { id: "dashboard",     label: "Dashboard",           icon: "⬡", sub: ["Overview", "Revenue Summary", "Active Projects", "Pending Tasks", "Team Performance", "Recent Activities", "Analytics Overview"] },
    { id: "website",       label: "Website Creation",    icon: "◈", sub: ["Projects Overview", "New Requests", "Assigned Teams", "Project Details", "Project Timeline", "Work Progress", "Client Communication", "File Management", "Deliverables", "Payments & Invoices", "Completed Projects", "Reports"] },
    { id: "marketing",     label: "Marketing Panel",     icon: "◉", sub: ["Campaign Management", "Lead Management", "Lead Assignment", "Call Center Activities", "Client Communication", "Marketing Reports", "Performance Analytics", "Social Media Campaigns", "Email Campaigns", "Team Management", "Target Tracking"] },
    { id: "rental",        label: "Tech Rental",         icon: "◧", sub: ["Products Inventory", "Product Categories", "Equipment Tracking", "Bookings / Orders", "Rental Requests", "Client Details", "Payments", "Delivery Tracking", "Maintenance Requests", "Support Tickets", "Reports"] },
    { id: "events",        label: "Event Management",    icon: "◫", sub: ["Event Requests", "Event Planning", "Event Scheduling", "Vendor Management", "Resource Allocation", "Work Progress", "Client Communication", "Payments", "Budget Tracking", "Event Reports", "Event Analytics"] },
    { id: "finance",       label: "Finance Panel",       icon: "◎", sub: ["Dashboard", "Income", "Expenses", "Transactions", "Invoices", "Payment Tracking", "Budget Management", "Profit & Loss", "Financial Reports", "Tax Records", "Export Reports"] },
    { id: "director",      label: "Director Panel",      icon: "◆", sub: ["Company Overview", "Department Overview", "KPI Monitoring", "Business Growth", "Performance Reports", "Analytics Dashboard", "Important Decisions", "Notifications", "Company Reports", "Strategic Planning"] },
    { id: "analyst",       label: "Analyst Dashboard",   icon: "◐", sub: ["Data Analysis", "Performance Reports", "Trend Analysis", "Business Insights", "Graphs & Charts", "Data Export", "Forecast Reports", "Department Analytics", "KPI Analytics", "Custom Reports"] },
    { id: "callcenter",    label: "Call Center",         icon: "◑", sub: ["Lead Calling", "Lead Management", "Customer Support", "Follow-Ups", "Lead Status Tracking", "Call Logs", "Call Reports", "Team Performance", "Ticket Management", "Outreach Analytics"] },
    { id: "reports",       label: "Reports & Analytics", icon: "◓", sub: ["Revenue Reports", "Project Reports", "Marketing Reports", "Rental Reports", "Event Reports", "Team Reports", "Finance Reports", "KPI Reports", "Export Center"] },
    { id: "team",          label: "Team Management",     icon: "◒", sub: ["Employees", "Departments", "Roles & Permissions", "Attendance", "Performance Review", "Task Assignment", "Activity Logs"] },
    { id: "notifications", label: "Notifications Center",icon: "◔", sub: ["System Notifications", "Client Notifications", "Payment Alerts", "Task Alerts", "Approval Requests"] },
    { id: "settings",      label: "Settings",            icon: "◕", sub: ["Company Settings", "User Management", "Roles & Permissions", "Theme Settings", "Email Settings", "Security Settings", "Integrations", "Backup & Restore", "System Configuration"] },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface RentalOrder   { _id: string; name: string; email: string; mobile: string; productName: string; categoryName: string; pricePerDay: number; rentalDays: number; totalPrice: number; status: string; requirements?: string; createdAt: string; }
interface ServiceInquiry{ _id: string; name: string; email: string; mobile: string; service: string; timeline: string; requirements?: string; status: string; createdAt: string; }
interface Project       { _id: string; projectId?: string; name: string; client: string; type: string; status: string; progress: number; team: string; budget: number; dueDate: string; createdAt: string; }
interface User          { _id: string; name: string; email: string; mobile?: string; role?: string; createdAt: string; }
interface Invoice       { _id: string; invoiceId?: string; projectName: string; client: string; amount: number; status: string; dueDate: string; createdAt: string; }
interface Lead          { _id: string; name: string; email: string; mobile: string; source: string; status: string; assignedTo?: string; notes?: string; createdAt: string; }
interface Event         { _id: string; eventName: string; client: string; date: string; venue?: string; type?: string; status: string; budget?: number; createdAt: string; }
interface TeamMember    { _id: string; name: string; email: string; role: string; department?: string; status?: string; joinedAt?: string; }

// ─── STATUS COLORS ────────────────────────────────────────────────────────────
const SC: Record<string, { bg: string; text: string }> = {
    pending:    { bg: "rgba(255,193,7,0.12)",   text: "#FFC107" },
    confirmed:  { bg: "rgba(0,151,255,0.12)",   text: "#0097FF" },
    active:     { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
    completed:  { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
    cancelled:  { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    Pending:    { bg: "rgba(255,193,7,0.12)",   text: "#FFC107" },
    Contacted:  { bg: "rgba(0,151,255,0.12)",   text: "#0097FF" },
    Closed:     { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
    "In Progress":{ bg: "rgba(108,99,255,0.12)", text: "#9D97FF" },
    Review:     { bg: "rgba(0,151,255,0.12)",   text: "#0097FF" },
    Started:    { bg: "rgba(255,165,61,0.12)",  text: "#FFA94D" },
    Paid:       { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
    Overdue:    { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    New:        { bg: "rgba(108,99,255,0.12)",  text: "#9D97FF" },
    Qualified:  { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
    Lost:       { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    Planned:    { bg: "rgba(108,99,255,0.12)",  text: "#9D97FF" },
    Ongoing:    { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
    Completed:  { bg: "rgba(0,201,167,0.12)",   text: "#00C9A7" },
};

const Badge = ({ s }: { s: string }) => {
    const c = SC[s] || { bg: "#1E1F2A", text: "#888" };
    return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: c.bg, color: c.text, fontWeight: 600, whiteSpace: "nowrap" }}>{s}</span>;
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getAuth = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
};
const fmt    = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtDT  = (d?: string) => d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
const fmtINR = (n: number)  => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const fmtK   = (n: number)  => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : fmtINR(n);

// ─── API ─────────────────────────────────────────────────────────────────────
const Api = {
    async get<T>(path: string): Promise<T> {
        const r = await fetch(`${API_BASE}${path}`, { headers: { ...getAuth() } });
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
    },
    async patch<T>(path: string, data: any): Promise<T> {
        const r = await fetch(`${API_BASE}${path}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...getAuth() }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(`${r.status}`);
        const t = await r.text();
        return t ? JSON.parse(t) : {} as T;
    },
    async post<T>(path: string, data: any): Promise<T> {
        const r = await fetch(`${API_BASE}${path}`, { method: "POST", headers: { "Content-Type": "application/json", ...getAuth() }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
    },
    async delete(path: string) {
        const r = await fetch(`${API_BASE}${path}`, { method: "DELETE", headers: { ...getAuth() } });
        if (!r.ok) throw new Error(`${r.status}`);
    },
    async tryList<T>(paths: string[]): Promise<T[]> {
        for (const p of paths) {
            try {
                const d: any = await this.get(p);
                if (Array.isArray(d)) return d;
                const k = ["data","orders","projects","inquiries","users","invoices","leads","events","members","rentals","items"];
                for (const key of k) if (Array.isArray(d?.[key])) return d[key];
            } catch { /* next */ }
        }
        return [];
    },
};

// ─── DATA HOOK ────────────────────────────────────────────────────────────────
function useData<T>(fn: () => Promise<T[]>, deps: any[] = []) {
    const [data, setData]     = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState<string | null>(null);
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
    const show = (msg: string, type: "success" | "error" = "success") => { setT({ msg, type }); setTimeout(() => setT(null), 3000); };
    const T = () => t ? <Toast msg={t.msg} type={t.type} /> : null;
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

// ─── TABLE HELPER ─────────────────────────────────────────────────────────────
function Table({ cols, rows }: { cols: string[]; rows: (string | React.ReactNode)[][] }) {
    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                    <tr style={{ background: "#0F1017" }}>
                        {cols.map(c => <th key={c} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c}</th>)}
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

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
    return (
        <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, background: color, opacity: 0.07, borderRadius: "0 10px 0 50px" }} />
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: color }}>{value}</p>
                <span style={{ fontSize: 22 }}>{icon}</span>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── DASHBOARD PANEL ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function DashboardPanel({ sub }: { sub: string }) {
    const rentals   = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));
    const projects  = useData<Project>(() => Api.tryList(["/api/projects", "/api/web-projects"]));
    const users     = useData<User>(() => Api.tryList(["/api/users", "/api/admin/users"]));

    const totalRevenue  = rentals.data.reduce((s, r) => s + (r.totalPrice || 0), 0);
    const activeProj    = projects.data.filter(p => p.status === "In Progress").length;
    const pendingRental = rentals.data.filter(r => r.status === "pending").length;

    const allLoading = rentals.loading && inquiries.loading && projects.loading;
    if (allLoading) return <Spinner />;

    if (sub === "Overview" || sub === "Analytics Overview" || sub === "Recent Activities") {
        return (
            <div>
                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
                    <StatCard label="Total Revenue"     value={fmtK(totalRevenue)}           color="#6C63FF" icon="💰" />
                    <StatCard label="Active Projects"   value={activeProj}                    color="#00C9A7" icon="📋" />
                    <StatCard label="Rental Orders"     value={rentals.data.length}           color="#FFA94D" icon="📷" />
                    <StatCard label="Pending Rentals"   value={pendingRental}                 color="#FF6B6B" icon="⏳" />
                    <StatCard label="Service Inquiries" value={inquiries.data.length}         color="#4ECDC4" icon="📩" />
                    <StatCard label="Total Users"       value={users.data.length}             color="#A8E6CF" icon="👥" />
                </div>

                {/* Recent rentals */}
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
                                    <Badge s={r.status} />
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
                                    <p style={{ fontSize: 10, color: "#555577" }}>{q.service} · {q.timeline}</p>
                                </div>
                                <Badge s={q.status} />
                            </div>
                        ))}
                        {inquiries.data.length === 0 && <Empty msg="No inquiries yet" />}
                    </div>
                </div>
            </div>
        );
    }

    if (sub === "Revenue Summary") {
        const byCategory = rentals.data.reduce((acc, r) => { acc[r.categoryName] = (acc[r.categoryName] || 0) + r.totalPrice; return acc; }, {} as Record<string, number>);
        return (
            <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
                    <StatCard label="Total Revenue"   value={fmtK(totalRevenue)}                             color="#6C63FF" icon="💰" />
                    <StatCard label="Avg Order Value" value={rentals.data.length ? fmtK(Math.round(totalRevenue / rentals.data.length)) : "₹0"} color="#00C9A7" icon="📊" />
                    <StatCard label="Total Orders"    value={rentals.data.length}                             color="#FFA94D" icon="📦" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 14 }}>Revenue by Category</h3>
                    {Object.entries(byCategory).length === 0 ? <Empty msg="No data" /> :
                        Object.entries(byCategory).sort(([,a],[,b]) => b - a).map(([cat, rev]) => {
                            const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
                            return (
                                <div key={cat} style={{ marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, color: "#AAAACC" }}>{cat}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: "#6C63FF" }}>{fmtINR(rev)}</span>
                                    </div>
                                    <div style={{ height: 6, background: "#1E1F2A", borderRadius: 3 }}>
                                        <div style={{ height: "100%", width: `${pct}%`, background: "#6C63FF", borderRadius: 3, transition: "width 0.5s" }} />
                                    </div>
                                    <p style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{pct.toFixed(1)}% of total</p>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }

    if (sub === "Team Performance") {
        const teams = [
            { name: "Development", score: 94, members: 12, color: "#6C63FF" },
            { name: "Marketing",   score: 87, members: 8,  color: "#00C9A7" },
            { name: "Design",      score: 91, members: 6,  color: "#FFA94D" },
            { name: "Sales",       score: 78, members: 10, color: "#FF6B6B" },
            { name: "Support",     score: 83, members: 7,  color: "#4ECDC4" },
            { name: "Finance",     score: 96, members: 4,  color: "#A8E6CF" },
        ];
        return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
                {teams.map(t => (
                    <div key={t.name} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#D0D0E8" }}>{t.name}</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: t.color }}>{t.score}%</span>
                        </div>
                        <div style={{ height: 4, background: "#1E1F2A", borderRadius: 2, marginBottom: 8 }}>
                            <div style={{ height: "100%", width: `${t.score}%`, background: t.color, borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: "#555577" }}>{t.members} members</span>
                    </div>
                ))}
            </div>
        );
    }

    return <Empty msg={`${sub} — data loading from backend`} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── RENTAL PANEL ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function RentalPanel({ sub }: { sub: string }) {
    const { data, loading, error, refetch } = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"]));
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [confirm, setConfirm] = useState<string | null>(null);
    const { show, T } = useToast();

    const updateStatus = async (id: string, status: string) => {
        try {
            const paths = [`/api/rental-inquiry/${id}/status`, `/api/rental-inquiry/${id}`, `/api/rental-inquiries/${id}`];
            for (const p of paths) { try { await Api.patch(p, { status }); show(`Status → ${status}`); refetch(); return; } catch { /* next */ } }
            show("Failed", "error");
        } catch { show("Failed", "error"); }
    };

    const handleDelete = async (id: string) => {
        try {
            const paths = [`/api/rental-inquiry/${id}`, `/api/rental-inquiries/${id}`];
            for (const p of paths) { try { await Api.delete(p); show("Deleted"); refetch(); return; } catch { /* next */ } }
            show("Failed", "error");
        } catch { show("Failed", "error"); }
    };

    if (loading) return <Spinner />;
    if (error)   return <Empty msg={`Error: ${error}`} />;

    const orders = data;
    const filtered = orders
        .filter(o => filter === "All" || o.status === filter)
        .filter(o => !search || o.name?.toLowerCase().includes(search.toLowerCase()) || o.productName?.toLowerCase().includes(search.toLowerCase()) || o.email?.toLowerCase().includes(search.toLowerCase()));

    const totalRevenue   = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const pending        = orders.filter(o => o.status === "pending").length;
    const active         = orders.filter(o => o.status === "active" || o.status === "confirmed").length;

    if (sub === "Products Inventory" || sub === "Bookings / Orders" || sub === "Rental Requests") {
        return (
            <div>
                <T />
                {confirm && <Confirm msg="Delete this rental order?" onOk={() => { handleDelete(confirm); setConfirm(null); }} onNo={() => setConfirm(null)} />}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Orders"   value={orders.length}         color="#6C63FF" icon="📷" />
                    <StatCard label="Total Revenue"  value={fmtK(totalRevenue)}    color="#00C9A7" icon="💰" />
                    <StatCard label="Pending"        value={pending}               color="#FFA94D" icon="⏳" />
                    <StatCard label="Active"         value={active}                color="#4ECDC4" icon="🎬" />
                </div>

                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", flex: 1 }}>Rental Orders ({filtered.length})</span>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ padding: "5px 10px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, outline: "none", width: 180, fontFamily: "inherit" }} />
                        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "5px 10px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
                            {["All","pending","confirmed","active","completed","cancelled"].map(s => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
                        </select>
                        <button onClick={refetch} style={{ fontSize: 11, color: "#6C63FF", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>↻ Refresh</button>
                    </div>
                    <Table
                        cols={["Date","Customer","Product","Category","Days","Total","Status","Actions"]}
                        rows={filtered.map(o => [
                            fmtDT(o.createdAt),
                            <div><p style={{ fontWeight: 500, color: "#D0D0E8", fontSize: 12 }}>{o.name}</p><p style={{ fontSize: 10, color: "#555577" }}>{o.email}</p></div>,
                            o.productName,
                            o.categoryName,
                            `${o.rentalDays}d`,
                            <span style={{ color: "#6C63FF", fontWeight: 600 }}>{fmtINR(o.totalPrice)}</span>,
                            <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} style={{ background: "transparent", border: "none", color: SC[o.status]?.text || "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {["pending","confirmed","active","completed","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>,
                            <button onClick={() => setConfirm(o._id)} style={{ fontSize: 10, color: "#FF6B6B", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Del</button>,
                        ])}
                    />
                    {filtered.length === 0 && <Empty msg="No orders match" />}
                </div>
            </div>
        );
    }

    if (sub === "Client Details") {
        const byEmail = orders.reduce((acc, o) => {
            if (!acc[o.email]) acc[o.email] = { name: o.name, email: o.email, mobile: o.mobile, count: 0, spent: 0 };
            acc[o.email].count++;
            acc[o.email].spent += o.totalPrice || 0;
            return acc;
        }, {} as Record<string, any>);
        const clients = Object.values(byEmail).sort((a: any, b: any) => b.spent - a.spent);
        return (
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Rental Clients ({clients.length})</span>
                </div>
                <Table
                    cols={["Name","Email","Mobile","Orders","Total Spent"]}
                    rows={clients.map((c: any) => [
                        <span style={{ color: "#D0D0E8", fontWeight: 500 }}>{c.name}</span>,
                        <span style={{ color: "#6C63FF" }}>{c.email}</span>,
                        c.mobile,
                        c.count,
                        <span style={{ color: "#00C9A7", fontWeight: 600 }}>{fmtINR(c.spent)}</span>,
                    ])}
                />
                {clients.length === 0 && <Empty msg="No clients yet" />}
            </div>
        );
    }

    if (sub === "Reports" || sub === "Payments") {
        const byCategory = orders.reduce((acc, o) => { acc[o.categoryName] = (acc[o.categoryName] || 0) + o.totalPrice; return acc; }, {} as Record<string, number>);
        const productRanking = orders.reduce((acc, o) => { acc[o.productName] = (acc[o.productName] || 0) + 1; return acc; }, {} as Record<string, number>);
        const top5 = Object.entries(productRanking).sort(([,a],[,b]) => b - a).slice(0, 5);
        const exportCSV = () => {
            const rows = orders.map(o => [o.name, o.email, o.mobile, o.productName, o.categoryName, o.rentalDays, o.totalPrice, o.status, fmt(o.createdAt)]);
            const csv = [["Name","Email","Mobile","Product","Category","Days","Total","Status","Date"], ...rows].map(r => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "rental-report.csv"; a.click();
        };
        return (
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#CCCCE0" }}>Rental Reports</span>
                    <button onClick={exportCSV} style={{ fontSize: 11, color: "#6C63FF", background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>📥 Export CSV</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 14 }}>Revenue by Category</h3>
                        {Object.entries(byCategory).map(([cat, rev]) => (
                            <div key={cat} style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: "#AAAACC" }}>{cat}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#6C63FF" }}>{fmtINR(rev)}</span>
                                </div>
                                <div style={{ height: 5, background: "#1E1F2A", borderRadius: 3 }}>
                                    <div style={{ height: "100%", width: `${totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0}%`, background: "#6C63FF", borderRadius: 3 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 14 }}>Top Products</h3>
                        {top5.map(([name, count], i) => (
                            <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1A1B24" }}>
                                <span style={{ fontSize: 12, color: "#AAAACC" }}>#{i + 1} {name}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#FFA94D" }}>{count}×</span>
                            </div>
                        ))}
                        {top5.length === 0 && <Empty msg="No data" />}
                    </div>
                </div>
            </div>
        );
    }

    return <Empty msg={`${sub} — select a sub-section above`} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── WEBSITE PANEL ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function WebsitePanel({ sub }: { sub: string }) {
    const projects  = useData<Project>(() => Api.tryList(["/api/projects", "/api/web-projects"]));
    const requests  = useData<ServiceInquiry>(() => Api.tryList(["/api/project-requests", "/api/service-inquiry", "/api/service-inquiries"]));
    const invoices  = useData<Invoice>(() => Api.tryList(["/api/invoices", "/api/web-invoices"]));
    const { show, T } = useToast();

    const updateProjStatus = async (id: string, status: string) => {
        try {
            const paths = [`/api/projects/${id}`, `/api/web-projects/${id}`];
            for (const p of paths) { try { await Api.patch(p, { status }); show("Updated"); projects.refetch(); return; } catch { /* next */ } }
        } catch { show("Failed", "error"); }
    };

    if (projects.loading) return <Spinner />;

    const data = projects.data;
    const totalBudget  = data.reduce((s, p) => s + (p.budget || 0), 0);
    const inProgress   = data.filter(p => p.status === "In Progress").length;
    const completed    = data.filter(p => p.status === "Completed").length;

    if (sub === "Projects Overview" || sub === "Active Projects") {
        return (
            <div>
                <T />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Projects"  value={data.length}          color="#6C63FF" icon="📋" />
                    <StatCard label="Total Budget"    value={fmtK(totalBudget)}    color="#FFA94D" icon="💰" />
                    <StatCard label="In Progress"     value={inProgress}           color="#00C9A7" icon="🔄" />
                    <StatCard label="Completed"       value={completed}            color="#4ECDC4" icon="✅" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>All Projects ({data.length})</span>
                    </div>
                    <Table
                        cols={["Project","Client","Type","Team","Progress","Budget","Due","Status","Action"]}
                        rows={data.map(p => [
                            <div><p style={{ fontWeight: 500, color: "#D0D0E8", fontSize: 12 }}>{p.name}</p><p style={{ fontSize: 10, color: "#555577" }}>{p.projectId}</p></div>,
                            p.client,
                            p.type,
                            p.team || "—",
                            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 100 }}>
                                <div style={{ flex: 1, height: 3, background: "#1E1F2A", borderRadius: 2 }}><div style={{ height: "100%", width: `${p.progress}%`, background: "#6C63FF", borderRadius: 2 }} /></div>
                                <span style={{ fontSize: 10, color: "#888", minWidth: 26 }}>{p.progress}%</span>
                            </div>,
                            fmtINR(p.budget),
                            fmt(p.dueDate),
                            <select value={p.status} onChange={e => updateProjStatus(p._id, e.target.value)} style={{ background: "transparent", border: "none", color: SC[p.status]?.text || "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {["Not Started","Started","In Progress","Review","Completed","On Hold","Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>,
                            <button onClick={() => updateProjStatus(p._id, "Completed")} style={{ fontSize: 10, color: "#00C9A7", background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>✓</button>,
                        ])}
                    />
                    {data.length === 0 && <Empty msg="No projects yet" />}
                </div>
            </div>
        );
    }

    if (sub === "New Requests") {
        return (
            <div>
                <T />
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Service Inquiries ({requests.data.length})</span>
                    </div>
                    <Table
                        cols={["Date","Name","Email","Service","Timeline","Status"]}
                        rows={requests.data.map(q => [
                            fmtDT(q.createdAt),
                            q.name,
                            <span style={{ color: "#6C63FF" }}>{q.email}</span>,
                            q.service,
                            q.timeline,
                            <Badge s={q.status} />,
                        ])}
                    />
                    {requests.data.length === 0 && <Empty msg="No requests" />}
                </div>
            </div>
        );
    }

    if (sub === "Payments & Invoices") {
        const total  = invoices.data.reduce((s, i) => s + (i.amount || 0), 0);
        const paid   = invoices.data.filter(i => i.status === "Paid").reduce((s, i) => s + (i.amount || 0), 0);
        return (
            <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Invoiced"  value={fmtK(total)}       color="#6C63FF" icon="📄" />
                    <StatCard label="Collected"        value={fmtK(paid)}        color="#00C9A7" icon="✅" />
                    <StatCard label="Pending"          value={fmtK(total - paid)} color="#FF6B6B" icon="⏳" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <Table
                        cols={["Invoice ID","Project","Client","Amount","Due","Status"]}
                        rows={invoices.data.map(i => [
                            i.invoiceId || i._id.slice(-6).toUpperCase(),
                            i.projectName,
                            i.client,
                            <span style={{ color: "#6C63FF", fontWeight: 600 }}>{fmtINR(i.amount)}</span>,
                            fmt(i.dueDate),
                            <Badge s={i.status} />,
                        ])}
                    />
                    {invoices.data.length === 0 && <Empty msg="No invoices" />}
                </div>
            </div>
        );
    }

    if (sub === "Completed Projects") {
        const done = data.filter(p => p.status === "Completed");
        return (
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Completed Projects ({done.length})</span>
                </div>
                <Table
                    cols={["Project","Client","Budget","Team","Delivered"]}
                    rows={done.map(p => [
                        <span style={{ color: "#D0D0E8", fontWeight: 500 }}>{p.name}</span>,
                        p.client,
                        fmtINR(p.budget),
                        p.team || "—",
                        fmt(p.dueDate),
                    ])}
                />
                {done.length === 0 && <Empty msg="No completed projects" />}
            </div>
        );
    }

    return <Empty msg={`${sub} — coming soon`} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MARKETING PANEL ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function MarketingPanel({ sub }: { sub: string }) {
    const leads     = useData<Lead>(() => Api.tryList(["/api/leads", "/api/marketing/leads"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));
    const { show, T } = useToast();

    const updateLead = async (id: string, status: string) => {
        try {
            const paths = [`/api/leads/${id}`, `/api/marketing/leads/${id}`];
            for (const p of paths) { try { await Api.patch(p, { status }); show("Updated"); leads.refetch(); return; } catch { /* next */ } }
            show("Failed", "error");
        } catch { show("Failed", "error"); }
    };

    if (leads.loading) return <Spinner />;

    const data = leads.data;
    const newLeads       = data.filter(l => l.status === "New").length;
    const qualified      = data.filter(l => l.status === "Qualified").length;
    const conversionRate = data.length > 0 ? ((qualified / data.length) * 100).toFixed(1) : "0";

    if (sub === "Lead Management" || sub === "Campaign Management") {
        return (
            <div>
                <T />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Leads"     value={data.length}           color="#6C63FF" icon="👥" />
                    <StatCard label="New Leads"       value={newLeads}              color="#00C9A7" icon="⚡" />
                    <StatCard label="Qualified"       value={qualified}             color="#FFA94D" icon="✅" />
                    <StatCard label="Conversion Rate" value={`${conversionRate}%`}  color="#4ECDC4" icon="📊" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>All Leads ({data.length})</span>
                    </div>
                    <Table
                        cols={["Name","Email","Mobile","Source","Status","Date","Action"]}
                        rows={data.map(l => [
                            <span style={{ fontWeight: 500, color: "#D0D0E8" }}>{l.name}</span>,
                            <span style={{ color: "#6C63FF" }}>{l.email}</span>,
                            l.mobile,
                            l.source || "—",
                            <Badge s={l.status} />,
                            fmt(l.createdAt),
                            <select value={l.status} onChange={e => updateLead(l._id, e.target.value)} style={{ background: "transparent", border: "none", color: SC[l.status]?.text || "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {["New","Contacted","Qualified","Lost"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>,
                        ])}
                    />
                    {data.length === 0 && <Empty msg="No leads yet. Add leads from your CRM or website forms." />}
                </div>
            </div>
        );
    }

    if (sub === "Client Communication") {
        return (
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Service Inquiries ({inquiries.data.length})</span>
                </div>
                <Table
                    cols={["Date","Name","Email","Mobile","Service","Timeline","Status"]}
                    rows={inquiries.data.map(q => [
                        fmtDT(q.createdAt),
                        q.name,
                        <span style={{ color: "#6C63FF" }}>{q.email}</span>,
                        q.mobile,
                        q.service,
                        q.timeline,
                        <Badge s={q.status} />,
                    ])}
                />
                {inquiries.data.length === 0 && <Empty msg="No inquiries" />}
            </div>
        );
    }

    if (sub === "Marketing Reports" || sub === "Performance Analytics") {
        const bySource = data.reduce((acc, l) => { const s = l.source || "Unknown"; acc[s] = (acc[s] || 0) + 1; return acc; }, {} as Record<string, number>);
        return (
            <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 14 }}>Leads by Source</h3>
                        {Object.entries(bySource).map(([src, cnt]) => (
                            <div key={src} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1A1B24" }}>
                                <span style={{ fontSize: 12, color: "#AAAACC" }}>{src}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#6C63FF" }}>{cnt}</span>
                            </div>
                        ))}
                        {Object.keys(bySource).length === 0 && <Empty msg="No data" />}
                    </div>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 14 }}>Lead Status Distribution</h3>
                        {["New","Contacted","Qualified","Lost"].map(s => {
                            const cnt = data.filter(l => l.status === s).length;
                            const pct = data.length > 0 ? (cnt / data.length) * 100 : 0;
                            return (
                                <div key={s} style={{ marginBottom: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, color: "#AAAACC" }}>{s}</span>
                                        <span style={{ fontSize: 12, color: SC[s]?.text || "#888" }}>{cnt} ({pct.toFixed(0)}%)</span>
                                    </div>
                                    <div style={{ height: 4, background: "#1E1F2A", borderRadius: 2 }}>
                                        <div style={{ height: "100%", width: `${pct}%`, background: SC[s]?.text || "#666", borderRadius: 2 }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return <Empty msg={`${sub} — data will appear when backend endpoint is connected`} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── FINANCE PANEL ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function FinancePanel({ sub }: { sub: string }) {
    const invoices = useData<Invoice>(() => Api.tryList(["/api/invoices", "/api/web-invoices"]));
    const rentals  = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"]));
    const { show, T } = useToast();

    const updateInvoice = async (id: string, status: string) => {
        try {
            const paths = [`/api/invoices/${id}`, `/api/web-invoices/${id}`];
            for (const p of paths) { try { await Api.patch(p, { status }); show("Updated"); invoices.refetch(); return; } catch { /* next */ } }
            show("Failed", "error");
        } catch { show("Failed", "error"); }
    };

    if (invoices.loading || rentals.loading) return <Spinner />;

    const invData      = invoices.data;
    const rentData     = rentals.data;
    const totalInv     = invData.reduce((s, i) => s + (i.amount || 0), 0);
    const paidInv      = invData.filter(i => i.status === "Paid").reduce((s, i) => s + (i.amount || 0), 0);
    const rentalRev    = rentData.reduce((s, r) => s + (r.totalPrice || 0), 0);
    const totalRevenue = paidInv + rentalRev;

    if (sub === "Dashboard" || sub === "Income") {
        return (
            <div>
                <T />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Revenue"     value={fmtK(totalRevenue)} color="#6C63FF" icon="💰" />
                    <StatCard label="Invoice Income"    value={fmtK(paidInv)}      color="#00C9A7" icon="📄" />
                    <StatCard label="Rental Income"     value={fmtK(rentalRev)}    color="#FFA94D" icon="📷" />
                    <StatCard label="Pending"           value={fmtK(totalInv - paidInv)} color="#FF6B6B" icon="⏳" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Recent Rental Payments</span>
                    </div>
                    <Table
                        cols={["Date","Customer","Product","Days","Amount","Status"]}
                        rows={rentData.slice(0, 10).map(r => [
                            fmt(r.createdAt), r.name, r.productName, `${r.rentalDays}d`,
                            <span style={{ color: "#6C63FF", fontWeight: 600 }}>{fmtINR(r.totalPrice)}</span>,
                            <Badge s={r.status} />,
                        ])}
                    />
                    {rentData.length === 0 && <Empty msg="No payments" />}
                </div>
            </div>
        );
    }

    if (sub === "Invoices" || sub === "Payment Tracking") {
        return (
            <div>
                <T />
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Invoices ({invData.length})</span>
                    </div>
                    <Table
                        cols={["Invoice","Project","Client","Amount","Due","Status","Action"]}
                        rows={invData.map(i => [
                            i.invoiceId || i._id.slice(-6).toUpperCase(),
                            i.projectName,
                            i.client,
                            <span style={{ color: "#6C63FF", fontWeight: 600 }}>{fmtINR(i.amount)}</span>,
                            fmt(i.dueDate),
                            <Badge s={i.status} />,
                            <select value={i.status} onChange={e => updateInvoice(i._id, e.target.value)} style={{ background: "transparent", border: "none", color: SC[i.status]?.text || "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {["Pending","Paid","Overdue","Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>,
                        ])}
                    />
                    {invData.length === 0 && <Empty msg="No invoices" />}
                </div>
            </div>
        );
    }

    if (sub === "Profit & Loss" || sub === "Financial Reports") {
        const exportCSV = () => {
            const rows = rentData.map(r => [r.name, r.productName, r.totalPrice, r.status, fmt(r.createdAt)]);
            const csv = [["Customer","Product","Amount","Status","Date"], ...rows].map(r => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "finance-report.csv"; a.click();
        };
        return (
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#CCCCE0" }}>Financial Overview</span>
                    <button onClick={exportCSV} style={{ fontSize: 11, color: "#6C63FF", background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontFamily: "inherit" }}>📥 Export</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <h3 style={{ fontSize: 13, color: "#CCCCE0", marginBottom: 14 }}>Income Sources</h3>
                        {[{ label: "Rental Revenue", value: rentalRev, color: "#6C63FF" }, { label: "Invoice Collected", value: paidInv, color: "#00C9A7" }].map(s => (
                            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1A1B24" }}>
                                <span style={{ fontSize: 12, color: "#AAAACC" }}>{s.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{fmtINR(s.value)}</span>
                            </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Total Revenue</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#6C63FF" }}>{fmtINR(totalRevenue)}</span>
                        </div>
                    </div>
                    <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <h3 style={{ fontSize: 13, color: "#CCCCE0", marginBottom: 14 }}>Invoice Status</h3>
                        {["Paid","Pending","Overdue"].map(s => {
                            const cnt = invData.filter(i => i.status === s).length;
                            return (
                                <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1A1B24" }}>
                                    <span style={{ fontSize: 12, color: "#AAAACC" }}>{s}</span>
                                    <div style={{ display: "flex", gap: 10 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: SC[s]?.text || "#888" }}>{cnt}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return <Empty msg={`${sub} — connect backend for data`} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── TEAM PANEL ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function TeamPanel({ sub }: { sub: string }) {
    const users = useData<User>(() => Api.tryList(["/api/users", "/api/admin/users", "/api/team/members"]));
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", role: "User" });
    const [saving, setSaving] = useState(false);
    const { show, T } = useToast();

    const handleAdd = async () => {
        if (!form.name || !form.email) { show("Name & email required", "error"); return; }
        setSaving(true);
        try {
            await Api.post("/api/admin/users", { ...form, password: "Admin@1234" });
            show("Member added!"); users.refetch(); setShowForm(false);
            setForm({ name: "", email: "", role: "User" });
        } catch { show("Failed to add member", "error"); }
        finally { setSaving(false); }
    };

    if (users.loading) return <Spinner />;

    const data  = users.data;
    const roles = data.reduce((acc, u) => { const r = u.role || "User"; acc[r] = (acc[r] || 0) + 1; return acc; }, {} as Record<string, number>);

    if (sub === "Employees" || sub === "Team Assignment") {
        return (
            <div>
                <T />
                {showForm && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 12, padding: 24, width: 360 }}>
                            <h3 style={{ color: "#E8E8EF", marginBottom: 16 }}>Add Team Member</h3>
                            {[{ label: "Name", key: "name", type: "text" }, { label: "Email", key: "email", type: "email" }].map(f => (
                                <div key={f.key} style={{ marginBottom: 12 }}>
                                    <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{f.label}</label>
                                    <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: "100%", padding: "8px 12px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 7, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                                </div>
                            ))}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Role</label>
                                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ width: "100%", padding: "8px 12px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 7, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit" }}>
                                    {["User","Admin","Manager","Developer","Designer","Analyst"].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button onClick={handleAdd} disabled={saving} style={{ flex: 1, padding: "9px", background: "#6C63FF", border: "none", borderRadius: 7, color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{saving ? "Adding…" : "Add Member"}</button>
                                <button onClick={() => setShowForm(false)} style={{ padding: "9px 16px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 7, color: "#888", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                    <StatCard label="Total Members" value={data.length}    color="#6C63FF" icon="👥" />
                    <StatCard label="Admins"        value={roles["Admin"] || roles["admin"] || 0} color="#FFA94D" icon="👑" />
                    <StatCard label="Managers"      value={roles["Manager"] || 0} color="#00C9A7" icon="🎯" />
                    <StatCard label="Users"         value={roles["User"] || roles["user"] || 0} color="#4ECDC4" icon="👤" />
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Team Members ({data.length})</span>
                        <button onClick={() => setShowForm(true)} style={{ fontSize: 11, color: "#fff", background: "#6C63FF", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>+ Add Member</button>
                    </div>
                    <Table
                        cols={["Name","Email","Mobile","Role","Joined"]}
                        rows={data.map(u => [
                            <span style={{ fontWeight: 500, color: "#D0D0E8" }}>{u.name}</span>,
                            <span style={{ color: "#6C63FF" }}>{u.email}</span>,
                            u.mobile || "—",
                            <Badge s={u.role || "User"} />,
                            fmt(u.createdAt),
                        ])}
                    />
                    {data.length === 0 && <Empty msg="No team members found" />}
                </div>
            </div>
        );
    }

    if (sub === "Departments" || sub === "Roles & Permissions") {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                {Object.entries(roles).map(([role, count]) => (
                    <div key={role} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                        <p style={{ fontSize: 11, color: "#666688", textTransform: "uppercase", marginBottom: 8 }}>{role}</p>
                        <p style={{ fontSize: 28, fontWeight: 700, color: "#6C63FF" }}>{count}</p>
                        <p style={{ fontSize: 11, color: "#555577", marginTop: 4 }}>member{count !== 1 ? "s" : ""}</p>
                    </div>
                ))}
                {Object.keys(roles).length === 0 && <Empty msg="No role data" />}
            </div>
        );
    }

    return <Empty msg={`${sub} — coming soon`} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── EVENTS PANEL ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function EventsPanel({ sub }: { sub: string }) {
    const events = useData<Event>(() => Api.tryList(["/api/events", "/api/event-requests"]));
    const { show, T } = useToast();

    const updateEvent = async (id: string, status: string) => {
        try {
            const paths = [`/api/events/${id}`, `/api/event-requests/${id}`];
            for (const p of paths) { try { await Api.patch(p, { status }); show("Updated"); events.refetch(); return; } catch { /* next */ } }
            show("Failed", "error");
        } catch { show("Failed", "error"); }
    };

    if (events.loading) return <Spinner />;
    const data = events.data;
    const totalBudget = data.reduce((s, e) => s + (e.budget || 0), 0);

    return (
        <div>
            <T />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                <StatCard label="Total Events"    value={data.length}        color="#6C63FF" icon="🎪" />
                <StatCard label="Total Budget"    value={fmtK(totalBudget)}  color="#FFA94D" icon="💰" />
                <StatCard label="Planned"         value={data.filter(e => e.status === "Planned").length}  color="#00C9A7" icon="📅" />
                <StatCard label="Completed"       value={data.filter(e => e.status === "Completed").length} color="#4ECDC4" icon="✅" />
            </div>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Events ({data.length}) — {sub}</span>
                </div>
                <Table
                    cols={["Event","Client","Date","Venue","Type","Budget","Status","Action"]}
                    rows={data.map(e => [
                        <span style={{ fontWeight: 500, color: "#D0D0E8" }}>{e.eventName}</span>,
                        e.client,
                        fmt(e.date),
                        e.venue || "—",
                        e.type || "—",
                        e.budget ? fmtINR(e.budget) : "—",
                        <Badge s={e.status} />,
                        <select value={e.status} onChange={ev => updateEvent(e._id, ev.target.value)} style={{ background: "transparent", border: "none", color: SC[e.status]?.text || "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            {["Planned","Ongoing","Completed","Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>,
                    ])}
                />
                {data.length === 0 && <Empty msg="No events yet" />}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── SETTINGS PANEL ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function SettingsPanel({ sub }: { sub: string }) {
    const users = useData<User>(() => Api.tryList(["/api/users", "/api/admin/users"]));
    const [search, setSearch] = useState("");
    const { show, T } = useToast();

    const deleteUser = async (id: string) => {
        try {
            await Api.delete(`/api/users/${id}`);
            show("User deleted"); users.refetch();
        } catch { show("Failed", "error"); }
    };

    const updateRole = async (id: string, role: string) => {
        try {
            const paths = [`/api/users/${id}`, `/api/admin/users/${id}`];
            for (const p of paths) { try { await Api.patch(p, { role }); show("Role updated"); users.refetch(); return; } catch { /* next */ } }
            show("Failed", "error");
        } catch { show("Failed", "error"); }
    };

    if (users.loading) return <Spinner />;

    if (sub === "User Management" || sub === "Roles & Permissions") {
        const filtered = users.data.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
        return (
            <div>
                <T />
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1E1F2A", display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", flex: 1 }}>Users ({filtered.length})</span>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" style={{ padding: "5px 10px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 6, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit", width: 180 }} />
                    </div>
                    <Table
                        cols={["Name","Email","Mobile","Role","Joined","Action"]}
                        rows={filtered.map(u => [
                            <span style={{ fontWeight: 500, color: "#D0D0E8" }}>{u.name}</span>,
                            <span style={{ color: "#6C63FF" }}>{u.email}</span>,
                            u.mobile || "—",
                            <select value={u.role || "User"} onChange={e => updateRole(u._id, e.target.value)} style={{ background: "transparent", border: "none", color: SC[u.role || "User"]?.text || "#6C63FF", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                {["User","Admin","Manager","Developer","Designer","Analyst","Rental"].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>,
                            fmt(u.createdAt),
                            <button onClick={() => deleteUser(u._id)} style={{ fontSize: 10, color: "#FF6B6B", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Del</button>,
                        ])}
                    />
                    {filtered.length === 0 && <Empty msg="No users found" />}
                </div>
            </div>
        );
    }

    if (sub === "Company Settings") {
        return (
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 24, maxWidth: 500 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#CCCCE0", marginBottom: 20 }}>Company Settings</h3>
                {[{ label: "Company Name", value: "Crewholic" }, { label: "API Base URL", value: API_BASE }, { label: "Admin Email", value: "admin@crewholic.com" }].map(f => (
                    <div key={f.label} style={{ marginBottom: 14 }}>
                        <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{f.label}</label>
                        <input defaultValue={f.value} style={{ width: "100%", padding: "8px 12px", background: "#0F1017", border: "1px solid #1E1F2A", borderRadius: 7, color: "#E8E8EF", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                    </div>
                ))}
                <button onClick={() => show("Settings saved!")} style={{ padding: "9px 20px", background: "#6C63FF", border: "none", borderRadius: 7, color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save Settings</button>
                <T />
            </div>
        );
    }

    return <Empty msg={`${sub} — coming soon`} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── NOTIFICATIONS PANEL ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function NotificationsPanel() {
    const rentals   = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));

    const pendingRentals   = rentals.data.filter(r => r.status === "pending");
    const pendingInquiries = inquiries.data.filter(q => q.status === "Pending");

    const allNotifs = [
        ...pendingRentals.map(r => ({ type: "Rental",   color: "#6C63FF", icon: "📷", msg: `New rental: ${r.productName} by ${r.name}`,   time: r.createdAt })),
        ...pendingInquiries.map(q => ({ type: "Inquiry", color: "#00C9A7", icon: "📋", msg: `New inquiry: ${q.service} from ${q.name}`,     time: q.createdAt })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    if (rentals.loading || inquiries.loading) return <Spinner />;

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                <StatCard label="Pending Rentals"   value={pendingRentals.length}   color="#6C63FF" icon="📷" />
                <StatCard label="Pending Inquiries" value={pendingInquiries.length} color="#FFA94D" icon="📋" />
                <StatCard label="Total Alerts"      value={allNotifs.length}        color="#FF6B6B" icon="🔔" />
            </div>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 14 }}>All Notifications</h3>
                {allNotifs.length === 0 ? <Empty msg="No pending notifications 🎉" /> :
                    allNotifs.map((n, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #1A1B24", alignItems: "flex-start" }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: n.color + "20", border: `1px solid ${n.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n.icon}</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 12, color: "#AAAACC", lineHeight: 1.4 }}>{n.msg}</p>
                                <span style={{ fontSize: 10, color: "#555577" }}>{fmtDT(n.time)}</span>
                            </div>
                            <Badge s={n.type} />
                        </div>
                    ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── REPORTS PANEL ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function ReportsPanel({ sub }: { sub: string }) {
    const rentals   = useData<RentalOrder>(() => Api.tryList(["/api/rental-inquiry", "/api/rental-inquiries"]));
    const projects  = useData<Project>(() => Api.tryList(["/api/projects", "/api/web-projects"]));
    const inquiries = useData<ServiceInquiry>(() => Api.tryList(["/api/service-inquiry", "/api/service-inquiries"]));

    if (rentals.loading || projects.loading) return <Spinner />;

    const r = rentals.data;
    const p = projects.data;
    const q = inquiries.data;

    const rentalRev  = r.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const projBudget = p.reduce((s, o) => s + (o.budget || 0), 0);

    const exportAll = () => {
        const rows = [
            ["=== RENTAL ORDERS ==="],
            ["Name","Email","Product","Days","Total","Status"],
            ...r.map(o => [o.name, o.email, o.productName, o.rentalDays, o.totalPrice, o.status]),
            [],
            ["=== SERVICE INQUIRIES ==="],
            ["Name","Email","Service","Timeline","Status"],
            ...q.map(o => [o.name, o.email, o.service, o.timeline, o.status]),
        ];
        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "full-report.csv"; a.click();
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#CCCCE0" }}>{sub}</span>
                <button onClick={exportAll} style={{ fontSize: 11, color: "#6C63FF", background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>📥 Export All CSV</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
                <StatCard label="Total Rental Orders"     value={r.length}           color="#6C63FF" icon="📷" />
                <StatCard label="Rental Revenue"          value={fmtK(rentalRev)}    color="#00C9A7" icon="💰" />
                <StatCard label="Total Projects"          value={p.length}           color="#FFA94D" icon="📋" />
                <StatCard label="Project Budget"          value={fmtK(projBudget)}   color="#FF6B6B" icon="🏗️" />
                <StatCard label="Service Inquiries"       value={q.length}           color="#4ECDC4" icon="📩" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                    <h3 style={{ fontSize: 13, color: "#CCCCE0", marginBottom: 14 }}>Rental by Category</h3>
                    {Object.entries(r.reduce((acc, o) => { acc[o.categoryName] = (acc[o.categoryName] || 0) + o.totalPrice; return acc; }, {} as Record<string, number>)).map(([cat, rev]) => (
                        <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1A1B24" }}>
                            <span style={{ fontSize: 12, color: "#AAAACC" }}>{cat}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#6C63FF" }}>{fmtINR(rev)}</span>
                        </div>
                    ))}
                    {r.length === 0 && <Empty msg="No data" />}
                </div>
                <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                    <h3 style={{ fontSize: 13, color: "#CCCCE0", marginBottom: 14 }}>Projects by Status</h3>
                    {["In Progress","Review","Completed","On Hold","Cancelled"].map(s => {
                        const cnt = p.filter(o => o.status === s).length;
                        return cnt > 0 ? (
                            <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1A1B24" }}>
                                <span style={{ fontSize: 12, color: "#AAAACC" }}>{s}</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: SC[s]?.text || "#888" }}>{cnt}</span>
                            </div>
                        ) : null;
                    })}
                    {p.length === 0 && <Empty msg="No data" />}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MAIN ADMIN DASHBOARD ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function AdminDashboard() {
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState("dashboard");
    const [activeSub, setActiveSub]     = useState("Overview");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [clock, setClock]             = useState(new Date());
    const [profileOpen, setProfileOpen] = useState(false);
    const [adminUser, setAdminUser]     = useState<{ name: string; email: string; role?: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate({ to: "/login" }); return; }
        try { const u = JSON.parse(localStorage.getItem("user") || "{}"); setAdminUser(u); } catch {}
        const t = setInterval(() => setClock(new Date()), 1000);
        const click = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest("[data-admin-profile]")) setProfileOpen(false); };
        document.addEventListener("click", click);
        return () => { clearInterval(t); document.removeEventListener("click", click); };
    }, [navigate]);

    const currentNav = NAV.find(n => n.id === activePanel);

    const renderPanel = () => {
        switch (activePanel) {
            case "dashboard":     return <DashboardPanel sub={activeSub} />;
            case "rental":        return <RentalPanel sub={activeSub} />;
            case "website":       return <WebsitePanel sub={activeSub} />;
            case "marketing":     return <MarketingPanel sub={activeSub} />;
            case "finance":       return <FinancePanel sub={activeSub} />;
            case "events":        return <EventsPanel sub={activeSub} />;
            case "team":          return <TeamPanel sub={activeSub} />;
            case "notifications": return <NotificationsPanel />;
            case "reports":       return <ReportsPanel sub={activeSub} />;
            case "settings":      return <SettingsPanel sub={activeSub} />;
            default:              return (
                <div style={{ textAlign: "center", padding: 60, color: "#555577" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{currentNav?.icon}</div>
                    <p style={{ fontSize: 16, color: "#888", marginBottom: 8 }}>{currentNav?.label}</p>
                    <p style={{ fontSize: 12 }}>{activeSub} — connect your backend endpoint to see live data</p>
                </div>
            );
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF", overflow: "hidden" }}>

            {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
            <aside style={{ width: sidebarOpen ? 240 : 64, background: "#0F1117", borderRight: "1px solid #1E1F2A", display: "flex", flexDirection: "column", transition: "width 0.25s cubic-bezier(.4,0,.2,1)", overflow: "hidden", flexShrink: 0, zIndex: 10 }}>
                {/* Logo */}
                <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #1E1F2A", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#6C63FF,#00C9A7)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⬡</div>
                    {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", background: "linear-gradient(90deg,#fff,#A0A0C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CREWHOLIC ADMIN</span>}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0", scrollbarWidth: "none" }}>
                    {NAV.map(n => (
                        <button key={n.id} onClick={() => { setActivePanel(n.id); setActiveSub(n.sub[0]); if (!sidebarOpen) setSidebarOpen(true); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", background: activePanel === n.id ? "rgba(108,99,255,0.15)" : "transparent", border: "none", cursor: "pointer", color: activePanel === n.id ? "#6C63FF" : "#8888AA", fontSize: 13, fontWeight: activePanel === n.id ? 600 : 400, borderLeft: activePanel === n.id ? "2px solid #6C63FF" : "2px solid transparent", transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                            <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                            {sidebarOpen && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{n.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Connection status */}
                {sidebarOpen && (
                    <div style={{ padding: "8px 16px", borderTop: "1px solid #1E1F2A" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C9A7" }} />
                            <span style={{ fontSize: 10, color: "#555577" }}>Connected</span>
                        </div>
                        <p style={{ fontSize: 9, color: "#333", marginTop: 2, fontFamily: "monospace", wordBreak: "break-all" }}>{API_BASE}</p>
                    </div>
                )}

                {/* Collapse btn */}
                <button onClick={() => setSidebarOpen(p => !p)} style={{ margin: "8px 12px", padding: 8, background: "#1A1B25", border: "1px solid #2A2B38", borderRadius: 8, cursor: "pointer", color: "#6666AA", fontSize: 12, display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-end" : "center", fontFamily: "inherit" }}>
                    {sidebarOpen ? "← collapse" : "→"}
                </button>
            </aside>

            {/* ── MAIN ────────────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* Header */}
                <header style={{ background: "#0F1117", borderBottom: "1px solid #1E1F2A", padding: "0 20px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#E8E8EF" }}>{currentNav?.label}</h1>
                        <span style={{ fontSize: 11, color: "#555577", padding: "2px 8px", background: "#1A1B25", borderRadius: 4 }}>{activeSub}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ fontSize: 11, color: "#555577", fontFamily: "monospace" }}>{clock.toLocaleTimeString()}</span>
                        {/* Profile */}
                        <div data-admin-profile style={{ position: "relative" }}>
                            <button onClick={e => { e.stopPropagation(); setProfileOpen(p => !p); }}
                                style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF,#00C9A7)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>
                                {adminUser?.name?.charAt(0).toUpperCase() || "A"}
                            </button>
                            {profileOpen && (
                                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 220, background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 100, overflow: "hidden" }}>
                                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1E1F2A", background: "rgba(108,99,255,0.06)" }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "#E8E8EF" }}>{adminUser?.name || "Admin"}</p>
                                        <p style={{ fontSize: 10, color: "#666688" }}>{adminUser?.email}</p>
                                        <p style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{adminUser?.role || "Administrator"}</p>
                                    </div>
                                    <div style={{ padding: "6px 0" }}>
                                        {[{ label: "Go to Main Site", icon: "⌂", href: "/" }, { label: "Rental Admin",  icon: "◧", href: "/rental" }, { label: "Web Panel",    icon: "◈", href: "/webpanel" }].map(item => (
                                            <button key={item.label} onClick={() => window.location.href = item.href}
                                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", background: "transparent", border: "none", color: "#CCCCE0", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(108,99,255,0.08)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                <span style={{ fontSize: 14 }}>{item.icon}</span><span>{item.label}</span>
                                            </button>
                                        ))}
                                        <div style={{ height: 1, background: "#1E1F2A", margin: "4px 0" }} />
                                        <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }}
                                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", background: "transparent", border: "none", color: "#FF6B6B", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontWeight: 500 }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.08)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <span>⎋</span><span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Sub panels + content */}
                <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                    {/* Sub nav */}
                    <aside style={{ width: 190, background: "#0D0E14", borderRight: "1px solid #1A1B24", overflowY: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
                        <div style={{ padding: "10px 0" }}>
                            {currentNav?.sub.map(s => (
                                <button key={s} onClick={() => setActiveSub(s)}
                                    style={{ width: "100%", textAlign: "left", padding: "8px 14px", background: activeSub === s ? "rgba(108,99,255,0.1)" : "transparent", border: "none", cursor: "pointer", color: activeSub === s ? "#9D97FF" : "#666688", fontSize: 11, fontWeight: activeSub === s ? 500 : 400, borderLeft: activeSub === s ? "2px solid #6C63FF" : "2px solid transparent", transition: "all 0.1s", fontFamily: "inherit" }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content */}
                    <main style={{ flex: 1, overflowY: "auto", padding: 20, scrollbarWidth: "thin", scrollbarColor: "#1E1F2A transparent" }}>
                        {renderPanel()}
                    </main>
                </div>
            </div>
        </div>
    );
}