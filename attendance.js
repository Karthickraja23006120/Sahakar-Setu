import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../lib/Layout";
import { apiFetch, getToken } from "../lib/apiClient";

export default function Attendance() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [userId, setUserId] = useState("");
  const [method, setMethod] = useState("qr");
  const [error, setError] = useState("");

  function load() {
    apiFetch("/api/attendance").then((d) => setRecords(d.attendance)).catch((e) => setError(e.message));
    apiFetch("/api/trainees").then((d) => setTrainees(d.trainees)).catch(() => {});
  }

  useEffect(() => {
    if (!getToken()) return router.replace("/login");
    load();
  }, []);

  async function mark(e) {
    e.preventDefault();
    if (!userId) return setError("Select a trainee first");
    try {
      await apiFetch("/api/attendance", { method: "POST", body: JSON.stringify({ userId, method }) });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const nameFor = (id) => trainees.find((t) => t.id === id)?.name || id;

  return (
    <Layout title="Attendance (QR / Face / Edge device)">
      {error && <div className="error-text">{error}</div>}
      <div className="grid cols-2">
        <div className="card">
          <b>Mark attendance</b>
          <p className="muted">
            Simulates an edge-device (Raspberry Pi) event: QR scan, on-device
            face match, or manual override — no biometric image is stored,
            only the resolved trainee ID and the method used.
          </p>
          <form onSubmit={mark}>
            <label>Trainee</label>
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="">Select trainee...</option>
              {trainees.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <label>Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="qr">QR code</option>
              <option value="face">Face ID (on-device match)</option>
              <option value="manual">Manual (fallback)</option>
            </select>
            <button className="btn">Mark present</button>
          </form>
        </div>
        <div className="card">
          <b>Recent records</b>
          <table>
            <thead>
              <tr><th>Trainee</th><th>Method</th><th>Time</th></tr>
            </thead>
            <tbody>
              {records.slice(0, 10).map((r) => (
                <tr key={r.id}>
                  <td>{nameFor(r.userId)}</td>
                  <td><span className="badge ok">{r.method}</span></td>
                  <td>{new Date(r.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {records.length === 0 && <tr><td colSpan={3} className="muted">No records yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
