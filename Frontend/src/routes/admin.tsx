/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "⬡",
    sub: [
      "Overview",
      "Revenue Summary",
      "Active Projects",
      "Pending Tasks",
      "Team Performance",
      "Notifications",
      "Recent Activities",
      "Analytics Overview",
    ],
  },
  {
    id: "website",
    label: "Website Creation",
    icon: "◈",
    sub: [
      "Projects Overview",
      "New Requests",
      "Assigned Teams",
      "Project Details",
      "Project Timeline",
      "Work Progress Tracking",
      "Client Communication",
      "File Management",
      "Deliverables",
      "Payments & Invoices",
      "Completed Projects",
      "Reports",
    ],
  },
  {
    id: "marketing",
    label: "Marketing Panel",
    icon: "◉",
    sub: [
      "Campaign Management",
      "Lead Management",
      "Lead Assignment",
      "Call Center Activities",
      "Client Communication",
      "Marketing Reports",
      "Performance Analytics",
      "Social Media Campaigns",
      "Email Campaigns",
      "Team Management",
      "Target Tracking",
    ],
  },
  {
    id: "rental",
    label: "Tech Rental",
    icon: "◧",
    sub: [
      "Products Inventory",
      "Product Categories",
      "Equipment Tracking",
      "Bookings / Orders",
      "Rental Requests",
      "Client Details",
      "Payments",
      "Delivery Tracking",
      "Maintenance Requests",
      "Support Tickets",
      "Reports",
    ],
  },
  {
    id: "events",
    label: "Event Management",
    icon: "◫",
    sub: [
      "Event Requests",
      "Event Planning",
      "Event Scheduling",
      "Vendor Management",
      "Resource Allocation",
      "Work Progress",
      "Client Communication",
      "Payments",
      "Budget Tracking",
      "Event Reports",
      "Event Analytics",
    ],
  },
  {
    id: "finance",
    label: "Finance Panel",
    icon: "◎",
    sub: [
      "Dashboard",
      "Income",
      "Expenses",
      "Transactions",
      "Invoices",
      "Payment Tracking",
      "Budget Management",
      "Profit & Loss",
      "Financial Reports",
      "Tax Records",
      "Export Reports",
    ],
  },
  {
    id: "director",
    label: "Director Panel",
    icon: "◆",
    sub: [
      "Company Overview",
      "Department Overview",
      "KPI Monitoring",
      "Business Growth",
      "Performance Reports",
      "Analytics Dashboard",
      "Important Decisions",
      "Notifications",
      "Company Reports",
      "Strategic Planning",
    ],
  },
  {
    id: "analyst",
    label: "Analyst Dashboard",
    icon: "◐",
    sub: [
      "Data Analysis",
      "Performance Reports",
      "Trend Analysis",
      "Business Insights",
      "Graphs & Charts",
      "Data Export",
      "Forecast Reports",
      "Department Analytics",
      "KPI Analytics",
      "Custom Reports",
    ],
  },
  {
    id: "callcenter",
    label: "Call Center",
    icon: "◑",
    sub: [
      "Lead Calling",
      "Lead Management",
      "Customer Support",
      "Follow-Ups",
      "Lead Status Tracking",
      "Call Logs",
      "Call Reports",
      "Team Performance",
      "Ticket Management",
      "Outreach Analytics",
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: "◓",
    sub: [
      "Revenue Reports",
      "Project Reports",
      "Marketing Reports",
      "Rental Reports",
      "Event Reports",
      "Team Reports",
      "Finance Reports",
      "KPI Reports",
      "Export Center",
    ],
  },
  {
    id: "team",
    label: "Team Management",
    icon: "◒",
    sub: [
      "Employees",
      "Departments",
      "Roles & Permissions",
      "Attendance",
      "Performance Review",
      "Task Assignment",
      "Activity Logs",
    ],
  },
  {
    id: "notifications",
    label: "Notifications Center",
    icon: "◔",
    sub: [
      "System Notifications",
      "Client Notifications",
      "Payment Alerts",
      "Task Alerts",
      "Approval Requests",
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "◕",
    sub: [
      "Company Settings",
      "User Management",
      "Roles & Permissions",
      "Theme Settings",
      "Email Settings",
      "Security Settings",
      "Integrations",
      "Backup & Restore",
      "System Configuration",
    ],
  },
];

const METRICS = [
  {
    label: "Total Revenue",
    value: "₹84.2L",
    change: "+12.4%",
    up: true,
    color: "#6C63FF",
  },
  {
    label: "Active Projects",
    value: "47",
    change: "+3 this week",
    up: true,
    color: "#00C9A7",
  },
  {
    label: "Pending Tasks",
    value: "128",
    change: "-8 today",
    up: false,
    color: "#FF6B6B",
  },
  {
    label: "Team Members",
    value: "63",
    change: "+2 this month",
    up: true,
    color: "#FFA94D",
  },
];

const RECENT = [
  {
    icon: "◈",
    text: "New website project assigned — TechCorp India",
    time: "2m ago",
    type: "project",
  },
  {
    icon: "◉",
    text: "Campaign #14 reached 10K leads milestone",
    time: "18m ago",
    type: "marketing",
  },
  {
    icon: "◎",
    text: "Invoice #INV-2847 paid — ₹1,40,000",
    time: "1h ago",
    type: "finance",
  },
  {
    icon: "◫",
    text: "Event booking confirmed for Dec 28 — Wedding Summit",
    time: "3h ago",
    type: "event",
  },
  {
    icon: "◧",
    text: "MacBook Pro x5 rental returned — Condition: Good",
    time: "5h ago",
    type: "rental",
  },
  {
    icon: "◑",
    text: "54 calls completed by Call Center team today",
    time: "6h ago",
    type: "call",
  },
];

const PROJECTS = [
  {
    name: "TechCorp Website Revamp",
    progress: 78,
    status: "In Progress",
    team: "Team Alpha",
    due: "Dec 20",
  },
  {
    name: "E-Commerce Platform",
    progress: 45,
    status: "In Progress",
    team: "Team Beta",
    due: "Jan 10",
  },
  {
    name: "Corporate Portal",
    progress: 92,
    status: "Review",
    team: "Team Gamma",
    due: "Dec 15",
  },
  {
    name: "Mobile App Landing",
    progress: 20,
    status: "Started",
    team: "Team Delta",
    due: "Jan 25",
  },
];

const BARS = [
  { label: "Mon", value: 65 },
  { label: "Tue", value: 82 },
  { label: "Wed", value: 54 },
  { label: "Thu", value: 91 },
  { label: "Fri", value: 73 },
  { label: "Sat", value: 48 },
  { label: "Sun", value: 36 },
];

const typeColor = {
  project: "#6C63FF",
  marketing: "#00C9A7",
  finance: "#FFA94D",
  event: "#FF6B6B",
  rental: "#4ECDC4",
  call: "#A8E6CF",
};

function AdminDashboard() {
  const [activePanel, setActivePanel] = useState("dashboard");
  const [activeSub, setActiveSub] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const currentNav = NAV.find((n) => n.id === activePanel);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0B0C10",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#E8E8EF",
        overflow: "hidden",
      }}
    >
      <aside
        style={{
          width: sidebarOpen ? 240 : 64,
          background: "#0F1117",
          borderRight: "1px solid #1E1F2A",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid #1E1F2A",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg,#6C63FF,#00C9A7)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            ⬡
          </div>

          {sidebarOpen && (
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
                background: "linear-gradient(90deg,#fff,#A0A0C0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CREWHOLIC ADMIN
            </span>
          )}
        </div>

        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "8px 0",
            scrollbarWidth: "none",
          }}
        >
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setActivePanel(n.id);
                setActiveSub(n.sub[0]);
                if (!sidebarOpen) setSidebarOpen(true);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 16px",
                background:
                  activePanel === n.id
                    ? "rgba(108,99,255,0.15)"
                    : "transparent",
                border: "none",
                cursor: "pointer",
                color: activePanel === n.id ? "#6C63FF" : "#8888AA",
                fontSize: 13,
                fontWeight: activePanel === n.id ? 600 : 400,
                borderLeft:
                  activePanel === n.id
                    ? "2px solid #6C63FF"
                    : "2px solid transparent",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && (
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {n.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setSidebarOpen((p) => !p)}
          style={{
            margin: "12px 16px",
            padding: "8px",
            background: "#1A1B25",
            border: "1px solid #2A2B38",
            borderRadius: 8,
            cursor: "pointer",
            color: "#6666AA",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "flex-end" : "center",
          }}
        >
          {sidebarOpen ? "← collapse" : "→"}
        </button>
      </aside>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            background: "#0F1117",
            borderBottom: "1px solid #1E1F2A",
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#E8E8EF",
              }}
            >
              {currentNav?.label}
            </h1>

            <span
              style={{
                fontSize: 12,
                color: "#555577",
                padding: "2px 8px",
                background: "#1A1B25",
                borderRadius: 4,
              }}
            >
              {activeSub}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontSize: 12,
                color: "#555577",
                fontFamily: "monospace",
              }}
            >
              {clock.toLocaleTimeString()}
            </span>

            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6C63FF,#FF6B6B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              A
            </div>
          </div>
        </header>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <aside
            style={{
              width: 200,
              background: "#0D0E14",
              borderRight: "1px solid #1A1B24",
              overflowY: "auto",
              flexShrink: 0,
              scrollbarWidth: "none",
            }}
          >
            <div style={{ padding: "12px 0" }}>
              {currentNav?.sub.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSub(s)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 16px",
                    background:
                      activeSub === s
                        ? "rgba(108,99,255,0.1)"
                        : "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: activeSub === s ? "#9D97FF" : "#666688",
                    fontSize: 12,
                    fontWeight: activeSub === s ? 500 : 400,
                    borderLeft:
                      activeSub === s
                        ? "2px solid #6C63FF"
                        : "2px solid transparent",
                    transition: "all 0.1s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </aside>

          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 24,
              scrollbarWidth: "thin",
              scrollbarColor: "#1E1F2A transparent",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: "#13141C",
                    border: "1px solid #1E1F2A",
                    borderRadius: 12,
                    padding: "16px 20px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 60,
                      height: 60,
                      background: m.color,
                      opacity: 0.07,
                      borderRadius: "0 12px 0 60px",
                    }}
                  />

                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: 11,
                      color: "#666688",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {m.label}
                  </p>

                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#EEEEF5",
                    }}
                  >
                    {m.value}
                  </p>

                  <span
                    style={{
                      fontSize: 11,
                      color: m.up ? "#00C9A7" : "#FF6B6B",
                      fontWeight: 500,
                    }}
                  >
                    {m.up ? "↑" : "↓"} {m.change}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 320px",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: "#13141C",
                  border: "1px solid #1E1F2A",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#CCCCE0",
                    }}
                  >
                    Active Projects
                  </h2>

                  <span
                    style={{
                      fontSize: 11,
                      color: "#6C63FF",
                      cursor: "pointer",
                    }}
                  >
                    View all →
                  </span>
                </div>

                {PROJECTS.map((p, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#D0D0E8",
                        }}
                      >
                        {p.name}
                      </span>

                      <span style={{ fontSize: 11, color: "#555577" }}>
                        Due {p.due}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 4,
                          background: "#1E1F2A",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${p.progress}%`,
                            background:
                              p.progress > 80
                                ? "#00C9A7"
                                : p.progress > 40
                                  ? "#6C63FF"
                                  : "#FFA94D",
                            borderRadius: 2,
                            transition: "width 1s ease",
                          }}
                        />
                      </div>

                      <span
                        style={{
                          fontSize: 11,
                          color: "#8888AA",
                          minWidth: 30,
                        }}
                      >
                        {p.progress}%
                      </span>

                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          borderRadius: 4,
                          background: "rgba(108,99,255,0.12)",
                          color: "#9D97FF",
                        }}
                      >
                        {p.status}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 11,
                        color: "#44445A",
                      }}
                    >
                      {p.team}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#13141C",
                  border: "1px solid #1E1F2A",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <h2
                  style={{
                    margin: "0 0 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#CCCCE0",
                  }}
                >
                  Weekly Activity
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    height: 120,
                    paddingBottom: 8,
                  }}
                >
                  {BARS.map((b, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: `${b.value}%`,
                          background: i === 3 ? "#6C63FF" : "#1E1F2A",
                          borderRadius: "3px 3px 0 0",
                          border: i === 3 ? "none" : "1px solid #2A2B38",
                        }}
                      />

                      <span style={{ fontSize: 10, color: "#44445A" }}>
                        {b.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: "1px solid #1A1B24",
                    paddingTop: 12,
                    marginTop: 4,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 11, color: "#555577" }}>
                    Peak day:{" "}
                    <span style={{ color: "#9D97FF" }}>
                      Thursday (91 tasks)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "320px 1fr",
                gap: 20,
              }}
            >
              <div
                style={{
                  background: "#13141C",
                  border: "1px solid #1E1F2A",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <h2
                  style={{
                    margin: "0 0 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#CCCCE0",
                  }}
                >
                  Recent Activity
                </h2>

                {RECENT.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: typeColor[r.type] + "20",
                        border: `1px solid ${typeColor[r.type]}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        flexShrink: 0,
                        color: typeColor[r.type],
                      }}
                    >
                      {r.icon}
                    </div>

                    <div>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: 11,
                          color: "#AAAACC",
                          lineHeight: 1.4,
                        }}
                      >
                        {r.text}
                      </p>

                      <span style={{ fontSize: 10, color: "#44445A" }}>
                        {r.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#13141C",
                  border: "1px solid #1E1F2A",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <h2
                  style={{
                    margin: "0 0 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#CCCCE0",
                  }}
                >
                  Team Performance
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      name: "Development",
                      score: 94,
                      members: 12,
                      color: "#6C63FF",
                    },
                    {
                      name: "Marketing",
                      score: 87,
                      members: 8,
                      color: "#00C9A7",
                    },
                    {
                      name: "Design",
                      score: 91,
                      members: 6,
                      color: "#FFA94D",
                    },
                    {
                      name: "Sales",
                      score: 78,
                      members: 10,
                      color: "#FF6B6B",
                    },
                    {
                      name: "Support",
                      score: 83,
                      members: 7,
                      color: "#4ECDC4",
                    },
                    {
                      name: "Finance",
                      score: 96,
                      members: 4,
                      color: "#A8E6CF",
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#0F1017",
                        borderRadius: 8,
                        padding: "12px 14px",
                        border: "1px solid #1A1B24",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#AAAACC",
                          }}
                        >
                          {t.name}
                        </span>

                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: t.color,
                          }}
                        >
                          {t.score}%
                        </span>
                      </div>

                      <div
                        style={{
                          height: 3,
                          background: "#1E1F2A",
                          borderRadius: 2,
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${t.score}%`,
                            background: t.color,
                            borderRadius: 2,
                          }}
                        />
                      </div>

                      <span style={{ fontSize: 10, color: "#44445A" }}>
                        {t.members} members
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}