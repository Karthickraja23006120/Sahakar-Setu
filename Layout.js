import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUser, clearSession } from "./apiClient";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trainees", label: "Trainees (ERP)" },
  { href: "/courses", label: "LMS Courses" },
  { href: "/attendance", label: "Attendance" },
  { href: "/certificates", label: "Skill Passport" },
  { href: "/jobs", label: "AI Job Matching" },
  { href: "/analytics", label: "Analytics" },
];

export default function Layout({ children, title }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout() {
    clearSession();
    setUser(null);
    router.push("/login");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Sahakar Setu</h1>
        <div className="tagline">NCCT Training-to-Employment Platform</div>
        <nav>
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={router.pathname === item.href ? "active" : ""}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {user && (
          <div className="tenant-badge">
            {user.name} · {user.role}
            <br />
            tenant: {user.tenantId}
            <div style={{ marginTop: 10 }}>
              <button className="btn secondary" style={{ color: "#fff", borderColor: "#3a5170" }} onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        )}
      </aside>
      <main className="main">
        <div className="topbar">
          <h2>{title}</h2>
        </div>
        {children}
      </main>
    </div>
  );
}
