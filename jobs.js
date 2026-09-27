import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../lib/Layout";
import { apiFetch, getToken, getUser } from "../lib/apiClient";

export default function Jobs() {
  const router = useRouter();
  const [trainees, setTrainees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const isStaff = user && ["admin", "faculty", "ncct_admin"].includes(user.role);

  useEffect(() => {
    if (!getToken()) return router.replace("/login");
    const u = getUser();
    setUser(u);
    const staff = u && ["admin", "faculty", "ncct_admin"].includes(u.role);
    if (staff) {
      apiFetch("/api/trainees").then((d) => setTrainees(d.trainees)).catch(() => {});
    } else {
      runMatch();
    }
  }, []);

  async function runMatch(id) {
    setError("");
    try {
      const qs = id ? `?userId=${id}` : "";
      const data = await apiFetch(`/api/jobs/match${qs}`);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout title="AI Career & Job Matching">
      {error && <div className="error-text">{error}</div>}

      {isStaff && (
        <div className="card" style={{ marginBottom: 16 }}>
          <label>Preview matches for trainee</label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              runMatch(e.target.value);
            }}
          >
            <option value="">Select a trainee...</option>
            {trainees.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <b>How this works</b>
        <p className="muted">
          Score = weighted overlap between the trainee's Digital Skill
          Passport and each job's required skill vector. This is a
          transparent, explainable algorithm rather than a black-box ML
          model — see <code>lib/matching.js</code>. It's the safe, honest
          answer to "what algorithm are you using" (section 10 / Q9).
        </p>
      </div>

      {result && result.matches.map((m) => (
        <div className="card" key={m.jobId} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>{m.title}</b>
              <div className="muted">{m.employer} · {m.location}</div>
            </div>
            <div className="stat" style={{ fontSize: 20 }}>
              {(m.score * 100).toFixed(0)}%
            </div>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>{m.recommendation}</p>
          {m.gaps.length > 0 && (
            <div>
              {m.gaps.map((g) => (
                <span key={g.skill} className="gap-tag">{g.skill} (gap {(g.gap * 100).toFixed(0)}%)</span>
              ))}
            </div>
          )}
        </div>
      ))}
      {result && result.matches.length === 0 && <p className="muted">No jobs available yet.</p>}
    </Layout>
  );
}
