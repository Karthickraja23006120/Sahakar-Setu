// loadtest/run.js
//
// Scalability proof-of-concept for the SIH jury (section 28 / Q27:
// "How? / Actual capacity would need to be validated through load testing").
//
// This script:
//   1. Logs in as a demo trainee to obtain a real JWT.
//   2. Fires concurrent load at the three endpoints a real deployment would
//      hit hardest: the AI job-matching endpoint (CPU-bound), the analytics
//      summary endpoint (aggregation-bound), and the trainee list endpoint
//      (typical read).
//   3. Repeats the run at increasing concurrency (10 -> 50 -> 100 connections)
//      against a SINGLE app instance, to find that instance's ceiling.
//   4. Prints a results table plus the horizontal-scaling argument: because
//      every request is authenticated by a stateless JWT and every handler
//      loads data scoped by tenantId (no server-side session, no sticky
//      state), additional instances behind a load balancer serve requests
//      independently. Doubling instances behind the gateway roughly doubles
//      throughput until the shared datastore becomes the bottleneck - which
//      is exactly why the architecture separates OLTP (Postgres + replicas)
//      from OLAP (warehouse) in section 24.
//
// Run with the app already started (`npm run start` in another terminal),
// then: npm run loadtest

const autocannon = require("autocannon");

const BASE_URL = process.env.LOADTEST_URL || "http://localhost:3000";
const CONCURRENCY_LEVELS = [10, 50, 100];
const DURATION_SEC = 8;

async function login() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "trainee1@sahakarsetu.in",
      password: "password123",
    }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = await res.json();
  return data.token;
}

function runLoad(url, token, connections) {
  return new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url,
        connections,
        duration: DURATION_SEC,
        headers: { Authorization: `Bearer ${token}` },
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    autocannon.track(instance, { renderProgressBar: false });
  });
}

function summarize(label, connections, result) {
  return {
    endpoint: label,
    connections,
    "req/sec (avg)": result.requests.average,
    "req/sec (p99 lowest)": result.requests.p99 !== undefined ? result.requests.p99 : "-",
    "latency ms (avg)": result.latency.average,
    "latency ms (p99)": result.latency.p99,
    "2xx": result.non2xx !== undefined ? result.requests.total - result.non2xx : result.requests.total,
    errors: result.errors,
    timeouts: result.timeouts,
  };
}

async function main() {
  console.log(`\nSahakar Setu - single-instance load test against ${BASE_URL}`);
  console.log("Make sure the app is running (npm run start) before this script.\n");

  const token = await login();
  console.log("Authenticated as trainee1@sahakarsetu.in\n");

  const endpoints = [
    { label: "GET /api/jobs/match (AI matching, CPU-bound)", path: "/api/jobs/match" },
    { label: "GET /api/analytics/summary (aggregation)", path: "/api/analytics/summary" },
    { label: "GET /api/trainees (typical tenant-scoped read)", path: "/api/trainees" },
  ];

  const rows = [];

  for (const ep of endpoints) {
    for (const conns of CONCURRENCY_LEVELS) {
      process.stdout.write(`\nRunning: ${ep.label} @ ${conns} connections, ${DURATION_SEC}s...\n`);
      const result = await runLoad(`${BASE_URL}${ep.path}`, token, conns);
      rows.push(summarize(ep.label, conns, result));
    }
  }

  console.log("\n\n=== RESULTS ===\n");
  console.table(rows);

  console.log(`
Reading these numbers:
- "req/sec (avg)" is throughput this SINGLE Next.js instance sustained.
- Latency should stay roughly flat as connections rise from 10 -> 50; a sharp
  jump signals the instance (or the JSON-file datastore used in this
  prototype) is saturating - the exact ceiling a jury asking "how does this
  scale" wants to see measured, not assumed.
- Horizontal scaling argument: every request here is authenticated with a
  stateless JWT and filtered by tenantId server-side, with no in-process
  session state. That means N identical instances behind a load balancer
  (see loadtest/docker-compose.scaling.yml) can each serve any request
  independently - throughput scales close to linearly with instance count
  until the shared datastore (Postgres in production) becomes the limiting
  factor, which is why the architecture also separates read replicas and a
  warehouse for analytics (section 24 of the pitch).
`);
}

main().catch((e) => {
  console.error("Load test failed:", e.message);
  process.exit(1);
});
