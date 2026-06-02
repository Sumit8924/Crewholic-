/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
export const Route = createFileRoute("/rental")({
  component: RentalPanel,
});
const ACCENT = "#4ECDC4";
const ACCENT2 = "#0097FF";

const SIDEBAR_ITEMS = [
  { id: "inventory", label: "Products Inventory", icon: "▦" },
  { id: "categories", label: "Product Categories", icon: "◧" },
  { id: "tracking", label: "Equipment Tracking", icon: "◎" },
  { id: "bookings", label: "Bookings / Orders", icon: "◈" },
  { id: "requests", label: "Rental Requests", icon: "◉" },
  { id: "clients", label: "Client Details", icon: "◑" },
  { id: "payments", label: "Payments", icon: "◒" },
  { id: "delivery", label: "Delivery Tracking", icon: "◓" },
  { id: "maintenance", label: "Maintenance Requests", icon: "◔" },
  { id: "support", label: "Support Tickets", icon: "◕" },
  { id: "reports", label: "Reports", icon: "◆" },
];

const INVENTORY = [
  { id: "EQ-001", name: "MacBook Pro 14\" M3", category: "Laptops", qty: 12, available: 7, rented: 5, dailyRate: "₹800", status: "Available" },
  { id: "EQ-002", name: "Sony A7 III Camera", category: "Cameras", qty: 6, available: 2, rented: 4, dailyRate: "₹1,200", status: "Low Stock" },
  { id: "EQ-003", name: "Dell UltraSharp 27\" Monitor", category: "Monitors", qty: 20, available: 14, rented: 6, dailyRate: "₹350", status: "Available" },
  { id: "EQ-004", name: "DJI Mavic 3 Drone", category: "Drones", qty: 4, available: 0, rented: 4, dailyRate: "₹2,500", status: "Fully Rented" },
  { id: "EQ-005", name: "iPad Pro 12.9\" M2", category: "Tablets", qty: 15, available: 9, rented: 6, dailyRate: "₹500", status: "Available" },
  { id: "EQ-006", name: "Rode NT1 Microphone", category: "Audio", qty: 8, available: 3, rented: 5, dailyRate: "₹400", status: "Available" },
  { id: "EQ-007", name: "Epson 4K Projector", category: "Projectors", qty: 5, available: 1, rented: 4, dailyRate: "₹1,800", status: "Low Stock" },
];

const BOOKINGS = [
  { id: "BKG-301", client: "Prism Studios", items: "Sony A7 III x2", days: 5, total: "₹12,000", from: "Dec 12", to: "Dec 17", status: "Active" },
  { id: "BKG-302", client: "EventPro India", items: "DJI Mavic 3 x2, Rode NT1 x3", days: 3, total: "₹16,200", from: "Dec 13", to: "Dec 16", status: "Active" },
  { id: "BKG-303", client: "TechTalks Conference", items: "MacBook Pro x5, Monitor x10", days: 2, total: "₹15,000", from: "Dec 20", to: "Dec 22", status: "Upcoming" },
  { id: "BKG-304", client: "CloudSoft Labs", items: "iPad Pro x6", days: 7, total: "₹21,000", from: "Dec 8", to: "Dec 15", status: "Returned" },
];

const CATEGORIES = [
  { name: "Laptops", count: 12, rented: 5, icon: "▦", color: ACCENT },
  { name: "Cameras", count: 6, rented: 4, icon: "◈", color: "#FFA94D" },
  { name: "Monitors", count: 20, rented: 6, icon: "◎", color: ACCENT2 },
  { name: "Drones", count: 4, rented: 4, icon: "◉", color: "#FF6B6B" },
  { name: "Tablets", count: 15, rented: 6, icon: "◑", color: "#A8E6CF" },
  { name: "Audio", count: 8, rented: 5, icon: "◒", color: "#FFD93D" },
  { name: "Projectors", count: 5, rented: 4, icon: "◓", color: "#6C63FF" },
];

const statusColor = {
  "Available": { bg: "rgba(78,205,196,0.12)", text: "#4ECDC4" },
  "Low Stock": { bg: "rgba(255,165,61,0.12)", text: "#FFA94D" },
  "Fully Rented": { bg: "rgba(255,107,107,0.12)", text: "#FF6B6B" },
  "Active": { bg: "rgba(0,201,167,0.12)", text: "#00C9A7" },
  "Upcoming": { bg: "rgba(0,151,255,0.12)", text: "#0097FF" },
  "Returned": { bg: "rgba(136,136,170,0.12)", text: "#888899" },
};

