/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
// webpanel.tsx
export const Route = createFileRoute("/webpanel")({
    component: WebsitePanel,
});

const ACCENT = "#00C9A7";
const ACCENT2 = "#0097FF";

const SIDEBAR_ITEMS = [
    { id: "overview", label: "Projects Overview", icon: "▦" },
    { id: "requests", label: "New Requests", icon: "◈" },
    { id: "teams", label: "Assigned Teams", icon: "◉" },
    { id: "details", label: "Project Details", icon: "◎" },
    { id: "timeline", label: "Project Timeline", icon: "◑" },
    { id: "progress", label: "Work Progress Tracking", icon: "◐" },
    { id: "comms", label: "Client Communication", icon: "◒" },
    { id: "files", label: "File Management", icon: "◓" },
    { id: "deliverables", label: "Deliverables", icon: "◔" },
    { id: "payments", label: "Payments & Invoices", icon: "◕" },
    { id: "completed", label: "Completed Projects", icon: "◆" },
    { id: "reports", label: "Reports", icon: "◧" },
];

const PROJECTS = [
    { id: "PRJ-001", name: "TechCorp India Portal", client: "TechCorp India", status: "In Progress", progress: 78, team: "Team Alpha", budget: "₹3,20,000", due: "Dec 20, 2024", type: "Corporate Website" },
    { id: "PRJ-002", name: "StyleHub E-Commerce", client: "StyleHub Pvt Ltd", status: "In Progress", progress: 45, team: "Team Beta", budget: "₹5,80,000", due: "Jan 10, 2025", type: "E-Commerce" },
    { id: "PRJ-003", name: "MedConnect Patient Portal", client: "MedConnect Health", status: "Review", progress: 92, team: "Team Gamma", budget: "₹2,40,000", due: "Dec 15, 2024", type: "Healthcare Portal" },
    { id: "PRJ-004", name: "GreenLeaf Landing Page", client: "GreenLeaf Organics", status: "Started", progress: 20, team: "Team Delta", budget: "₹85,000", due: "Jan 25, 2025", type: "Landing Page" },
    { id: "PRJ-005", name: "FinEdge Dashboard", client: "FinEdge Solutions", status: "In Progress", progress: 61, team: "Team Alpha", budget: "₹4,10,000", due: "Jan 5, 2025", type: "SaaS Dashboard" },
];

const REQUESTS = [
    { id: "REQ-014", client: "Bluewave Media", project: "News Portal Redesign", budget: "₹2,20,000", received: "Dec 9", priority: "High" },
    { id: "REQ-015", client: "AgroTech Solutions", project: "B2B Marketplace", budget: "₹6,40,000", received: "Dec 10", priority: "Medium" },
    { id: "REQ-016", client: "Rhythm Music Co.", project: "Artist Portfolio Site", budget: "₹95,000", received: "Dec 11", priority: "Low" },
];

const TEAM_DATA = [
    { name: "Team Alpha", lead: "Rohan Mehta", members: 5, projects: 2, utilization: 88 },
    { name: "Team Beta", lead: "Priya Sharma", members: 4, projects: 1, utilization: 72 },
    { name: "Team Gamma", lead: "Arjun Nair", members: 6, projects: 2, utilization: 95 },
    { name: "Team Delta", lead: "Sneha Kapoor", members: 3, projects: 1, utilization: 55 },
];

const INVOICES = [
    { id: "INV-2847", client: "TechCorp India", amount: "₹1,40,000", status: "Paid", date: "Dec 5" },
    { id: "INV-2848", client: "StyleHub Pvt Ltd", amount: "₹2,90,000", status: "Pending", date: "Dec 8" },
    { id: "INV-2849", client: "MedConnect Health", amount: "₹80,000", status: "Paid", date: "Dec 10" },
    { id: "INV-2850", client: "FinEdge Solutions", amount: "₹1,20,000", status: "Overdue", date: "Nov 30" },
];

