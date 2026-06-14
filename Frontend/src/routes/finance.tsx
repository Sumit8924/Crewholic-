/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/finance")({
  component: FinancePanel,
});

const API_URL = import.meta.env.VITE_API_URL || "https://crewholic-1-if9w.onrender.com";
const ACCENT = "#34D399";
const ACCENT2 = "#60A5FA";
const DANGER = "#FF6B6B";
const WARN = "#FFA94D";

// ── Auth helpers ──────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token") || "";
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

// ── Fetch wrapper ─────────────────────────────────────────────────────────────
async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers: { ...authHeaders(), ...(opts.headers || {}) } });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error(`Server error ${res.status}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Request failed");
  return data;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Transaction { _id?: string; id?: string; desc: string; type: "Income" | "Expense"; amount: number; date: string; method: string; status: "Completed" | "Pending" | "Failed"; category?: string; notes?: string; }
interface Invoice { _id?: string; client: string; amount: number; due: string; status: "Paid" | "Unpaid" | "Overdue"; issued: string; items?: string; }
interface BudgetItem { _id?: string; category: string; allocated: number; spent: number; month: string; }
interface TaxRecord { _id?: string; quarter: string; type: string; amount: number; dueDate: string; status: "Filed" | "Pending" | "Overdue"; notes?: string; }

// ── Sidebar ───────────────────────────────────────────────────────────────────
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

// ── Shared UI ─────────────────────────────────────────────────────────────────
const statusColor: Record<string, { bg: string; text: string }> = {
  Completed: { bg: "rgba(52,211,153,0.12)", text: ACCENT },
  Paid: { bg: "rgba(52,211,153,0.12)", text: ACCENT },
  Filed: { bg: "rgba(52,211,153,0.12)", text: ACCENT },
  Pending: { bg: "rgba(255,169,77,0.12)", text: WARN },
  Unpaid: { bg: "rgba(255,169,77,0.12)", text: WARN },
  Overdue: { bg: "rgba(255,107,107,0.12)", text: DANGER },
  Failed: { bg: "rgba(255,107,107,0.12)", text: DANGER },
};

const Badge = ({ s }: { s: string }) => {
  const st = statusColor[s] || { bg: "#1E1F2A", text: "#888" };
  return <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: st.bg, color: st.text, fontWeight: 600 }}>{s}</span>;
};

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18, ...style }}>{children}</div>
);

const SectionHead = ({ title, action }: { title: string; action?: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <span style={{ fontSize: 14, fontWeight: 700, color: "#CCCCE0" }}>{title}</span>
    {action}
  </div>
);

const Btn = ({ onClick, children, variant = "primary", style = {}, disabled = false }: any) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: `linear-gradient(105deg,${ACCENT},${ACCENT2})`, color: "#000", border: "none" },
    ghost: { background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}40` },
    danger: { background: "rgba(255,107,107,0.12)", color: DANGER, border: `1px solid ${DANGER}40` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, opacity: disabled ? 0.5 : 1, transition: "opacity 0.2s", ...styles[variant], ...style }}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", required = false }: any) => (
  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ fontSize: 11, color: "#888899", display: "block", marginBottom: 4 }}>{label}{required && <span style={{ color: DANGER }}> *</span>}</label>}
    <input type={type} value={value} onChange={onChange} required={required}
      style={{ width: "100%", background: "#0B0C10", border: "1px solid #2A2B38", borderRadius: 6, padding: "8px 10px", color: "#E8E8EF", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
  </div>
);

const Select = ({ label, value, onChange, options, required = false }: any) => (
  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ fontSize: 11, color: "#888899", display: "block", marginBottom: 4 }}>{label}{required && <span style={{ color: DANGER }}> *</span>}</label>}
    <select value={value} onChange={onChange} required={required}
      style={{ width: "100%", background: "#0B0C10", border: "1px solid #2A2B38", borderRadius: 6, padding: "8px 10px", color: "#E8E8EF", fontSize: 12, outline: "none", boxSizing: "border-box" }}>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
    <div style={{ background: "#13141C", border: "1px solid #2A2B38", borderRadius: 12, padding: 24, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#CCCCE0" }}>{title}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#666688", fontSize: 18, cursor: "pointer" }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type }: { msg: string; type: "success" | "error" }) => (
  <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#13141C", border: `1px solid ${type === "success" ? ACCENT : DANGER}`, borderRadius: 8, padding: "10px 20px", color: type === "success" ? ACCENT : DANGER, fontSize: 12, fontWeight: 600, zIndex: 9999, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
    {type === "success" ? "✓" : "✕"} {msg}
  </div>
);

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const show = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

// ── Static chart data ─────────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function FinanceDashboard({ transactions }: { transactions: Transaction[] }) {
  const income = transactions.filter(t => t.type === "Income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const netProfit = income - expenses;
  const outstanding = transactions.filter(t => t.status === "Pending").reduce((s, t) => s + t.amount, 0);
  const maxIncome = Math.max(...MONTHLY_PNL.map(m => m.income));

  const stats = [
    { label: "Total Revenue", value: `₹${(income / 100000).toFixed(1)}L`, sub: `${transactions.filter(t => t.type === "Income").length} entries`, color: ACCENT, up: true },
    { label: "Total Expenses", value: `₹${(expenses / 100000).toFixed(1)}L`, sub: `${transactions.filter(t => t.type === "Expense").length} entries`, color: DANGER, up: false },
    { label: "Net Profit", value: `₹${(netProfit / 100000).toFixed(1)}L`, sub: netProfit >= 0 ? "Profitable" : "Loss", color: ACCENT2, up: netProfit >= 0 },
    { label: "Outstanding Dues", value: `₹${(outstanding / 100000).toFixed(1)}L`, sub: `${transactions.filter(t => t.status === "Pending").length} pending`, color: WARN, up: false },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {stats.map(m => (
          <Card key={m.label} style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
            <span style={{ fontSize: 10, color: m.up ? ACCENT : DANGER }}>{m.up ? "↑" : "↓"} {m.sub}</span>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 16 }}>
        {/* Chart */}
        <Card>
          <SectionHead title="Revenue vs Expenses — Last 6 Months"
            action={<div style={{ display: "flex", gap: 14, fontSize: 11 }}><span style={{ color: ACCENT }}>● Revenue</span><span style={{ color: DANGER }}>● Expenses</span></div>}
          />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
            {MONTHLY_PNL.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", gap: 3, alignItems: "flex-end" }}>
                <div style={{ flex: 1, height: `${(m.income / maxIncome) * 100}%`, background: ACCENT, borderRadius: "3px 3px 0 0", opacity: 0.85 }} />
                <div style={{ flex: 1, height: `${(m.expense / maxIncome) * 100}%`, background: DANGER, borderRadius: "3px 3px 0 0", opacity: 0.7 }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            {MONTHLY_PNL.map((m, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#555577" }}>{m.month}</div>
            ))}
          </div>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <SectionHead title="Expense Breakdown" />
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
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <SectionHead title="Recent Transactions" />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Description", "Type", "Amount", "Date", "Status"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map((t, i) => (
              <tr key={t._id || i} style={{ borderTop: "1px solid #1A1B24" }}>
                <td style={{ padding: "10px 12px", fontSize: 11, color: "#CCCCE0" }}>{t.desc}</td>
                <td style={{ padding: "10px 12px" }}><Badge s={t.type} /></td>
                <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, color: t.type === "Income" ? ACCENT : DANGER }}>{t.type === "Income" ? "+" : "-"}₹{t.amount.toLocaleString()}</td>
                <td style={{ padding: "10px 12px", fontSize: 11, color: "#666688" }}>{t.date}</td>
                <td style={{ padding: "10px 12px" }}><Badge s={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════════════════
function TransactionsTab({ transactions, onAdd, onDelete, loading }: { transactions: Transaction[]; onAdd: (t: Omit<Transaction, "_id">) => Promise<void>; onDelete: (id: string) => Promise<void>; loading: boolean; }) {
  const [filter, setFilter] = useState<"All" | "Income" | "Expense">("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ desc: "", type: "Income", amount: "", date: new Date().toISOString().slice(0, 10), method: "UPI", status: "Completed", category: "", notes: "" });
  const { toast, show } = useToast();

  const filtered = transactions.filter(t => {
    const matchType = filter === "All" || t.type === filter;
    const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase()) || (t.id || "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.desc || !form.amount) { show("Fill all required fields", "error"); return; }
    try {
      await onAdd({ ...form, amount: Number(form.amount), type: form.type as "Income" | "Expense", status: form.status as any });
      setShowModal(false);
      setForm({ desc: "", type: "Income", amount: "", date: new Date().toISOString().slice(0, 10), method: "UPI", status: "Completed", category: "", notes: "" });
      show("Transaction added");
    } catch (e: any) { show(e.message, "error"); }
  };

  const exportCSV = () => {
    const rows = [["ID", "Description", "Type", "Amount", "Date", "Method", "Status"],
    ...filtered.map(t => [t._id || t.id || "", t.desc, t.type, t.amount, t.date, t.method, t.status])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = "transactions.csv"; a.click();
  };

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {(["All", "Income", "Expense"] as const).map(f => (
            <Btn key={f} onClick={() => setFilter(f)} variant={filter === f ? "primary" : "ghost"}>{f}</Btn>
          ))}
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 11, padding: "5px 10px", background: "#0B0C10", border: "1px solid #2A2B38", borderRadius: 6, color: "#E8E8EF", outline: "none", width: 150 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={exportCSV} variant="ghost">Export CSV</Btn>
          <Btn onClick={() => setShowModal(true)}>+ Add Transaction</Btn>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "#555577" }}>Loading...</div> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0F1017" }}>
                {["#", "Description", "Type", "Amount", "Date", "Method", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#444466" }}>No transactions found</td></tr>
              ) : filtered.map((t, i) => (
                <tr key={t._id || i} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                  <td style={{ padding: "10px 14px", fontSize: 10, color: "#555577" }}>{i + 1}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "#CCCCE0", maxWidth: 200 }}>{t.desc}</td>
                  <td style={{ padding: "10px 14px" }}><Badge s={t.type} /></td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: t.type === "Income" ? ACCENT : DANGER }}>{t.type === "Income" ? "+" : "-"}₹{t.amount.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "#666688" }}>{t.date}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "#8888AA" }}>{t.method}</td>
                  <td style={{ padding: "10px 14px" }}><Badge s={t.status} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <Btn variant="danger" onClick={() => onDelete(t._id || t.id || "")} style={{ padding: "3px 8px", fontSize: 10 }}>✕</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showModal && (
        <Modal title="New Transaction" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <Input label="Description" value={form.desc} onChange={(e: any) => setForm({ ...form, desc: e.target.value })} required />
            <Select label="Type" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })} options={["Income", "Expense"]} required />
            <Input label="Amount (₹)" type="number" value={form.amount} onChange={(e: any) => setForm({ ...form, amount: e.target.value })} required />
            <Input label="Date" type="date" value={form.date} onChange={(e: any) => setForm({ ...form, date: e.target.value })} required />
            <Select label="Method" value={form.method} onChange={(e: any) => setForm({ ...form, method: e.target.value })} options={["UPI", "NEFT", "RTGS", "Cheque", "Cash", "Auto Debit", "Card"]} />
            <Select label="Status" value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })} options={["Completed", "Pending", "Failed"]} />
            <Input label="Category (optional)" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} />
            <Input label="Notes (optional)" value={form.notes} onChange={(e: any) => setForm({ ...form, notes: e.target.value })} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn type="submit">Save</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INCOME TAB
