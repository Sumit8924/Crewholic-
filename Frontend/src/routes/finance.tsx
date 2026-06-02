/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/finance")({
  component: FinancePanel,
});

const ACCENT = "#34D399";
const ACCENT2 = "#60A5FA";

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "income", label: "Income", icon: "◈" },
  { id: "expenses", label: "Expenses", icon: "◎" },
  { id: "transactions", label: "Transactions", icon: "◑" },
  { id: "invoices", label: "Invoices", icon: "◒" },
  { id: "paytrack", label: "Payment Tracking", icon: "◓" },
  { id: "budget", label: "Budget Management", icon: "◔" },
  { id: "pnl", label: "Profit & Loss", icon: "◕" },
  { id: "reports", label: "Financial Reports", icon: "◆" },
  { id: "tax", label: "Tax Records", icon: "◧" },
  { id: "export", label: "Export Reports", icon: "◐" },
];

const TRANSACTIONS = [
  { id: "TXN-9801", desc: "Payment from TechCorp India", type: "Income", amount: 140000, date: "Dec 10", method: "NEFT", status: "Completed" },
  { id: "TXN-9802", desc: "Office Rent — Dec 2024", type: "Expense", amount: 55000, date: "Dec 5", method: "Cheque", status: "Completed" },
  { id: "TXN-9803", desc: "StyleHub Pvt Ltd — Advance", type: "Income", amount: 290000, date: "Dec 8", method: "RTGS", status: "Completed" },
  { id: "TXN-9804", desc: "AWS Cloud Services", type: "Expense", amount: 18400, date: "Dec 1", method: "Auto Debit", status: "Completed" },
  { id: "TXN-9805", desc: "MedConnect Health — Final Payment", type: "Income", amount: 80000, date: "Dec 10", method: "UPI", status: "Completed" },
  { id: "TXN-9806", desc: "Team Salaries — Nov 2024", type: "Expense", amount: 380000, date: "Dec 1", method: "NEFT", status: "Completed" },
  { id: "TXN-9807", desc: "FinEdge Solutions — Overdue", type: "Income", amount: 120000, date: "Nov 30", method: "Pending", status: "Pending" },
];

const MONTHLY_PNL = [
  { month: "Jul", income: 18.2, expense: 11.4 },
  { month: "Aug", income: 21.5, expense: 13.2 },
  { month: "Sep", income: 19.8, expense: 12.0 },
  { month: "Oct", income: 24.1, expense: 14.8 },
  { month: "Nov", income: 28.4, expense: 15.6 },
  { month: "Dec", income: 32.1, expense: 17.2 },
];

const EXPENSE_CATS = [
  { cat: "Salaries", amount: 380000, pct: 54, color: ACCENT2 },
  { cat: "Office Rent", amount: 55000, pct: 8, color: "#A78BFA" },
  { cat: "Cloud & Tech", amount: 42000, pct: 6, color: "#FCA5A5" },
  { cat: "Marketing", amount: 95000, pct: 14, color: "#FCD34D" },
  { cat: "Miscellaneous", amount: 122000, pct: 18, color: "#6EE7B7" },
];

const statusColor = {
  "Completed": { bg: "rgba(52,211,153,0.12)", text: "#34D399" },
  "Pending": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
  "Failed": { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
};

const Badge = ({ s }) => {
  const st = statusColor[s] || { bg: "#1E1F2A", text: "#888" };
  return <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: st.bg, color: st.text, fontWeight: 600 }}>{s}</span>;
};

function FinanceDashboard() {
  const maxIncome = Math.max(...MONTHLY_PNL.map(m => m.income));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Revenue (Dec)", value: "₹32.1L", change: "+13%", up: true, color: ACCENT },
          { label: "Total Expenses (Dec)", value: "₹17.2L", change: "+10%", up: false, color: "#FF6B6B" },
          { label: "Net Profit (Dec)", value: "₹14.9L", change: "+16%", up: true, color: ACCENT2 },
          { label: "Outstanding Dues", value: "₹9.2L", change: "4 invoices", up: false, color: "#FFA94D" },
        ].map(m => (
          <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
            <span style={{ fontSize: 10, color: m.up ? ACCENT : "#FF6B6B" }}>{m.up ? "↑" : "↓"} {m.change}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 16 }}>
        {/* P&L Chart */}
        <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Revenue vs Expenses — Last 6 Months</span>
            <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
              <span style={{ color: ACCENT }}>● Revenue</span>
              <span style={{ color: "#FF6B6B" }}>● Expenses</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
            {MONTHLY_PNL.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", gap: 3, alignItems: "flex-end" }}>
                <div style={{ flex: 1, height: `${(m.income / maxIncome) * 100}%`, background: ACCENT, borderRadius: "3px 3px 0 0", opacity: 0.85 }} />
                <div style={{ flex: 1, height: `${(m.expense / maxIncome) * 100}%`, background: "#FF6B6B", borderRadius: "3px 3px 0 0", opacity: 0.7 }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {MONTHLY_PNL.map((m, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#555577" }}>{m.month}</div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0", display: "block", marginBottom: 14 }}>Expense Breakdown</span>
          {EXPENSE_CATS.map(e => (
            <div key={e.cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#AAAACC" }}>{e.cat}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: e.color }}>{e.pct}%</span>
              </div>
              <div style={{ height: 3, background: "#1E1F2A", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${e.pct}%`, background: e.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionsTab() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["All", "Income", "Expense"].map(f => (
            <button key={f} style={{ fontSize: 11, padding: "5px 14px", background: f === "All" ? ACCENT : "transparent", border: f === "All" ? "none" : "1px solid #2A2B38", borderRadius: 6, color: f === "All" ? "#000" : "#8888AA", cursor: "pointer", fontWeight: f === "All" ? 600 : 400 }}>{f}</button>
          ))}
        </div>
        <button style={{ fontSize: 11, color: ACCENT, background: "rgba(52,211,153,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Export CSV</button>
      </div>
      <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Transaction ID", "Description", "Type", "Amount", "Date", "Method", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((t, i) => (
              <tr key={t.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT2 }}>{t.id}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#CCCCE0", maxWidth: 200 }}>{t.desc}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: t.type === "Income" ? "rgba(52,211,153,0.12)" : "rgba(255,107,107,0.12)", color: t.type === "Income" ? ACCENT : "#FF6B6B", fontWeight: 600 }}>{t.type}</span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 700, color: t.type === "Income" ? ACCENT : "#FF6B6B" }}>
                  {t.type === "Income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                </td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#666688" }}>{t.date}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{t.method}</td>
                <td style={{ padding: "12px 14px" }}><Badge s={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TAB_CONTENT = {
  dashboard: <FinanceDashboard />,
  transactions: <TransactionsTab />,
};

export default function FinancePanel() {
  const [active, setActive] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF" }}>
      <aside style={{ width: 220, background: "#0F1117", borderRight: "1px solid #1E1F2A", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #1E1F2A", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◎</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#E8E8EF" }}>Finance Panel</p>
            <p style={{ fontSize: 10, color: "#555577" }}>Revenue & Accounting</p>
          </div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0", scrollbarWidth: "none" }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px",
              background: active === item.id ? "rgba(52,211,153,0.12)" : "transparent",
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
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000", cursor: "pointer" }}>F</div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {TAB_CONTENT[active] || (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#444466", fontSize: 13 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
                <p>{SIDEBAR_ITEMS.find(s => s.id === active)?.label}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}