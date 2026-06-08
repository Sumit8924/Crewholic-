/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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

const TIMELINE_DATA = [
    {
        project: "TechCorp India Portal", id: "PRJ-001",
        milestones: [
            { label: "Kickoff & Discovery", date: "Oct 1", done: true },
            { label: "Wireframes & Design", date: "Oct 20", done: true },
            { label: "Frontend Development", date: "Nov 15", done: true },
            { label: "Backend Integration", date: "Dec 5", done: false },
            { label: "QA & Testing", date: "Dec 15", done: false },
            { label: "Go Live", date: "Dec 20", done: false },
        ],
    },
    {
        project: "StyleHub E-Commerce", id: "PRJ-002",
        milestones: [
            { label: "Kickoff & Discovery", date: "Oct 10", done: true },
            { label: "UI/UX Design", date: "Nov 1", done: true },
            { label: "Product Catalog Dev", date: "Nov 28", done: false },
            { label: "Payment Integration", date: "Dec 20", done: false },
            { label: "Testing & Launch", date: "Jan 10", done: false },
        ],
    },
    {
        project: "MedConnect Patient Portal", id: "PRJ-003",
        milestones: [
            { label: "Requirements Gathering", date: "Sep 15", done: true },
            { label: "System Architecture", date: "Oct 5", done: true },
            { label: "Core Module Dev", date: "Nov 10", done: true },
            { label: "Client Review", date: "Dec 5", done: true },
            { label: "Final Fixes", date: "Dec 12", done: false },
            { label: "Deployment", date: "Dec 15", done: false },
        ],
    },
];

const PROGRESS_TASKS = [
    { project: "PRJ-001", task: "Build responsive navbar", assignee: "Ravi K.", status: "Done", priority: "High", updated: "Dec 10" },
    { project: "PRJ-001", task: "API integration for CMS", assignee: "Anjali M.", status: "In Progress", priority: "High", updated: "Dec 11" },
    { project: "PRJ-002", task: "Product listing page", assignee: "Karan S.", status: "In Progress", priority: "Medium", updated: "Dec 9" },
    { project: "PRJ-002", task: "Shopping cart logic", assignee: "Deepa R.", status: "Pending", priority: "High", updated: "Dec 8" },
    { project: "PRJ-003", task: "Patient dashboard UI", assignee: "Arjun N.", status: "Done", priority: "Medium", updated: "Dec 7" },
    { project: "PRJ-003", task: "Doctor appointment module", assignee: "Pooja T.", status: "Review", priority: "High", updated: "Dec 10" },
    { project: "PRJ-004", task: "Hero section animation", assignee: "Sneha K.", status: "In Progress", priority: "Low", updated: "Dec 11" },
    { project: "PRJ-005", task: "Analytics chart integration", assignee: "Rohan M.", status: "Pending", priority: "Medium", updated: "Dec 9" },
];

const COMMS_DATA = [
    { project: "TechCorp India Portal", client: "Rajesh Verma", message: "Can we schedule a demo this Friday at 3 PM?", time: "Dec 11, 10:32 AM", unread: true, avatar: "R" },
    { project: "StyleHub E-Commerce", client: "Neha Joshi", message: "Please update the product filter as discussed.", time: "Dec 10, 4:15 PM", unread: true, avatar: "N" },
    { project: "MedConnect Health", client: "Dr. Arora", message: "The patient portal UI looks great. Approved!", time: "Dec 9, 11:00 AM", unread: false, avatar: "A" },
    { project: "FinEdge Solutions", client: "Suresh Pillai", message: "Need the dashboard report section by next week.", time: "Dec 8, 2:45 PM", unread: false, avatar: "S" },
    { project: "GreenLeaf Organics", client: "Meera Nair", message: "Send over the latest design mockups please.", time: "Dec 7, 9:20 AM", unread: false, avatar: "M" },
];

