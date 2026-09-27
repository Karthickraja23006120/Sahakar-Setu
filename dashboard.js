import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../lib/Layout";
import { apiFetch, getToken, getUser } from "../lib/apiClient";

export default function Dashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!getToken()) return router.replace("/login");
    setUser(getUser());
    apiFetch("/api/analytics/summary").then(setSummary).catch((e) => setError(e.message));
  }, []);

  return (
    <Layout title={`Welcome, ${user ? user.name : ""}`}>
      {error && <div className="error-text">{error}</div>}
      {!summary && !error && <p className="muted">Loading...</p>}

      {summary && summary.scope === "institute" && (
        <div className="grid cols-3">
          <StatCard label="Trainees" value={summary.summary.trainees} />
          <StatCard label="Courses" value={summary.summary.courses} />
          <StatCard label="Certificates Issued" value={summary.summary.certificatesIssued} />
          <StatCard label="Attendance Records" value={summary.summary.attendanceRecords} />
          <StatCard label="Attendance Rate" value={`${summary.summary.attendanceRate}%`} />
        </div>
      )}

      {summary && summary.scope === "ncct" && (
        <>
          <p className="muted" style={{ marginBottom: 14 }}>
            Cross-institute view (NCCT admin) - aggregated from every tenant.
          </p>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Institute</th>
                  <th>Trainees</th>
                  <th>Courses</th>
                  <th>Certificates</th>
                  <th>Attendance rate</th>
                </tr>
              </thead>
              <tbody>
                {summary.institutes.map((row) => (
                  <tr key={row.tenantId}>
                    <td>{row.tenantId}</td>
                    <td>{row.trainees}</td>
                    <td>{row.courses}</td>
                    <td>{row.certificatesIssued}</td>
                    <td>{row.attendanceRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <b>What you're looking at</b>
        <p className="muted">
          This dashboard is served by the analytics API (
          <code>/api/analytics/summary</code>), which is tenant-scoped for
          institute roles and cross-tenant for NCCT admins - the same
          role/tenant check enforced on every API route in this app.
        </p>
      </div>
    </Layout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card">
      <div className="stat">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
