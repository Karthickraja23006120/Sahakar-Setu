import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../lib/Layout";
import { apiFetch, getToken, getUser } from "../lib/apiClient";

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", language: "en", offlineCapable: true, durationHrs: 10 });
  const [user, setUser] = useState(null);
  const canManage = user && ["admin", "faculty", "ncct_admin"].includes(user.role);

  function load() {
    apiFetch("/api/courses").then((d) => setCourses(d.courses)).catch((e) => setError(e.message));
  }

  useEffect(() => {
    if (!getToken()) return router.replace("/login");
    setUser(getUser());
    load();
  }, []);

  async function addCourse(e) {
    e.preventDefault();
    try {
      await apiFetch("/api/courses", { method: "POST", body: JSON.stringify(form) });
      setForm({ title: "", language: "en", offlineCapable: true, durationHrs: 10 });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout title="LMS Courses">
      {error && <div className="error-text">{error}</div>}
      <div className="grid cols-2">
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Language</th>
                <th>Offline</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.language}</td>
                  <td>
                    {c.offlineCapable ? (
                      <span className="badge ok">yes</span>
                    ) : (
                      <span className="badge warn">no</span>
                    )}
                  </td>
                  <td>{c.durationHrs}</td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={4} className="muted">No courses yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {canManage && (
          <div className="card">
            <b>Add course</b>
            <form onSubmit={addCourse} style={{ marginTop: 12 }}>
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <label>Language</label>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="mr">Marathi</option>
              </select>
              <label>Duration (hours)</label>
              <input
                type="number"
                value={form.durationHrs}
                onChange={(e) => setForm({ ...form, durationHrs: Number(e.target.value) })}
              />
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  style={{ width: "auto" }}
                  checked={form.offlineCapable}
                  onChange={(e) => setForm({ ...form, offlineCapable: e.target.checked })}
                />
                Offline-capable (cached for low-connectivity learners)
              </label>
              <button className="btn">Add course</button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