const FILES_DATA = [
    { name: "TechCorp_Wireframes_v3.fig", project: "PRJ-001", type: "Design", size: "8.4 MB", uploaded: "Dec 8", by: "Anjali M." },
    { name: "TechCorp_API_Docs.pdf", project: "PRJ-001", type: "Document", size: "1.2 MB", uploaded: "Dec 5", by: "Ravi K." },
    { name: "StyleHub_UI_Kit.sketch", project: "PRJ-002", type: "Design", size: "14.7 MB", uploaded: "Nov 30", by: "Karan S." },
    { name: "StyleHub_Requirements.docx", project: "PRJ-002", type: "Document", size: "340 KB", uploaded: "Oct 12", by: "Priya S." },
    { name: "MedConnect_DB_Schema.sql", project: "PRJ-003", type: "Database", size: "92 KB", uploaded: "Oct 8", by: "Arjun N." },
    { name: "MedConnect_Final_Review.mp4", project: "PRJ-003", type: "Video", size: "210 MB", uploaded: "Dec 5", by: "Pooja T." },
    { name: "FinEdge_Dashboard_Proto.xd", project: "PRJ-005", type: "Design", size: "6.1 MB", uploaded: "Dec 1", by: "Rohan M." },
    { name: "GreenLeaf_BrandAssets.zip", project: "PRJ-004", type: "Archive", size: "22.3 MB", uploaded: "Dec 3", by: "Sneha K." },
];

const DELIVERABLES_DATA = [
    { project: "TechCorp India Portal", id: "PRJ-001", items: [
        { label: "Brand & Style Guide", done: true },
        { label: "Responsive Web Design", done: true },
        { label: "CMS Integration", done: false },
        { label: "SEO Setup", done: false },
        { label: "Deployment & Handover", done: false },
    ]},
    { project: "StyleHub E-Commerce", id: "PRJ-002", items: [
        { label: "UI/UX Design System", done: true },
        { label: "Product Catalog Module", done: false },
        { label: "Payment Gateway", done: false },
        { label: "Admin Panel", done: false },
        { label: "Mobile Responsive", done: false },
    ]},
    { project: "MedConnect Patient Portal", id: "PRJ-003", items: [
        { label: "Patient Registration Flow", done: true },
        { label: "Doctor Listing & Booking", done: true },
        { label: "Medical Records Module", done: true },
        { label: "Notification System", done: false },
        { label: "Final QA & Go Live", done: false },
    ]},
    { project: "FinEdge Dashboard", id: "PRJ-005", items: [
        { label: "Dashboard UI Design", done: true },
        { label: "Analytics Charts", done: false },
        { label: "User Roles & Permissions", done: false },
        { label: "Report Export (PDF/CSV)", done: false },
    ]},
];

const COMPLETED_PROJECTS = [
    { id: "PRJ-C01", name: "Nexus Startup Website", client: "Nexus Technologies", type: "Corporate Website", team: "Team Alpha", budget: "₹1,80,000", delivered: "Nov 20, 2024", rating: 5 },
    { id: "PRJ-C02", name: "FreshBox Landing Page", client: "FreshBox India", type: "Landing Page", team: "Team Delta", budget: "₹65,000", delivered: "Nov 14, 2024", rating: 4 },
    { id: "PRJ-C03", name: "EduPath LMS Portal", client: "EduPath Learning", type: "Education Portal", team: "Team Gamma", budget: "₹4,20,000", delivered: "Oct 30, 2024", rating: 5 },
    { id: "PRJ-C04", name: "BoldAds Agency Site", client: "BoldAds Creative", type: "Agency Website", team: "Team Beta", budget: "₹2,10,000", delivered: "Oct 18, 2024", rating: 4 },
    { id: "PRJ-C05", name: "CityPark Real Estate App", client: "CityPark Realty", type: "Real Estate Portal", team: "Team Gamma", budget: "₹5,50,000", delivered: "Oct 5, 2024", rating: 5 },
];