// ═══════════════════════════════════════════════════════════════════════════════
function IncomeTab({ transactions }: { transactions: Transaction[] }) {
  const income = transactions.filter(t => t.type === "Income");
  const total = income.reduce((s, t) => s + t.amount, 0);
  const completed = income.filter(t => t.status === "Completed").reduce((s, t) => s + t.amount, 0);
  const pending = income.filter(t => t.status === "Pending").reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Income", value: `₹${total.toLocaleString()}`, color: ACCENT },
          { label: "Received", value: `₹${completed.toLocaleString()}`, color: ACCENT2 },
          { label: "Pending", value: `₹${pending.toLocaleString()}`, color: WARN },
        ].map(s => (
          <Card key={s.label} style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Description", "Amount", "Date", "Method", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {income.length === 0
              ? <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#444466" }}>No income records</td></tr>
              : income.map((t, i) => (
                <tr key={t._id || i} style={{ borderTop: "1px solid #1A1B24" }}>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "#CCCCE0" }}>{t.desc}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: ACCENT }}>+₹{t.amount.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "#666688" }}>{t.date}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "#8888AA" }}>{t.method}</td>
                  <td style={{ padding: "10px 14px" }}><Badge s={t.status} /></td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPENSES TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ExpensesTab({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter(t => t.type === "Expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Expenses", value: `₹${total.toLocaleString()}`, color: DANGER },
          { label: "No. of Entries", value: expenses.length, color: WARN },
          { label: "Avg. Per Entry", value: `₹${expenses.length ? Math.round(total / expenses.length).toLocaleString() : 0}`, color: ACCENT2 },
        ].map(s => (
          <Card key={s.label} style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0F1017" }}>
                {["Description", "Amount", "Date", "Method", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0
                ? <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#444466" }}>No expense records</td></tr>
                : expenses.map((t, i) => (
                  <tr key={t._id || i} style={{ borderTop: "1px solid #1A1B24" }}>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#CCCCE0" }}>{t.desc}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: DANGER }}>-₹{t.amount.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#666688" }}>{t.date}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#8888AA" }}>{t.method}</td>
                    <td style={{ padding: "10px 14px" }}><Badge s={t.status} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <SectionHead title="Category Breakdown" />
          {EXPENSE_CATS.map(e => (
            <div key={e.cat} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#AAAACC" }}>{e.cat}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: e.color }}>₹{e.amount.toLocaleString()}</span>
              </div>
              <div style={{ height: 4, background: "#1E1F2A", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${e.pct}%`, background: e.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════════════════════════════════════════
function InvoicesTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editInv, setEditInv] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ client: "", amount: "", due: "", issued: new Date().toISOString().slice(0, 10), status: "Unpaid", items: "" });
  const { toast, show } = useToast();

  const load = async () => {
    setLoading(true);
    try { const d = await api("/api/finance/invoices"); setInvoices(d.invoices || d); }
    catch { setInvoices([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditInv(null); setForm({ client: "", amount: "", due: "", issued: new Date().toISOString().slice(0, 10), status: "Unpaid", items: "" }); setShowModal(true); };
  const openEdit = (inv: Invoice) => { setEditInv(inv); setForm({ client: inv.client, amount: String(inv.amount), due: inv.due, issued: inv.issued, status: inv.status, items: inv.items || "" }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, amount: Number(form.amount) };
      if (editInv) { await api(`/api/finance/invoices/${editInv._id}`, { method: "PUT", body: JSON.stringify(body) }); show("Invoice updated"); }
      else { await api("/api/finance/invoices", { method: "POST", body: JSON.stringify(body) }); show("Invoice created"); }
      setShowModal(false); load();
    } catch (e: any) { show(e.message, "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    try { await api(`/api/finance/invoices/${id}`, { method: "DELETE" }); show("Deleted"); load(); }
    catch (e: any) { show(e.message, "error"); }
  };

  const updateStatus = async (inv: Invoice, status: string) => {
    try { await api(`/api/finance/invoices/${inv._id}`, { method: "PUT", body: JSON.stringify({ ...inv, status }) }); show("Status updated"); load(); }
    catch (e: any) { show(e.message, "error"); }
  };

  const totalUnpaid = invoices.filter(i => i.status === "Unpaid" || i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Invoices", value: invoices.length, color: ACCENT2 },
          { label: "Paid", value: invoices.filter(i => i.status === "Paid").length, color: ACCENT },
          { label: "Outstanding", value: `₹${totalUnpaid.toLocaleString()}`, color: WARN },
        ].map(s => (
          <Card key={s.label} style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Btn onClick={openAdd}>+ Create Invoice</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "#555577" }}>Loading...</div> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0F1017" }}>
                {["Client", "Amount", "Issued", "Due", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0
                ? <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#444466" }}>No invoices yet</td></tr>
                : invoices.map((inv, i) => (
                  <tr key={inv._id || i} style={{ borderTop: "1px solid #1A1B24" }}>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#CCCCE0", fontWeight: 600 }}>{inv.client}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: ACCENT }}>₹{inv.amount.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#666688" }}>{inv.issued}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#666688" }}>{inv.due}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <select value={inv.status} onChange={e => updateStatus(inv, e.target.value)}
                        style={{ background: "transparent", border: "none", color: statusColor[inv.status]?.text || "#888", fontSize: 11, cursor: "pointer", outline: "none" }}>
                        {["Unpaid", "Paid", "Overdue"].map(s => <option key={s} value={s} style={{ background: "#13141C" }}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn variant="ghost" onClick={() => openEdit(inv)} style={{ padding: "3px 8px", fontSize: 10 }}>Edit</Btn>
                        <Btn variant="danger" onClick={() => handleDelete(inv._id || "")} style={{ padding: "3px 8px", fontSize: 10 }}>✕</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </Card>

      {showModal && (
        <Modal title={editInv ? "Edit Invoice" : "Create Invoice"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <Input label="Client Name" value={form.client} onChange={(e: any) => setForm({ ...form, client: e.target.value })} required />
            <Input label="Amount (₹)" type="number" value={form.amount} onChange={(e: any) => setForm({ ...form, amount: e.target.value })} required />
            <Input label="Issue Date" type="date" value={form.issued} onChange={(e: any) => setForm({ ...form, issued: e.target.value })} required />
            <Input label="Due Date" type="date" value={form.due} onChange={(e: any) => setForm({ ...form, due: e.target.value })} required />
            <Select label="Status" value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })} options={["Unpaid", "Paid", "Overdue"]} />
            <Input label="Items / Description" value={form.items} onChange={(e: any) => setForm({ ...form, items: e.target.value })} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn type="submit">{editInv ? "Update" : "Create"}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT TRACKING
// ═══════════════════════════════════════════════════════════════════════════════
function PaymentTrackingTab({ transactions }: { transactions: Transaction[] }) {
  const pending = transactions.filter(t => t.status === "Pending");
  const failed = transactions.filter(t => t.status === "Failed");
  const completed = transactions.filter(t => t.status === "Completed");

  const groups = [
    { label: "Pending Payments", items: pending, color: WARN, icon: "⏳" },
    { label: "Failed Payments", items: failed, color: DANGER, icon: "✕" },
    { label: "Completed (Last 5)", items: completed.slice(0, 5), color: ACCENT, icon: "✓" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[
          { label: "Pending Amount", value: `₹${pending.reduce((s, t) => s + t.amount, 0).toLocaleString()}`, color: WARN },
          { label: "Failed Amount", value: `₹${failed.reduce((s, t) => s + t.amount, 0).toLocaleString()}`, color: DANGER },
          { label: "Completed (Total)", value: `₹${completed.reduce((s, t) => s + t.amount, 0).toLocaleString()}`, color: ACCENT },
        ].map(s => (
          <Card key={s.label} style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>
      {groups.map(g => (
        <Card key={g.label}>
          <SectionHead title={`${g.icon} ${g.label} (${g.items.length})`} />
          {g.items.length === 0 ? (
            <p style={{ fontSize: 12, color: "#444466", textAlign: "center", padding: "20px 0" }}>None</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {g.items.map((t, i) => (
                <div key={t._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#0B0C10", borderRadius: 6, border: "1px solid #1E1F2A" }}>
                  <div>
                    <p style={{ fontSize: 12, color: "#CCCCE0", marginBottom: 2 }}>{t.desc}</p>
                    <p style={{ fontSize: 10, color: "#555577" }}>{t.date} · {t.method}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: g.color }}>₹{t.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUDGET MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════
function BudgetTab() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBudget, setEditBudget] = useState<BudgetItem | null>(null);
  const [form, setForm] = useState({ category: "", allocated: "", spent: "", month: new Date().toISOString().slice(0, 7) });
  const { toast, show } = useToast();

  const load = async () => {
    setLoading(true);
    try { const d = await api("/api/finance/budgets"); setBudgets(d.budgets || d); }
    catch { setBudgets([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditBudget(null); setForm({ category: "", allocated: "", spent: "0", month: new Date().toISOString().slice(0, 7) }); setShowModal(true); };
  const openEdit = (b: BudgetItem) => { setEditBudget(b); setForm({ category: b.category, allocated: String(b.allocated), spent: String(b.spent), month: b.month }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, allocated: Number(form.allocated), spent: Number(form.spent) };
      if (editBudget) { await api(`/api/finance/budgets/${editBudget._id}`, { method: "PUT", body: JSON.stringify(body) }); show("Budget updated"); }
      else { await api("/api/finance/budgets", { method: "POST", body: JSON.stringify(body) }); show("Budget created"); }
      setShowModal(false); load();
    } catch (e: any) { show(e.message, "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this budget item?")) return;
    try { await api(`/api/finance/budgets/${id}`, { method: "DELETE" }); show("Deleted"); load(); }
    catch (e: any) { show(e.message, "error"); }
  };

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Btn onClick={openAdd}>+ Add Budget</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "#555577" }}>Loading...</div> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0F1017" }}>
                {["Category", "Month", "Allocated", "Spent", "Remaining", "Usage", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {budgets.length === 0
                ? <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#444466" }}>No budget items</td></tr>
                : budgets.map((b, i) => {
                  const pct = Math.min(100, Math.round((b.spent / b.allocated) * 100));
                  const rem = b.allocated - b.spent;
                  const pctColor = pct > 90 ? DANGER : pct > 70 ? WARN : ACCENT;
                  return (
                    <tr key={b._id || i} style={{ borderTop: "1px solid #1A1B24" }}>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#CCCCE0", fontWeight: 600 }}>{b.category}</td>
                      <td style={{ padding: "10px 14px", fontSize: 11, color: "#666688" }}>{b.month}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: ACCENT2 }}>₹{b.allocated.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: DANGER }}>₹{b.spent.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: rem >= 0 ? ACCENT : DANGER }}>₹{rem.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px", minWidth: 120 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ flex: 1, height: 4, background: "#1E1F2A", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: pctColor, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, color: pctColor, minWidth: 28, textAlign: "right" }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn variant="ghost" onClick={() => openEdit(b)} style={{ padding: "3px 8px", fontSize: 10 }}>Edit</Btn>
                          <Btn variant="danger" onClick={() => handleDelete(b._id || "")} style={{ padding: "3px 8px", fontSize: 10 }}>✕</Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </Card>
      {showModal && (
        <Modal title={editBudget ? "Edit Budget" : "New Budget"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <Input label="Category" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} required />
            <Input label="Month (YYYY-MM)" type="month" value={form.month} onChange={(e: any) => setForm({ ...form, month: e.target.value })} required />
            <Input label="Allocated (₹)" type="number" value={form.allocated} onChange={(e: any) => setForm({ ...form, allocated: e.target.value })} required />
            <Input label="Spent (₹)" type="number" value={form.spent} onChange={(e: any) => setForm({ ...form, spent: e.target.value })} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn type="submit">{editBudget ? "Update" : "Create"}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// P&L TAB
// ═══════════════════════════════════════════════════════════════════════════════
function PnLTab({ transactions }: { transactions: Transaction[] }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();

  const monthlyData = months.map((month, idx) => {
    const mo = String(idx + 1).padStart(2, "0");
    const prefix = `${currentYear}-${mo}`;
    const inc = transactions.filter(t => t.type === "Income" && t.date?.startsWith(prefix)).reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === "Expense" && t.date?.startsWith(prefix)).reduce((s, t) => s + t.amount, 0);
    return { month, income: inc, expense: exp, profit: inc - exp };
  });

  const totalIncome = transactions.filter(t => t.type === "Income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";
  const maxVal = Math.max(...MONTHLY_PNL.map(m => m.income), 1);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Gross Revenue", value: `₹${(totalIncome / 100000).toFixed(2)}L`, color: ACCENT },
          { label: "Total Expenses", value: `₹${(totalExpense / 100000).toFixed(2)}L`, color: DANGER },
          { label: "Net Profit", value: `₹${(netProfit / 100000).toFixed(2)}L`, color: netProfit >= 0 ? ACCENT2 : DANGER },
          { label: "Profit Margin", value: `${margin}%`, color: WARN },
        ].map(s => (
          <Card key={s.label} style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <SectionHead title={`Monthly P&L — ${currentYear}`}
          action={<div style={{ display: "flex", gap: 14, fontSize: 11 }}><span style={{ color: ACCENT }}>● Revenue</span><span style={{ color: DANGER }}>● Expenses</span></div>}
        />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
          {MONTHLY_PNL.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", gap: 2, alignItems: "flex-end" }}>
              <div title={`Revenue: ₹${m.income}L`} style={{ flex: 1, height: `${(m.income / maxVal) * 100}%`, background: ACCENT, borderRadius: "3px 3px 0 0", opacity: 0.85, cursor: "pointer", transition: "opacity 0.2s" }} />
              <div title={`Expenses: ₹${m.expense}L`} style={{ flex: 1, height: `${(m.expense / maxVal) * 100}%`, background: DANGER, borderRadius: "3px 3px 0 0", opacity: 0.7, cursor: "pointer" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {MONTHLY_PNL.map((m, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#555577" }}>{m.month}</div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Month", "Revenue", "Expenses", "Net Profit", "Margin"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyData.filter(m => m.income > 0 || m.expense > 0).map((m, i) => {
              const mar = m.income ? ((m.profit / m.income) * 100).toFixed(1) : "0";
              return (
                <tr key={i} style={{ borderTop: "1px solid #1A1B24" }}>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#CCCCE0", fontWeight: 600 }}>{m.month} {currentYear}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: ACCENT }}>₹{m.income.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: DANGER }}>₹{m.expense.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: m.profit >= 0 ? ACCENT2 : DANGER }}>₹{m.profit.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: WARN }}>{mar}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL REPORTS
// ═══════════════════════════════════════════════════════════════════════════════
function ReportsTab({ transactions }: { transactions: Transaction[] }) {
  const totalInc = transactions.filter(t => t.type === "Income").reduce((s, t) => s + t.amount, 0);
  const totalExp = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const net = totalInc - totalExp;
  const reports = [
    { title: "Income Summary", desc: `Total income from ${transactions.filter(t => t.type === "Income").length} transactions`, value: `₹${totalInc.toLocaleString()}`, color: ACCENT, icon: "◈" },
    { title: "Expense Summary", desc: `Total expenses from ${transactions.filter(t => t.type === "Expense").length} transactions`, value: `₹${totalExp.toLocaleString()}`, color: DANGER, icon: "◎" },
    { title: "Net Profit/Loss", desc: net >= 0 ? "Business is profitable" : "Business running at loss", value: `₹${net.toLocaleString()}`, color: net >= 0 ? ACCENT2 : DANGER, icon: "◕" },
    { title: "Pending Dues", desc: `${transactions.filter(t => t.status === "Pending").length} pending transactions`, value: `₹${transactions.filter(t => t.status === "Pending").reduce((s, t) => s + t.amount, 0).toLocaleString()}`, color: WARN, icon: "◓" },
  ];

  const downloadReport = (type: string) => {
    const data = type === "income" ? transactions.filter(t => t.type === "Income") : type === "expense" ? transactions.filter(t => t.type === "Expense") : transactions;
    const rows = [["Description", "Type", "Amount", "Date", "Method", "Status"], ...data.map(t => [t.desc, t.type, t.amount, t.date, t.method, t.status])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = `${type}-report-${Date.now()}.csv`; a.click();
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 20 }}>
        {reports.map(r => (
          <Card key={r.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, background: `${r.color}15`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: r.color, flexShrink: 0 }}>{r.icon}</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#CCCCE0", marginBottom: 4 }}>{r.title}</p>
              <p style={{ fontSize: 11, color: "#666688", marginBottom: 8 }}>{r.desc}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: r.color }}>{r.value}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionHead title="Download Reports" />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[{ label: "Income Report", key: "income" }, { label: "Expense Report", key: "expense" }, { label: "Full Report", key: "all" }].map(r => (
            <Btn key={r.key} onClick={() => downloadReport(r.key)} variant="ghost" style={{ display: "flex", alignItems: "center", gap: 6 }}>⬇ {r.label} (CSV)</Btn>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAX RECORDS
// ═══════════════════════════════════════════════════════════════════════════════
function TaxTab() {
  const [records, setRecords] = useState<TaxRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRec, setEditRec] = useState<TaxRecord | null>(null);
  const [form, setForm] = useState({ quarter: "Q1", type: "GST", amount: "", dueDate: "", status: "Pending", notes: "" });
  const { toast, show } = useToast();

  const load = async () => {
    setLoading(true);
    try { const d = await api("/api/finance/tax"); setRecords(d.records || d); }
    catch { setRecords([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditRec(null); setForm({ quarter: "Q1", type: "GST", amount: "", dueDate: "", status: "Pending", notes: "" }); setShowModal(true); };
  const openEdit = (r: TaxRecord) => { setEditRec(r); setForm({ quarter: r.quarter, type: r.type, amount: String(r.amount), dueDate: r.dueDate, status: r.status, notes: r.notes || "" }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { ...form, amount: Number(form.amount) };
      if (editRec) { await api(`/api/finance/tax/${editRec._id}`, { method: "PUT", body: JSON.stringify(body) }); show("Tax record updated"); }
      else { await api("/api/finance/tax", { method: "POST", body: JSON.stringify(body) }); show("Tax record created"); }
      setShowModal(false); load();
    } catch (e: any) { show(e.message, "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tax record?")) return;
    try { await api(`/api/finance/tax/${id}`, { method: "DELETE" }); show("Deleted"); load(); }
    catch (e: any) { show(e.message, "error"); }
  };

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Filed", value: records.filter(r => r.status === "Filed").length, color: ACCENT },
          { label: "Pending", value: records.filter(r => r.status === "Pending").length, color: WARN },
          { label: "Total Tax Liability", value: `₹${records.reduce((s, r) => s + r.amount, 0).toLocaleString()}`, color: ACCENT2 },
        ].map(s => (
          <Card key={s.label} style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Btn onClick={openAdd}>+ Add Tax Record</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "#555577" }}>Loading...</div> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0F1017" }}>
                {["Quarter", "Type", "Amount", "Due Date", "Status", "Notes", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0
                ? <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#444466" }}>No tax records</td></tr>
                : records.map((r, i) => (
                  <tr key={r._id || i} style={{ borderTop: "1px solid #1A1B24" }}>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#CCCCE0", fontWeight: 600 }}>{r.quarter}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: ACCENT2 }}>{r.type}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: WARN }}>₹{r.amount.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#666688" }}>{r.dueDate}</td>
                    <td style={{ padding: "10px 14px" }}><Badge s={r.status} /></td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#666688" }}>{r.notes || "—"}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn variant="ghost" onClick={() => openEdit(r)} style={{ padding: "3px 8px", fontSize: 10 }}>Edit</Btn>
                        <Btn variant="danger" onClick={() => handleDelete(r._id || "")} style={{ padding: "3px 8px", fontSize: 10 }}>✕</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </Card>
      {showModal && (
        <Modal title={editRec ? "Edit Tax Record" : "New Tax Record"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <Select label="Quarter" value={form.quarter} onChange={(e: any) => setForm({ ...form, quarter: e.target.value })} options={["Q1", "Q2", "Q3", "Q4"]} required />
            <Select label="Tax Type" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })} options={["GST", "TDS", "Income Tax", "Professional Tax", "Other"]} required />
            <Input label="Amount (₹)" type="number" value={form.amount} onChange={(e: any) => setForm({ ...form, amount: e.target.value })} required />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e: any) => setForm({ ...form, dueDate: e.target.value })} required />
            <Select label="Status" value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })} options={["Pending", "Filed", "Overdue"]} />
            <Input label="Notes (optional)" value={form.notes} onChange={(e: any) => setForm({ ...form, notes: e.target.value })} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn type="submit">{editRec ? "Update" : "Save"}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT REPORTS
// ═══════════════════════════════════════════════════════════════════════════════
function ExportTab({ transactions }: { transactions: Transaction[] }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [type, setType] = useState("All");
  const { toast, show } = useToast();

  const handleExport = (format: "csv" | "json") => {
    let filtered = transactions;
    if (type !== "All") filtered = filtered.filter(t => t.type === type);
    if (dateFrom) filtered = filtered.filter(t => t.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(t => t.date <= dateTo);
    if (filtered.length === 0) { show("No data matches filters", "error"); return; }

    if (format === "json") {
      const a = document.createElement("a"); a.href = "data:application/json," + encodeURIComponent(JSON.stringify(filtered, null, 2)); a.download = `finance-export-${Date.now()}.json`; a.click();
    } else {
      const rows = [["Description", "Type", "Amount", "Date", "Method", "Status"], ...filtered.map(t => [t.desc, t.type, t.amount, t.date, t.method, t.status])];
      const csv = rows.map(r => r.join(",")).join("\n");
      const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = `finance-export-${Date.now()}.csv`; a.click();
    }
    show(`Exported ${filtered.length} records`);
  };

  return (
    <div>
      {toast && <Toast {...toast} />}
      <Card style={{ maxWidth: 500, marginBottom: 16 }}>
        <SectionHead title="Export Filters" />
        <Select label="Transaction Type" value={type} onChange={(e: any) => setType(e.target.value)} options={["All", "Income", "Expense"]} />
        <Input label="From Date" type="date" value={dateFrom} onChange={(e: any) => setDateFrom(e.target.value)} />
        <Input label="To Date" type="date" value={dateTo} onChange={(e: any) => setDateTo(e.target.value)} />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn onClick={() => handleExport("csv")}>⬇ Export CSV</Btn>
          <Btn variant="ghost" onClick={() => handleExport("json")}>⬇ Export JSON</Btn>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[
          { label: "Total Records", value: transactions.length },
          { label: "Income Records", value: transactions.filter(t => t.type === "Income").length },
          { label: "Expense Records", value: transactions.filter(t => t.type === "Expense").length },
        ].map(s => (
          <Card key={s.label} style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: ACCENT2 }}>{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT PANEL
// ═══════════════════════════════════════════════════════════════════════════════
export default function FinancePanel() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const { toast, show } = useToast();

  // Auth guard
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!["finance_admin", "main_admin", "superadmin"].includes(role || "")) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  // Load transactions (shared across tabs)
  const loadTransactions = async () => {
    setTxLoading(true);
    try {
      const d = await api("/api/finance/transactions");
      setTransactions(d.transactions || d);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => { loadTransactions(); }, []);

  const addTransaction = async (t: Omit<Transaction, "_id">) => {
    await api("/api/finance/transactions", { method: "POST", body: JSON.stringify(t) });
    await loadTransactions();
  };

  const deleteTransaction = async (id: string) => {
    if (!id) return;
    if (!confirm("Delete this transaction?")) return;
    try {
      await api(`/api/finance/transactions/${id}`, { method: "DELETE" });
      show("Transaction deleted");
      await loadTransactions();
    } catch (e: any) { show(e.message, "error"); }
  };

  const renderContent = () => {
    switch (active) {
      case "dashboard": return <FinanceDashboard transactions={transactions} />;
      case "income": return <IncomeTab transactions={transactions} />;
      case "expenses": return <ExpensesTab transactions={transactions} />;
      case "transactions": return <TransactionsTab transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} loading={txLoading} />;
      case "invoices": return <InvoicesTab />;
      case "paytrack": return <PaymentTrackingTab transactions={transactions} />;
      case "budget": return <BudgetTab />;
      case "pnl": return <PnLTab transactions={transactions} />;
      case "reports": return <ReportsTab transactions={transactions} />;
      case "tax": return <TaxTab />;
      case "export": return <ExportTab transactions={transactions} />;
      default: return null;
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF" }}>
      {toast && <Toast {...toast} />}

      {/* Sidebar */}
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
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 16px",
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

        {/* Logout */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1E1F2A" }}>
          <button onClick={() => { localStorage.clear(); navigate({ to: "/login" }); }}
            style={{ width: "100%", padding: "8px 12px", background: "rgba(255,107,107,0.08)", border: `1px solid ${DANGER}30`, borderRadius: 6, color: DANGER, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
            ← Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ background: "#0F1117", borderBottom: "1px solid #1E1F2A", padding: "0 24px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Back to Admin */}
            <button onClick={() => navigate({ to: "/admin" })}
              style={{ background: "transparent", border: "1px solid #2A2B38", borderRadius: 6, padding: "4px 10px", color: "#666688", fontSize: 11, cursor: "pointer" }}>
              ← Admin
            </button>
            <h1 style={{ fontSize: 15, fontWeight: 600, color: "#E8E8EF", margin: 0 }}>
              {SIDEBAR_ITEMS.find(s => s.id === active)?.label}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#555577" }}>{user?.name || user?.email || "Finance Admin"}</span>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000" }}>
              {(user?.name || "F").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}