/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
export const Route = createFileRoute("/marketing")({
  component: MarketingPanel,
});

const ACCENT = "#FF6B6B";
const ACCENT2 = "#FFA94D";

const SIDEBAR_ITEMS = [
  { id: "campaigns", label: "Campaign Management", icon: "◉" },
  { id: "leads", label: "Lead Management", icon: "◈" },
  { id: "assignment", label: "Lead Assignment", icon: "◎" },
  { id: "callcenter", label: "Call Center Activities", icon: "◑" },
  { id: "comms", label: "Client Communication", icon: "◒" },
  { id: "reports", label: "Marketing Reports", icon: "◓" },
  { id: "analytics", label: "Performance Analytics", icon: "◐" },
  { id: "social", label: "Social Media Campaigns", icon: "◔" },
  { id: "email", label: "Email Campaigns", icon: "◕" },
  { id: "team", label: "Team Management", icon: "◆" },
  { id: "targets", label: "Target Tracking", icon: "◧" },
];

const CAMPAIGNS = [
  { id: "CMP-01", name: "Diwali Offer Blast", type: "Email", status: "Active", leads: 4820, conversion: "12.4%", budget: "₹45,000", spent: "₹31,200", start: "Nov 25", end: "Dec 15" },
  { id: "CMP-02", name: "Year-End SaaS Push", type: "Social", status: "Active", leads: 2341, conversion: "8.7%", budget: "₹80,000", spent: "₹52,000", start: "Dec 1", end: "Dec 31" },
  { id: "CMP-03", name: "B2B Cold Outreach", type: "Call", status: "Paused", leads: 780, conversion: "5.2%", budget: "₹20,000", spent: "₹18,900", start: "Nov 10", end: "Dec 10" },
  { id: "CMP-04", name: "LinkedIn Brand Drive", type: "Social", status: "Active", leads: 1580, conversion: "6.1%", budget: "₹60,000", spent: "₹14,000", start: "Dec 5", end: "Jan 5" },
  { id: "CMP-05", name: "Welcome Email Series", type: "Email", status: "Scheduled", leads: 0, conversion: "—", budget: "₹12,000", spent: "₹0", start: "Dec 20", end: "Jan 20" },
];

const LEADS = [
  { id: "LD-1091", name: "Vikram Joshi", company: "BuildMate Pvt Ltd", source: "LinkedIn", status: "Hot", assignee: "Ankit S.", lastContact: "Today" },
  { id: "LD-1092", name: "Meera Pillai", company: "DataVault Inc", source: "Email", status: "Warm", assignee: "Priya R.", lastContact: "Yesterday" },
  { id: "LD-1093", name: "Rahul Gupta", company: "NexGen Pharma", source: "Call", status: "Cold", assignee: "Sumit K.", lastContact: "Dec 8" },
  { id: "LD-1094", name: "Ananya Singh", company: "TrueNorth Capital", source: "Referral", status: "Hot", assignee: "Ankit S.", lastContact: "Today" },
  { id: "LD-1095", name: "Deepak Malhotra", company: "CloudSoft Labs", source: "Social", status: "Warm", assignee: "Priya R.", lastContact: "Dec 9" },
  { id: "LD-1096", name: "Simran Kaur", company: "UrbanFit Gym", source: "Website", status: "Converted", assignee: "Sumit K.", lastContact: "Dec 5" },
];

const TARGETS = [
  { label: "Monthly Lead Target", current: 3800, target: 5000, unit: "leads" },
  { label: "Campaign Conversions", current: 420, target: 600, unit: "conversions" },
  { label: "Email Open Rate", current: 32, target: 40, unit: "%" },
  { label: "Revenue from Leads", current: 8.4, target: 12, unit: "L ₹" },
];