const REPORTS_STATS = [
    { label: "Total Revenue (2024)", value: "₹48.6L", change: "+22%", color: ACCENT },
    { label: "Projects Delivered", value: "34", change: "+8 YoY", color: ACCENT2 },
    { label: "Avg. Delivery Time", value: "47 days", change: "-3 days", color: "#FFA94D" },
    { label: "Client Satisfaction", value: "4.7 / 5", change: "+0.3", color: "#A78BFA" },
];

const REPORTS_MONTHLY = [
    { month: "Jul", revenue: 3.2, projects: 4 },
    { month: "Aug", revenue: 4.8, projects: 5 },
    { month: "Sep", revenue: 6.1, projects: 6 },
    { month: "Oct", revenue: 5.4, projects: 5 },
    { month: "Nov", revenue: 7.9, projects: 7 },
    { month: "Dec", revenue: 4.2, projects: 4 },
];

// ─── Shared Styles ────────────────────────────────────────────────────────────
const card = (extra = {}): React.CSSProperties => ({
    background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, ...extra,
});

const statusColor: Record<string, { bg: string; text: string }> = {
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
    "Done": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
};

const Badge = ({ status }: { status: string }) => {
    const s = statusColor[status] || { bg: "#1E1F2A", text: "#888" };
    return (
        <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: s.bg, color: s.text, fontWeight: 600 }}>
            {status}
        </span>
    );
};

const ProgressBar = ({ value, color = ACCENT }: { value: number; color?: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 4, background: "#1E1F2A", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 10, color: "#8888AA", minWidth: 28 }}>{value}%</span>
    </div>
);

const SectionHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
    <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>{title}</span>
        {action}
    </div>
);

const StarRating = ({ value }: { value: number }) => (
    <span style={{ color: "#FFA94D", fontSize: 12, letterSpacing: 1 }}>
        {"★".repeat(value)}{"☆".repeat(5 - value)}
    </span>
);

