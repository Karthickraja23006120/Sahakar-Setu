import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../lib/Layout";
import { apiFetch, getToken } from "../lib/apiClient";

export default function Certificates() {
  const router = useRouter();
  const [certs, setCerts] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  function load() {
    apiFetch("/api/certificates").then((d) => setCerts(d.certificates)).catch((e) => setError(e.message));
    apiFetch("/api/trainees").then((d) => setTrainees(d.trainees)).catch(() => {});
    apiFetch("/api/courses").then((d) => setCourses(d.courses)).catch(() => {});
  }

  useEffect(() => {
    if (!getToken()) return router.replace("/login");
    load();
  }, []);

  async function issue(e) {
    e.preventDefault();
    if (!userId || !courseId) return setError("Select trainee and course");
    try {
      await apiFetch("/api/certificates", { method: "POST", body: JSON.stringify({ userId, courseId }) });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setVerifyResult(null);
    try {
      const res = await fetch(`/api/certificates/verify?certId=${verifyId}`);
      setVerifyResult(await res.json());
    } catch (err) {
      setError(err.message);
    }
  }

  const nameFor = (id) => trainees.find((t) => t.id === id)?.name || id;
  const courseFor = (id) => courses.find((c) => c.id === id)?.title || id;

  return (
    <Layout title="Digital Skill Passport — Certificates">
      {error && <div className="error-text">{error}</div>}
      <div className="grid cols-2">
        <div className="card">
          <b>Issue certificate</b>
          <form onSubmit={issue}>
            <label>Trainee</label>
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="">Select...</option>
              {trainees.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <label>Course</label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">Select...</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <button className="btn">Issue with QR</button>
          </form>

          <hr style={{ margin: "18px 0", border: "none", borderTop: "1px solid var(--border)" }} />

          <b>Public verification (what an employer sees)</b>
          <p className="muted">No login required — this hits the backend record, not just the QR payload.</p>
          <form onSubmit={verify}>
            <label>Certificate ID</label>
            <input value={verifyId} onChange={(e) => setVerifyId(e.target.value)} placeholder="e.g. CERT_AB12CD34" />
            <button className="btn secondary">Verify</button>
          </form>
          {verifyResult && (
            <div className="card" style={{ marginTop: 10, background: verifyResult.valid ? "#e3f7e9" : "#fbe6e4" }}>
              {verifyResult.valid ? (
                <>
                  <b>✓ Valid certificate</b>
                  <p className="muted">{verifyResult.traineeName} — {verifyResult.course}</p>
                  <p className="muted">Issued {new Date(verifyResult.issuedAt).toLocaleDateString()}</p>
                </>
              ) : (
                <b>✗ {verifyResult.reason || "Not valid"}</b>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <b>Issued certificates</b>
          {certs.map((c) => (
            <div key={c.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                {c.qrDataUrl && <img src={c.qrDataUrl} width={80} height={80} alt="QR" />}
                <div>
                  <b>{nameFor(c.userId)}</b>
                  <div className="muted">{courseFor(c.courseId)}</div>
                  <div className="muted">ID: {c.certId}</div>
                </div>
              </div>
            </div>
          ))}
          {certs.length === 0 && <p className="muted">No certificates issued yet.</p>}
        </div>
      </div>
    </Layout>
  );
}
