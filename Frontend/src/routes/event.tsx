/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/event")({
  component: EventPanel,
});
const ACCENT = "#A78BFA";
const ACCENT2 = "#F472B6";

const SIDEBAR_ITEMS = [
  { id: "requests", label: "Event Requests", icon: "◈" },
  { id: "planning", label: "Event Planning", icon: "◎" },
  { id: "scheduling", label: "Event Scheduling", icon: "◑" },
  { id: "vendors", label: "Vendor Management", icon: "◉" },
  { id: "resources", label: "Resource Allocation", icon: "◧" },
  { id: "progress", label: "Work Progress", icon: "◐" },
  { id: "comms", label: "Client Communication", icon: "◒" },
  { id: "payments", label: "Payments", icon: "◓" },
  { id: "budget", label: "Budget Tracking", icon: "◔" },
  { id: "reports", label: "Event Reports", icon: "◕" },
  { id: "analytics", label: "Event Analytics", icon: "◆" },
];

const EVENTS = [
  { id: "EVT-101", name: "TechSummit 2024", client: "TechCorp India", type: "Conference", date: "Dec 28", venue: "Bombay Exhibition Centre", guests: 850, budget: "₹12,00,000", status: "Confirmed" },
  { id: "EVT-102", name: "Sharma-Kapoor Wedding", client: "Ramesh Sharma", type: "Wedding", date: "Dec 22", venue: "ITC Maratha, Mumbai", guests: 450, budget: "₹28,00,000", status: "In Planning" },
  { id: "EVT-103", name: "FMCG Product Launch", client: "NutriLife Brands", type: "Product Launch", date: "Jan 5", venue: "Taj Lands End", guests: 200, budget: "₹6,50,000", status: "Confirmed" },
  { id: "EVT-104", name: "Annual Corporate Gala", client: "FinEdge Solutions", type: "Corporate", date: "Jan 12", venue: "Grand Hyatt, Mumbai", guests: 320, budget: "₹9,80,000", status: "In Planning" },
  { id: "EVT-105", name: "Startup Mixer Night", client: "TechMeet Club", type: "Networking", date: "Dec 18", venue: "WeWork BKC", guests: 120, budget: "₹85,000", status: "Completed" },
];

const VENDORS = [
  { name: "AV Systems Pro", category: "Audio/Visual", contact: "Suresh M.", cost: "₹1,40,000", events: 3, status: "Confirmed" },
  { name: "Bliss Caterers", category: "Catering", contact: "Priya K.", cost: "₹3,20,000", events: 2, status: "Confirmed" },
  { name: "Floral Dreams", category: "Decoration", contact: "Anjali R.", cost: "₹85,000", events: 2, status: "Pending" },
  { name: "Clicks & Frames", category: "Photography", contact: "Rohan D.", cost: "₹60,000", events: 4, status: "Confirmed" },
  { name: "SoundWave DJ", category: "Entertainment", contact: "Aakash T.", cost: "₹45,000", events: 1, status: "Pending" },
];

const BUDGET_ITEMS = [
  { category: "Venue", allocated: 800000, spent: 650000, color: ACCENT },
  { category: "Catering", allocated: 320000, spent: 320000, color: "#FFA94D" },
  { category: "Decoration", allocated: 200000, spent: 85000, color: ACCENT2 },
  { category: "AV & Tech", allocated: 250000, spent: 140000, color: "#00C9A7" },
  { category: "Photography", allocated: 80000, spent: 60000, color: "#0097FF" },
  { category: "Logistics", allocated: 100000, spent: 72000, color: "#FFD93D" },
];

const statusColor = {
  "Confirmed": { bg: "rgba(167,139,250,0.12)", text: "#A78BFA" },
  "In Planning": { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
  "Completed": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
  "Pending": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
  "Cancelled": { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
};

const Badge = ({ s }) => {
  const st = statusColor[s] || { bg: "#1E1F2A", text: "#888" };
  return <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: st.bg, color: st.text, fontWeight: 600 }}>{s}</span>;
};

const fmt = (n) => "₹" + (n / 100000).toFixed(1) + "L";

function RequestsTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Events", value: "18", color: ACCENT },
          { label: "This Month", value: "5", color: ACCENT2 },
          { label: "Upcoming", value: "4", color: "#FFA94D" },
          { label: "Total Revenue", value: "₹58.1L", color: "#00C9A7" },
        ].map(m => (
          <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Event Pipeline</span>
          <button style={{ fontSize: 11, color: ACCENT, background: "rgba(167,139,250,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>+ New Event</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Event", "Client", "Type", "Date", "Venue", "Guests", "Budget", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((e, i) => (
              <tr key={e.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: "#555577" }}>{e.id}</div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{e.client}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "rgba(167,139,250,0.1)", color: "#A78BFA" }}>{e.type}</span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 11, fontWeight: 500, color: ACCENT2 }}>{e.date}</td>
                <td style={{ padding: "12px 14px", fontSize: 10, color: "#666688" }}>{e.venue}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#EEEEF5", textAlign: "center" }}>{e.guests}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#00C9A7" }}>{e.budget}</td>
                <td style={{ padding: "12px 14px" }}><Badge s={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VendorsTab() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {VENDORS.map(v => (
        <div key={v.name} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: ACCENT }}>◉</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#D0D0E8", marginBottom: 2 }}>{v.name}</p>
              <p style={{ fontSize: 11, color: "#666688" }}>{v.category} · {v.contact}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 9, color: "#555577", marginBottom: 2 }}>Contract Value</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{v.cost}</p>
            </div>
            <div>
              <p style={{ fontSize: 9, color: "#555577", marginBottom: 2 }}>Events</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#EEEEF5", textAlign: "center" }}>{v.events}</p>
            </div>
            <Badge s={v.status} />
            <button style={{ fontSize: 10, padding: "5px 12px", background: "transparent", border: "1px solid #2A2B38", borderRadius: 6, color: "#888", cursor: "pointer" }}>View</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetTab() {
  const totalAllocated = BUDGET_ITEMS.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = BUDGET_ITEMS.reduce((a, b) => a + b.spent, 0);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Total Budget</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: ACCENT }}>{fmt(totalAllocated)}</p>
        </div>
        <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Amount Spent</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#FFA94D" }}>{fmt(totalSpent)}</p>
        </div>
        <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Remaining</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#00C9A7" }}>{fmt(totalAllocated - totalSpent)}</p>
        </div>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {BUDGET_ITEMS.map(b => {
          const pct = Math.round((b.spent / b.allocated) * 100);
          return (
            <div key={b.category} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#CCCCE0" }}>{b.category}</span>
                <div style={{ display: "flex", gap: 20, fontSize: 11 }}>
                  <span style={{ color: "#666688" }}>Allocated: <span style={{ color: "#AAAACC" }}>{fmt(b.allocated)}</span></span>
                  <span style={{ color: "#666688" }}>Spent: <span style={{ color: b.color }}>{fmt(b.spent)}</span></span>
                  <span style={{ fontWeight: 600, color: pct >= 90 ? "#FF6B6B" : pct >= 70 ? "#FFA94D" : "#00C9A7" }}>{pct}%</span>
                </div>
              </div>
              <div style={{ height: 6, background: "#1E1F2A", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: b.color, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TAB_CONTENT = {
  requests: <RequestsTab />,
  vendors: <VendorsTab />,
  budget: <BudgetTab />,
};

export default function EventPanel() {
  const [active, setActive] = useState("requests");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF" }}>
      <aside style={{ width: 220, background: "#0F1117", borderRight: "1px solid #1E1F2A", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #1E1F2A", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◫</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#E8E8EF" }}>Event Management</p>
            <p style={{ fontSize: 10, color: "#555577" }}>Planning & Execution</p>
          </div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0", scrollbarWidth: "none" }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px",
              background: active === item.id ? "rgba(167,139,250,0.12)" : "transparent",
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ background: "#0F1117", borderBottom: "1px solid #1E1F2A", padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <h1 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>{SIDEBAR_ITEMS.find(s => s.id === active)?.label}</h1>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>E</div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {TAB_CONTENT[active] || (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#444466", fontSize: 13 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>◫</div>
                <p>{SIDEBAR_ITEMS.find(s => s.id === active)?.label}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}