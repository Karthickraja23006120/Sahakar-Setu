import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Layout from "../lib/Layout";
import { apiFetch, getToken } from "../lib/apiClient";

export default function Analytics() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!getToken()) return router.replace("/login");
    apiFetch("/api/analytics/summary").then(setSummary).catch((e) => setError(e.message));
  }, []);

  const chartData =
    summary?.scope === "ncct"
      ? summary.institutes.map((i) => ({
          name: i.tenantId,
          Trainees: i.trainees,
          Certificates: i.certificatesIssued,
        }))
      : summary?.scope === "institute"
      ? [{ name: summary.summary.tenantId, Trainees: summary.summary.trainees, Certificates: summary.summary.certificatesIssued }]
      : [];

  return (
    <Layout title="Analytics — Institutional Performance">
      {error && <div className="error-text">{error}</div>}
      <div className="card">
        <p className="muted">
          This chart is fed by the same read path that, in production, would
          sit behind a read-replica → ETL → data-warehouse → BI pipeline
          (section 24), so heavy analytics queries never compete with
          transactional writes on the primary database.
        </p>
        {mounted && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Trainees" fill="#0f8b8d" />
              <Bar dataKey="Certificates" fill="#e2a53a" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Layout>
  );
}
