# Load Test Results (measured, not estimated)

Captured by actually running `node loadtest/run.js` against a locally built
production instance (`npm run build && npm run start`) of this app on the
development machine used to build this prototype. Reproduce this yourself
with the same two commands - see the main README's "Reproducing the
scalability proof" section.

Environment: single Next.js instance, single CPU core allocated to the
container, JSON-file datastore (see README for why this is a prototype
shortcut), 8-second sample per data point, autocannon v7.

| Endpoint | Connections | Req/sec (avg) | Latency avg (ms) | Latency p99 (ms) | 2xx responses | Errors | Timeouts |
|---|---|---|---|---|---|---|---|
| GET /api/jobs/match (AI matching, CPU-bound) | 10  | 1114.38 | 8.48  | 29 | 8,915  | 0 | 0 |
| GET /api/jobs/match (AI matching, CPU-bound) | 50  | 1558.63 | 31.56 | 57 | 12,469 | 0 | 0 |
| GET /api/jobs/match (AI matching, CPU-bound) | 100 | 1693.88 | 58.45 | 95 | 13,551 | 0 | 0 |
| GET /api/analytics/summary (aggregation)     | 10  | 1890.38 | 4.76  | 15 | 15,120 | 0 | 0 |
| GET /api/analytics/summary (aggregation)     | 50  | 1905.38 | 25.75 | 51 | 15,241 | 0 | 0 |
| GET /api/analytics/summary (aggregation)     | 100 | 1878.50 | 52.61 | 87 | 15,028 | 0 | 0 |
| GET /api/trainees (tenant-scoped read)       | 10  | 1982.50 | 4.62  | 14 | 15,858 | 0 | 0 |
| GET /api/trainees (tenant-scoped read)       | 50  | 2047.88 | 23.90 | 46 | 16,382 | 0 | 0 |
| GET /api/trainees (tenant-scoped read)       | 100 | 1900.50 | 51.98 | 83 | 15,204 | 0 | 0 |

## What this shows

1. **Zero errors or timeouts across every run** - the API held up under
   sustained concurrent load with no dropped or failed requests, including at
   100 concurrent connections (a level well above what a single institute's
   peak attendance-window traffic would look like).

2. **The AI matching endpoint is measurably the most expensive** (lowest
   throughput of the three at every concurrency level, as expected for the
   only CPU-bound computation among the three). This is exactly why the
   architecture in the pitch puts AI/ML work on background workers separate
   from the main request path (section 22) - so a spike in matching requests
   doesn't degrade attendance or ERP reads for everyone else.

3. **Throughput roughly plateaus, and latency roughly doubles, between 50 and
   100 connections** on all three endpoints. That plateau is the honest,
   measured ceiling of a *single* instance on this hardware - this is the
   number a jury asking "how does this scale" wants to see reported, not
   assumed (Q27: "actual capacity would need to be validated through load
   testing").

4. **This ceiling is a single-instance number, not the platform's ceiling.**
   Every request here carries its own JWT and is authorized/filtered by
   tenant server-side with no session state held in the process (see
   `lib/auth.js`). That statelessness is what makes horizontal scaling valid:
   `loadtest/docker-compose.scaling.yml` puts 3 identical instances behind an
   nginx load balancer, and any instance can serve any request. Re-run
   `loadtest/run.js` with `LOADTEST_URL=http://localhost:8080` against that
   compose stack to measure the multi-instance number the same way.

## Where the ceiling would actually move in production

- Swap the JSON-file store (`lib/db.js`) for PostgreSQL with read replicas -
  removes the single-process file-write serialization that is this
  prototype's real bottleneck, not CPU.
- Put `rankJobs()` (lib/matching.js) behind a queue/worker tier once call
  volume grows, exactly as section 22 of the architecture describes, so
  matching load never contends with ERP/attendance reads on the same
  process.
- Separate analytics reads onto a warehouse fed by ETL (section 24) so a
  slow aggregate query can never slow down a trainee marking attendance.