const statusColor = {
    "In Progress": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    "Review": { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
    "Started": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    "Completed": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    "High": { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
    "Medium": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    "Low": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    "Paid": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
    "Pending": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
    "Overdue": { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
};

const Badge = ({ status }) => {
    const s = statusColor[status] || { bg: "#1E1F2A", text: "#888" };
    return (
        <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: s.bg, color: s.text, fontWeight: 600 }}>{status}</span>
    );
};

const ProgressBar = ({ value, color = ACCENT }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 4, background: "#1E1F2A", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 10, color: "#8888AA", minWidth: 28 }}>{value}%</span>
    </div>
);

function OverviewTab() {
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
                {[
                    { label: "Total Projects", value: "47", sub: "+3 this week", color: ACCENT },
                    { label: "In Progress", value: "28", sub: "Across 4 teams", color: ACCENT2 },
                    { label: "Completed This Month", value: "9", sub: "₹18.4L delivered", color: "#FFA94D" },
                    { label: "Pending Reviews", value: "6", sub: "Awaiting client", color: "#FF6B6B" },
                ].map(m => (
                    <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
                        <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
                        <p style={{ fontSize: 24, fontWeight: 700, color: "#EEEEF5", marginBottom: 4 }}>{m.value}</p>
                        <span style={{ fontSize: 10, color: m.color }}>{m.sub}</span>
                    </div>
                ))}
            </div>

            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>All Projects</span>
                    <button style={{ fontSize: 11, color: ACCENT, background: "transparent", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>+ New Project</button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#0F1017" }}>
                            {["Project", "Client", "Type", "Team", "Progress", "Budget", "Due Date", "Status"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PROJECTS.map((p, i) => (
                            <tr key={p.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{p.name}</div>
                                    <div style={{ fontSize: 10, color: "#555577" }}>{p.id}</div>
                                </td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{p.client}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688" }}>{p.type}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{p.team}</td>
                                <td style={{ padding: "12px 14px", minWidth: 120 }}><ProgressBar value={p.progress} /></td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#AAAACC", fontWeight: 500 }}>{p.budget}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688" }}>{p.due}</td>
                                <td style={{ padding: "12px 14px" }}><Badge status={p.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function RequestsTab() {
    return (
        <div>
            <div style={{ display: "grid", gap: 14 }}>
                {REQUESTS.map(r => (
                    <div key={r.id} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                            <div style={{ width: 42, height: 42, background: "rgba(0,151,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: ACCENT2 }}>◈</div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#D0D0E8", marginBottom: 2 }}>{r.project}</p>
                                <p style={{ fontSize: 11, color: "#666688" }}>{r.client} · Received {r.received}</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div>
                                <p style={{ fontSize: 10, color: "#555577", marginBottom: 2 }}>Budget</p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{r.budget}</p>
                            </div>
                            <Badge status={r.priority} />
                            <div style={{ display: "flex", gap: 8 }}>
                                <button style={{ fontSize: 11, padding: "6px 14px", background: ACCENT, border: "none", borderRadius: 6, color: "#000", fontWeight: 600, cursor: "pointer" }}>Accept</button>
                                <button style={{ fontSize: 11, padding: "6px 14px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 6, color: "#888", cursor: "pointer" }}>Decline</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TeamsTab() {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {TEAM_DATA.map(t => (
                <div key={t.name} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#D0D0E8", marginBottom: 2 }}>{t.name}</p>
                            <p style={{ fontSize: 11, color: "#666688" }}>Lead: {t.lead}</p>
                        </div>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `conic-gradient(${ACCENT} ${t.utilization * 3.6}deg, #1E1F2A 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#13141C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: ACCENT }}>{t.utilization}%</div>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ background: "#0F1017", borderRadius: 7, padding: "10px 12px" }}>
                            <p style={{ fontSize: 10, color: "#555577", marginBottom: 3 }}>Members</p>
                            <p style={{ fontSize: 18, fontWeight: 700, color: "#EEEEF5" }}>{t.members}</p>
                        </div>
                        <div style={{ background: "#0F1017", borderRadius: 7, padding: "10px 12px" }}>
                            <p style={{ fontSize: 10, color: "#555577", marginBottom: 3 }}>Active Projects</p>
                            <p style={{ fontSize: 18, fontWeight: 700, color: ACCENT2 }}>{t.projects}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PaymentsTab() {
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
                {[
                    { label: "Total Invoiced", value: "₹28.4L", color: ACCENT },
                    { label: "Amount Received", value: "₹19.2L", color: ACCENT2 },
                    { label: "Pending / Overdue", value: "₹9.2L", color: "#FF6B6B" },
                ].map(m => (
                    <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
                        <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>
            <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Invoice History</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#0F1017" }}>
                            {["Invoice ID", "Client", "Amount", "Date", "Status", "Action"].map(h => (
                                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {INVOICES.map((inv, i) => (
                            <tr key={inv.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                                <td style={{ padding: "12px 16px", fontSize: 12, color: ACCENT2, fontWeight: 500 }}>{inv.id}</td>
                                <td style={{ padding: "12px 16px", fontSize: 11, color: "#AAAACC" }}>{inv.client}</td>
                                <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#EEEEF5" }}>{inv.amount}</td>
                                <td style={{ padding: "12px 16px", fontSize: 11, color: "#666688" }}>{inv.date}</td>
                                <td style={{ padding: "12px 16px" }}><Badge status={inv.status} /></td>
                                <td style={{ padding: "12px 16px" }}>
                                    <button style={{ fontSize: 10, padding: "4px 10px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 5, color: "#8888AA", cursor: "pointer" }}>Download</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const TAB_CONTENT = {
    overview: <OverviewTab />,
    requests: <RequestsTab />,
    teams: <TeamsTab />,
    payments: <PaymentsTab />,
};

export default function WebsitePanel() {
    const [active, setActive] = useState("overview");

    return (
        <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF" }}>
            {/* Sidebar */}
            <aside style={{ width: 220, background: "#0F1117", borderRight: "1px solid #1E1F2A", flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #1E1F2A", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◈</div>
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#E8E8EF" }}>Website Panel</p>
                        <p style={{ fontSize: 10, color: "#555577" }}>Creation & Management</p>
                    </div>
                </div>
                <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0", scrollbarWidth: "none" }}>
                    {SIDEBAR_ITEMS.map(item => (
                        <button key={item.id} onClick={() => setActive(item.id)} style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px",
                            background: active === item.id ? "rgba(0,201,167,0.12)" : "transparent",
                            border: "none", cursor: "pointer",
                            color: active === item.id ? ACCENT : "#777799",
                            fontSize: 12, fontWeight: active === item.id ? 600 : 400,
                            borderLeft: `2px solid ${active === item.id ? ACCENT : "transparent"}`,
                            transition: "all 0.15s", textAlign: "left",
                        }}>
                            <span style={{ fontSize: 13 }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <header style={{ background: "#0F1117", borderBottom: "1px solid #1E1F2A", padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div>
                        <h1 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>
                            {SIDEBAR_ITEMS.find(s => s.id === active)?.label}
                        </h1>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={{ fontSize: 11, padding: "6px 14px", background: `rgba(0,201,167,0.1)`, border: `1px solid ${ACCENT}30`, borderRadius: 6, color: ACCENT, cursor: "pointer" }}>Export</button>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000", cursor: "pointer" }}>W</div>
                    </div>
                </header>
                <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
                    {TAB_CONTENT[active] || (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#444466", fontSize: 13 }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
                                <p>{SIDEBAR_ITEMS.find(s => s.id === active)?.label}</p>
                                <p style={{ fontSize: 11, marginTop: 6 }}>Content coming soon</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}