const Badge = ({ s }) => {
  const st = statusColor[s] || { bg: "#1E1F2A", text: "#888" };
  return <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: st.bg, color: st.text, fontWeight: 600 }}>{s}</span>;
};

function InventoryTab() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Equipment", value: "70", color: ACCENT },
          { label: "Currently Rented", value: "34", color: "#FFA94D" },
          { label: "Available Now", value: "36", color: "#00C9A7" },
          { label: "Revenue This Month", value: "₹2.8L", color: ACCENT2 },
        ].map(m => (
          <div key={m.label} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, color: "#666688", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Equipment Inventory</span>
          <button style={{ fontSize: 11, color: ACCENT, background: "rgba(78,205,196,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>+ Add Equipment</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Equipment", "Category", "Total Qty", "Available", "Rented", "Daily Rate", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVENTORY.map((item, i) => (
              <tr key={item.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: "#555577" }}>{item.id}</div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{item.category}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#EEEEF5", textAlign: "center" }}>{item.qty}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#00C9A7", textAlign: "center" }}>{item.available}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#FFA94D", textAlign: "center" }}>{item.rented}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: ACCENT, fontWeight: 500 }}>{item.dailyRate}</td>
                <td style={{ padding: "12px 14px" }}><Badge s={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
      {CATEGORIES.map(c => (
        <div key={c.name} style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, padding: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: c.color + "18", border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: c.color, marginBottom: 12 }}>{c.icon}</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#D0D0E8", marginBottom: 6 }}>{c.name}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div style={{ background: "#0F1017", borderRadius: 6, padding: "8px 10px" }}>
              <p style={{ fontSize: 9, color: "#555577", marginBottom: 2 }}>Total</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#EEEEF5" }}>{c.count}</p>
            </div>
            <div style={{ background: "#0F1017", borderRadius: 6, padding: "8px 10px" }}>
              <p style={{ fontSize: 9, color: "#555577", marginBottom: 2 }}>Rented</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.rented}</p>
            </div>
          </div>
          <div style={{ height: 3, background: "#1E1F2A", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round((c.rented / c.count) * 100)}%`, background: c.color, borderRadius: 2 }} />
          </div>
          <p style={{ fontSize: 10, color: "#555577", marginTop: 5 }}>{Math.round((c.rented / c.count) * 100)}% utilization</p>
        </div>
      ))}
    </div>
  );
}

function BookingsTab() {
  return (
    <div>
      <div style={{ background: "#13141C", border: "1px solid #1E1F2A", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #1E1F2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#CCCCE0" }}>Active Bookings</span>
          <button style={{ fontSize: 11, color: ACCENT, background: "rgba(78,205,196,0.08)", border: `1px solid ${ACCENT}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>+ New Booking</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0F1017" }}>
              {["Booking ID", "Client", "Items", "Days", "Total", "Period", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#555577", fontWeight: 500, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOOKINGS.map((b, i) => (
              <tr key={b.id} style={{ borderTop: "1px solid #1A1B24", background: i % 2 === 0 ? "transparent" : "#0D0E14" }}>
                <td style={{ padding: "12px 14px", fontSize: 11, color: ACCENT2 }}>{b.id}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 500, color: "#D0D0E8" }}>{b.client}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "#8888AA" }}>{b.items}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: "#EEEEF5", textAlign: "center" }}>{b.days}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, fontWeight: 600, color: ACCENT }}>{b.total}</td>
                <td style={{ padding: "12px 14px", fontSize: 10, color: "#555577" }}>{b.from} – {b.to}</td>
                <td style={{ padding: "12px 14px" }}><Badge s={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TAB_CONTENT = {
  inventory: <InventoryTab />,
  categories: <CategoriesTab />,
  bookings: <BookingsTab />,
};

export default function TechRentalPanel() {
  const [active, setActive] = useState("inventory");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0B0C10", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#E8E8EF" }}>
      <aside style={{ width: 220, background: "#0F1117", borderRight: "1px solid #1E1F2A", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #1E1F2A", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◧</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#E8E8EF" }}>Tech Rental</p>
            <p style={{ fontSize: 10, color: "#555577" }}>Inventory & Bookings</p>
          </div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0", scrollbarWidth: "none" }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px",
              background: active === item.id ? "rgba(78,205,196,0.12)" : "transparent",
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
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000", cursor: "pointer" }}>T</div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {TAB_CONTENT[active] || (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#444466", fontSize: 13 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>◧</div>
                <p>{SIDEBAR_ITEMS.find(s => s.id === active)?.label}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}