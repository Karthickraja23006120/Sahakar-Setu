import { useState } from "react";
import { useRouter } from "next/router";
import { apiFetch, setSession } from "../lib/apiClient";

const DEMO_ACCOUNTS = [
  { label: "NCCT Admin (cross-institute)", email: "ncct.admin@sahakarsetu.in" },
  { label: "Institute Admin (Institute A)", email: "admin.a@sahakarsetu.in" },
  { label: "Faculty (Institute A)", email: "faculty.a@sahakarsetu.in" },
  { label: "Trainee (Institute A)", email: "trainee1@sahakarsetu.in" },
];
const DEMO_PASSWORD = "password123";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Sahakar Setu</h1>
        <p className="tag">Sign in to the NCCT training ecosystem</p>
        {error && <div className="error-text">{error}</div>}
        <form onSubmit={submit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@sahakarsetu.in" />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button className="btn" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 18, marginBottom: 6 }}>
          Demo accounts (password: <code>{DEMO_PASSWORD}</code>):
        </p>
        {DEMO_ACCOUNTS.map((acc) => (
          <div
            key={acc.email}
            className="muted"
            style={{ cursor: "pointer", marginBottom: 4 }}
            onClick={() => {
              setEmail(acc.email);
              setPassword(DEMO_PASSWORD);
            }}
          >
            → {acc.label}: <b>{acc.email}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