const statusColor = {
  "Active": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
  "Paused": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
  "Scheduled": { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
  "Hot": { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
  "Warm": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
  "Cold": { bg: "rgba(136,136,170,0.12)", text: "#888899" },
  "Converted": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
};

const Badge = ({ s }) => {
  const st = statusColor[s] || { bg: "#1E1F2A", text: "#888" };
  return <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: st.bg, color: st.text, fontWeight: 600 }}>{s}</span>;
};

function CampaignsTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Active Campaigns", value: "3", color: ACCENT },
          { label: "Total Leads Generated", value: "9,521", color: ACCENT2 },
          { label: "Avg Conversion Rate", value: "8.6%", color: "#00C9A7" },
          { label: "Total Budget Used", value: "₹1.16L", color: "#FF6B6B" },
        ].map(m => (
          <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>All Campaigns</span>
          <button style={{ fontSize: 11, color: ACCENT, background: "rgba(255,107,107,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>+ New Campaign</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Campaign", "Type", "Leads", "Conversion", "Budget", "Spent", "Duration", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c, i) => (
              <tr key={c.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "#555577" }}>{c.id}</div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{c.type}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#EEEEF5" }}>{c.leads.toLocaleString()}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#00C9A7", fontWeight: 500 }}>{c.conversion}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#AAAACC" }}>{c.budget}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688" }}>{c.spent}</td>
                <td style={{ padding: "12px 14px", fontSize: 10, color: "#555577" }}>{c.start} – {c.end}</td>
                <td style={{ padding: "12px 14px" }}><Badge s={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadsTab() {
  return (
    <div>
      <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Lead Pipeline</span>
          <div style={{ display: "flex", gap: 8 }}>
            <select style={{ fontSize: 11, padding: "5px 10px", background: "#1A1B25", border: "1px solid #2A2B38", borderRadius: 6, color: "#8888AA", cursor: "pointer" }}>
              <option>All Sources</option><option>LinkedIn</option><option>Email</option><option>Call</option>
            </select>
            <button style={{ fontSize: 11, color: ACCENT, background: "rgba(255,107,107,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>+ Add Lead</button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Lead ID", "Name", "Company", "Source", "Assignee", "Last Contact", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEADS.map((l, i) => (
              <tr key={l.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#0097FF" }}>{l.id}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{l.name}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{l.company}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688" }}>{l.source}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#AAAACC" }}>{l.assignee}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#555577" }}>{l.lastContact}</td>
                <td style={{ padding: "12px 14px" }}><Badge s={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TargetsTab() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {TARGETS.map(t => {
          const pct = Math.min(100, Math.round((t.current / t.target) * 100));
          return (
            <div key={t.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: "#CCCCE0" }}>{t.label}</p>
                <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 80 ? "#00C9A7" : pct >= 50 ? ACCENT2 : ACCENT }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: "#1E1F2A", borderRadius: 3, marginBottom: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "#00C9A7" : pct >= 50 ? ACCENT2 : ACCENT, borderRadius: 3 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555577" }}>
                <span>{t.current} {t.unit}</span>
                <span>Target: {t.target} {t.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TAB_CONTENT = {
  campaigns: <CampaignsTab />,
  leads: <LeadsTab />,
  targets: <TargetsTab />,
};

export default function MarketingPanel() {
  const [active, setActive] = useState("campaigns");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF" }}>
      <aside style={{ width: 220, background: "#0F1117", borderRight: "1px solid #1E1F2A", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #1E1F2A", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◉</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#E8E8EF" }}>Marketing Panel</p>
            <p style={{ fontSize: 10, color: "#555577" }}>Campaigns & Leads</p>
          </div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0", scrollbarWidth: "none" }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px",
              background: active === item.id ? "rgba(255,107,107,0.12)" : "transparent",
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
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000", cursor: "pointer" }}>M</div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {TAB_CONTENT[active] || (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#444466", fontSize: 13 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>◉</div>
                <p>{SIDEBAR_ITEMS.find(s => s.id === active)?.label}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}