// ─── Tab: Overview ────────────────────────────────────────────────────────────
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
                    <div key={m.label} style={card({ padding: "14px 16px" })}>
                        <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
                        <p style={{ fontSize: 24, fontWeight: 700, color: "#EEEEF5", marginBottom: 4 }}>{m.value}</p>
                        <span style={{ fontSize: 10, color: m.color }}>{m.sub}</span>
                    </div>
                ))}
            </div>
            <div style={card({ overflow: "hidden" })}>
                <SectionHeader title="All Projects" action={
                    <button style={{ fontSize: 11, color: ACCENT, background: "transparent", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>+ New Project</button>
                } />
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

// ─── Tab: Requests ────────────────────────────────────────────────────────────
function RequestsTab() {
    return (
        <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 4 }}>
                {[
                    { label: "Total Requests", value: "3", color: ACCENT2 },
                    { label: "High Priority", value: "1", color: "#FF6B6B" },
                    { label: "Est. Pipeline Value", value: "₹9,55,000", color: ACCENT },
                ].map(m => (
                    <div key={m.label} style={card({ padding: "14px 16px" })}>
                        <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>
            {REQUESTS.map(r => (
                <div key={r.id} style={card({ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" })}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ width: 42, height: 42, background: "rgba(0,151,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: ACCENT2 }}>◈</div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#D0D0E8", marginBottom: 2 }}>{r.project}</p>
                            <p style={{ fontSize: 11, color: "#666688" }}>{r.client} · Received {r.received} · <span style={{ color: "#555577" }}>{r.id}</span></p>
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
    );
}

// ─── Tab: Teams ───────────────────────────────────────────────────────────────
function TeamsTab() {
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {TEAM_DATA.map(t => (
                    <div key={t.name} style={card({ padding: 18 })}>
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
                        <div style={{ marginTop: 12 }}>
                            <p style={{ fontSize: 10, color: "#555577", marginBottom: 5 }}>Team Utilization</p>
                            <ProgressBar value={t.utilization} color={t.utilization > 90 ? "#FF6B6B" : ACCENT} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Tab: Project Details ─────────────────────────────────────────────────────
function DetailsTab({ onNavigate }: { onNavigate: (id: string) => void }) {
    const [selected, setSelected] = useState(PROJECTS[0].id);
    const proj = PROJECTS.find(p => p.id === selected)!;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14 }}>
            {/* Project list */}
            <div style={card({ overflow: "hidden", alignSelf: "start" })}>
                <SectionHeader title="Projects" />
                {PROJECTS.map(p => (
                    <button key={p.id} onClick={() => setSelected(p.id)} style={{
                        width: "100%", textAlign: "left", padding: "11px 14px",
                        background: selected === p.id ? "rgba(0,201,167,0.1)" : "transparent",
                        border: "none", borderLeft: `2px solid ${selected === p.id ? ACCENT : "transparent"}`,
                        borderBottom: "1px solid #1A1B24", cursor: "pointer",
                    }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: selected === p.id ? ACCENT : "#CCCCDD", marginBottom: 2 }}>{p.name}</p>
                        <p style={{ fontSize: 10, color: "#555577" }}>{p.id}</p>
                    </button>
                ))}
            </div>

            {/* Detail panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={card({ padding: 20 })}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#EEEEF5", margin: 0, marginBottom: 4 }}>{proj.name}</h2>
                            <p style={{ fontSize: 11, color: "#666688" }}>{proj.id} · {proj.type}</p>
                        </div>
                        <Badge status={proj.status} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
                        {[
                            { label: "Client", value: proj.client },
                            { label: "Assigned Team", value: proj.team },
                            { label: "Budget", value: proj.budget },
                            { label: "Due Date", value: proj.due },
                        ].map(f => (
                            <div key={f.label} style={{ background: "#0F1017", borderRadius: 8, padding: "10px 12px" }}>
                                <p style={{ fontSize: 10, color: "#555577", marginBottom: 4 }}>{f.label}</p>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "#D0D0E8" }}>{f.value}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p style={{ fontSize: 10, color: "#555577", marginBottom: 6 }}>Overall Progress</p>
                        <ProgressBar value={proj.progress} />
                    </div>
                </div>

                {/* Quick links to other tabs */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                    {[
                        { label: "View Timeline", icon: "◑", tab: "timeline" },
                        { label: "Task Progress", icon: "◐", tab: "progress" },
                        { label: "Client Comms", icon: "◒", tab: "comms" },
                        { label: "Files", icon: "◓", tab: "files" },
                    ].map(l => (
                        <button key={l.tab} onClick={() => onNavigate(l.tab)} style={{ ...card({ padding: "12px", border: `1px solid #1E1F2A` }), cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#13141C" }}>
                            <span style={{ fontSize: 20, color: ACCENT }}>{l.icon}</span>
                            <span style={{ fontSize: 11, color: "#AAAACC" }}>{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Timeline ────────────────────────────────────────────────────────────
function TimelineTab() {
    return (
        <div style={{ display: "grid", gap: 14 }}>
            {TIMELINE_DATA.map(t => (
                <div key={t.id} style={card({ padding: 20 })}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#D0D0E8", marginBottom: 2 }}>{t.project}</p>
                            <p style={{ fontSize: 10, color: "#555577" }}>{t.id}</p>
                        </div>
                        <span style={{ fontSize: 10, color: ACCENT }}>
                            {t.milestones.filter(m => m.done).length}/{t.milestones.length} completed
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
                        {t.milestones.map((m, i) => (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", minWidth: 100 }}>
                                {/* connector line */}
                                {i < t.milestones.length - 1 && (
                                    <div style={{
                                        position: "absolute", top: 12, left: "50%", width: "100%", height: 2,
                                        background: m.done ? ACCENT : "#1E1F2A", zIndex: 0,
                                    }} />
                                )}
                                {/* dot */}
                                <div style={{
                                    width: 24, height: 24, borderRadius: "50%", zIndex: 1, flexShrink: 0,
                                    background: m.done ? ACCENT : "#1E1F2A",
                                    border: `2px solid ${m.done ? ACCENT : "#2A2B38"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, color: m.done ? "#000" : "#444466",
                                }}>
                                    {m.done ? "✓" : "○"}
                                </div>
                                <p style={{ fontSize: 10, color: m.done ? "#AAAACC" : "#555577", marginTop: 8, textAlign: "center", lineHeight: 1.4 }}>{m.label}</p>
                                <p style={{ fontSize: 9, color: m.done ? ACCENT : "#444466", marginTop: 3 }}>{m.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Tab: Work Progress Tracking ──────────────────────────────────────────────
function ProgressTab() {
    const [filter, setFilter] = useState("All");
    const statuses = ["All", "Done", "In Progress", "Review", "Pending"];
    const filtered = filter === "All" ? PROGRESS_TASKS : PROGRESS_TASKS.filter(t => t.status === filter);

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
                {[
                    { label: "Done", value: PROGRESS_TASKS.filter(t => t.status === "Done").length, color: ACCENT },
                    { label: "In Progress", value: PROGRESS_TASKS.filter(t => t.status === "In Progress").length, color: ACCENT2 },
                    { label: "In Review", value: PROGRESS_TASKS.filter(t => t.status === "Review").length, color: "#A78BFA" },
                    { label: "Pending", value: PROGRESS_TASKS.filter(t => t.status === "Pending").length, color: "#FFA94D" },
                ].map(m => (
                    <div key={m.label} style={card({ padding: "14px 16px" })}>
                        <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
                        <p style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>

            <div style={card({ overflow: "hidden" })}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", gap: 8 }}>
                    {statuses.map(s => (
                        <button key={s} onClick={() => setFilter(s)} style={{
                            fontSize: 11, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                            background: filter === s ? `rgba(0,201,167,0.15)` : "transparent",
                            border: `1px solid ${filter === s ? ACCENT : "#2A2B38"}`,
                            color: filter === s ? ACCENT : "#777799",
                        }}>{s}</button>
                    ))}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#0F1017" }}>
                            {["Task", "Project", "Assignee", "Priority", "Status", "Last Updated"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((t, i) => (
                            <tr key={i} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: "#D0D0E8", fontWeight: 500 }}>{t.task}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT2 }}>{t.project}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{t.assignee}</td>
                                <td style={{ padding: "12px 14px" }}><Badge status={t.priority} /></td>
                                <td style={{ padding: "12px 14px" }}><Badge status={t.status} /></td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#555577" }}>{t.updated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Tab: Client Communication ────────────────────────────────────────────────
function CommsTab() {
    const [active, setActive] = useState(0);
    const convo = COMMS_DATA[active];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 14, height: "calc(100vh - 130px)" }}>
            {/* Inbox list */}
            <div style={card({ overflow: "hidden", display: "flex", flexDirection: "column" })}>
                <SectionHeader title="Inbox" />
                <div style={{ overflowY: "auto", flex: 1 }}>
                    {COMMS_DATA.map((c, i) => (
                        <button key={i} onClick={() => setActive(i)} style={{
                            width: "100%", textAlign: "left", padding: "12px 14px",
                            background: active === i ? "rgba(0,201,167,0.08)" : "transparent",
                            border: "none", borderBottom: "1px solid #1A1B24",
                            borderLeft: `2px solid ${active === i ? ACCENT : "transparent"}`,
                            cursor: "pointer",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000", flexShrink: 0 }}>{c.avatar}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <p style={{ fontSize: 11, fontWeight: c.unread ? 700 : 500, color: c.unread ? "#E8E8EF" : "#AAAACC", marginBottom: 1 }}>{c.client}</p>
                                        {c.unread && <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, display: "inline-block", marginTop: 2, flexShrink: 0 }} />}
                                    </div>
                                    <p style={{ fontSize: 10, color: "#555577", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.message}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat view */}
            <div style={card({ display: "flex", flexDirection: "column", overflow: "hidden" })}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#D0D0E8", marginBottom: 2 }}>{convo.client}</p>
                    <p style={{ fontSize: 10, color: "#555577" }}>{convo.project}</p>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Client message bubble */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000", flexShrink: 0 }}>{convo.avatar}</div>
                        <div>
                            <div style={{ background: "#1E1F2A", borderRadius: "0 10px 10px 10px", padding: "10px 14px", maxWidth: 420 }}>
                                <p style={{ fontSize: 12, color: "#D0D0E8", lineHeight: 1.5 }}>{convo.message}</p>
                            </div>
                            <p style={{ fontSize: 10, color: "#444466", marginTop: 4 }}>{convo.time}</p>
                        </div>
                    </div>
                    {/* Our reply */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <div>
                            <div style={{ background: `rgba(0,201,167,0.15)`, borderRadius: "10px 0 10px 10px", padding: "10px 14px", maxWidth: 420 }}>
                                <p style={{ fontSize: 12, color: "#D0D0E8", lineHeight: 1.5 }}>Thanks for reaching out! We'll get back to you shortly with an update.</p>
                            </div>
                            <p style={{ fontSize: 10, color: "#444466", marginTop: 4, textAlign: "right" }}>You · Just now</p>
                        </div>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1E1F2A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: ACCENT, flexShrink: 0 }}>W</div>
                    </div>
                </div>
                <div style={{ padding: "12px 18px", borderTop: "1px solid #1E1F2A", display: "flex", gap: 10 }}>
                    <input placeholder="Type a reply..." style={{ flex: 1, background: "#0F1017", border: "1px solid #2A2B38", borderRadius: 8, padding: "9px 14px", fontSize: 12, color: "#D0D0E8", outline: "none" }} />
                    <button style={{ padding: "9px 18px", background: ACCENT, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#000", cursor: "pointer" }}>Send</button>
                </div>
            </div>
        </div>
    );
}

// ─── Tab: File Management ─────────────────────────────────────────────────────
const FILE_ICON: Record<string, string> = {
    Design: "🎨", Document: "📄", Database: "🗄️", Video: "🎬", Archive: "📦",
};

function FilesTab() {
    const [filter, setFilter] = useState("All");
    const types = ["All", "Design", "Document", "Database", "Video", "Archive"];
    const filtered = filter === "All" ? FILES_DATA : FILES_DATA.filter(f => f.type === filter);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 8 }}>
                    {types.map(t => (
                        <button key={t} onClick={() => setFilter(t)} style={{
                            fontSize: 11, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                            background: filter === t ? `rgba(0,201,167,0.15)` : "transparent",
                            border: `1px solid ${filter === t ? ACCENT : "#2A2B38"}`,
                            color: filter === t ? ACCENT : "#777799",
                        }}>{t}</button>
                    ))}
                </div>
                <button style={{ fontSize: 11, padding: "7px 16px", background: ACCENT, border: "none", borderRadius: 6, color: "#000", fontWeight: 600, cursor: "pointer" }}>⬆ Upload File</button>
            </div>
            <div style={card({ overflow: "hidden" })}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#0F1017" }}>
                            {["File", "Project", "Type", "Size", "Uploaded", "By", "Action"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((f, i) => (
                            <tr key={i} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 16 }}>{FILE_ICON[f.type] || "📁"}</span>
                                        <span style={{ fontSize: 11, color: "#D0D0E8", fontWeight: 500 }}>{f.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT2 }}>{f.project}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688" }}>{f.type}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{f.size}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#555577" }}>{f.uploaded}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{f.by}</td>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button style={{ fontSize: 10, padding: "4px 10px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 5, color: ACCENT2, cursor: "pointer" }}>View</button>
                                        <button style={{ fontSize: 10, padding: "4px 10px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 5, color: "#8888AA", cursor: "pointer" }}>Download</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Tab: Deliverables ────────────────────────────────────────────────────────
function DeliverablesTab() {
    const [checked, setChecked] = useState<Record<string, boolean>>(() => {
        const init: Record<string, boolean> = {};
        DELIVERABLES_DATA.forEach(d =>
            d.items.forEach((item, i) => { init[`${d.id}-${i}`] = item.done; })
        );
        return init;
    });

    const toggle = (key: string) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {DELIVERABLES_DATA.map(d => {
                const total = d.items.length;
                const done = d.items.filter((_, i) => checked[`${d.id}-${i}`]).length;
                return (
                    <div key={d.id} style={card({ padding: 18 })}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#D0D0E8", marginBottom: 2 }}>{d.project}</p>
                                <p style={{ fontSize: 10, color: "#555577" }}>{d.id}</p>
                            </div>
                            <span style={{ fontSize: 10, color: ACCENT, fontWeight: 600 }}>{done}/{total} done</span>
                        </div>
                        <ProgressBar value={Math.round((done / total) * 100)} />
                        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
                            {d.items.map((item, i) => {
                                const key = `${d.id}-${i}`;
                                const isDone = checked[key];
                                return (
                                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                        <div onClick={() => toggle(key)} style={{
                                            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                                            background: isDone ? ACCENT : "transparent",
                                            border: `2px solid ${isDone ? ACCENT : "#2A2B38"}`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 10, color: "#000",
                                        }}>
                                            {isDone && "✓"}
                                        </div>
                                        <span style={{ fontSize: 12, color: isDone ? "#555577" : "#CCCCDD", textDecoration: isDone ? "line-through" : "none" }}>{item.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Tab: Payments ────────────────────────────────────────────────────────────
function PaymentsTab() {
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
                {[
                    { label: "Total Invoiced", value: "₹28.4L", color: ACCENT },
                    { label: "Amount Received", value: "₹19.2L", color: ACCENT2 },
                    { label: "Pending / Overdue", value: "₹9.2L", color: "#FF6B6B" },
                ].map(m => (
                    <div key={m.label} style={card({ padding: "14px 16px" })}>
                        <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>
            <div style={card({ overflow: "hidden" })}>
                <SectionHeader title="Invoice History" action={
                    <button style={{ fontSize: 11, color: ACCENT, background: "transparent", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>+ New Invoice</button>
                } />
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

// ─── Tab: Completed Projects ──────────────────────────────────────────────────
function CompletedTab() {
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
                {[
                    { label: "Total Completed", value: "34", color: ACCENT },
                    { label: "Revenue Delivered", value: "₹38.2L", color: ACCENT2 },
                    { label: "Avg. Rating", value: "4.7 ★", color: "#FFA94D" },
                ].map(m => (
                    <div key={m.label} style={card({ padding: "14px 16px" })}>
                        <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>
            <div style={card({ overflow: "hidden" })}>
                <SectionHeader title="Completed Projects" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#0F1017" }}>
                            {["Project", "Client", "Type", "Team", "Budget", "Delivered", "Rating"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {COMPLETED_PROJECTS.map((p, i) => (
                            <tr key={p.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{p.name}</div>
                                    <div style={{ fontSize: 10, color: "#555577" }}>{p.id}</div>
                                </td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{p.client}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688" }}>{p.type}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{p.team}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT, fontWeight: 600 }}>{p.budget}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688" }}>{p.delivered}</td>
                                <td style={{ padding: "12px 14px" }}><StarRating value={p.rating} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Tab: Reports ─────────────────────────────────────────────────────────────
function ReportsTab() {
    const maxRevenue = Math.max(...REPORTS_MONTHLY.map(m => m.revenue));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                {REPORTS_STATS.map(s => (
                    <div key={s.label} style={card({ padding: "14px 16px" })}>
                        <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</p>
                        <span style={{ fontSize: 10, color: "#555577" }}>{s.change}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                {/* Monthly Revenue Chart (bar) */}
                <div style={card({ padding: 20 })}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 18 }}>Monthly Revenue (₹L)</p>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
                        {REPORTS_MONTHLY.map(m => (
                            <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 10, color: ACCENT }}>{m.revenue}L</span>
                                <div style={{
                                    width: "100%", borderRadius: "4px 4px 0 0",
                                    height: `${(m.revenue / maxRevenue) * 110}px`,
                                    background: `linear-gradient(180deg, ${ACCENT}, ${ACCENT2})`,
                                }} />
                                <span style={{ fontSize: 10, color: "#555577" }}>{m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project type breakdown */}
                <div style={card({ padding: 20 })}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", marginBottom: 16 }}>Project Type Breakdown</p>
                    {[
                        { label: "E-Commerce", pct: 34, color: ACCENT },
                        { label: "Corporate Websites", pct: 28, color: ACCENT2 },
                        { label: "SaaS Dashboards", pct: 20, color: "#A78BFA" },
                        { label: "Portals", pct: 12, color: "#FFA94D" },
                        { label: "Landing Pages", pct: 6, color: "#FF6B6B" },
                    ].map(t => (
                        <div key={t.label} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: "#AAAACC" }}>{t.label}</span>
                                <span style={{ fontSize: 11, color: t.color, fontWeight: 600 }}>{t.pct}%</span>
                            </div>
                            <ProgressBar value={t.pct} color={t.color} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Team performance */}
            <div style={card({ overflow: "hidden" })}>
                <SectionHeader title="Team Performance Summary" action={
                    <button style={{ fontSize: 11, color: ACCENT, background: "transparent", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Export CSV</button>
                } />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#0F1017" }}>
                            {["Team", "Lead", "Projects Done", "Active", "Utilization", "Avg. Rating"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TEAM_DATA.map((t, i) => (
                            <tr key={t.name} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#D0D0E8" }}>{t.name}</td>
                                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{t.lead}</td>
                                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700, color: ACCENT }}>{t.projects + 3}</td>
                                <td style={{ padding: "12px 14px", fontSize: 12, color: ACCENT2 }}>{t.projects}</td>
                                <td style={{ padding: "12px 14px", minWidth: 140 }}><ProgressBar value={t.utilization} color={t.utilization > 90 ? "#FF6B6B" : ACCENT} /></td>
                                <td style={{ padding: "12px 14px" }}><StarRating value={4} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Root Panel ───────────────────────────────────────────────────────────────
export default function WebsitePanel() {
    const [active, setActive] = useState("overview");

    const TAB_CONTENT: Record<string, React.ReactNode> = {
        overview: <OverviewTab />,
        requests: <RequestsTab />,
        teams: <TeamsTab />,
        details: <DetailsTab onNavigate={setActive} />,
        timeline: <TimelineTab />,
        progress: <ProgressTab />,
        comms: <CommsTab />,
        files: <FilesTab />,
        deliverables: <DeliverablesTab />,
        payments: <PaymentsTab />,
        completed: <CompletedTab />,
        reports: <ReportsTab />,
    };

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
                    <h1 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>
                        {SIDEBAR_ITEMS.find(s => s.id === active)?.label}
                    </h1>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={{ fontSize: 11, padding: "6px 14px", background: `rgba(0,201,167,0.1)`, border: `1px solid ${ACCENT}30`, borderRadius: 6, color: ACCENT, cursor: "pointer" }}>Export</button>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000", cursor: "pointer" }}>W</div>
                    </div>
                </header>
                <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
                    {TAB_CONTENT[active]}
                </main>
            </div>
        </div>
    );
}