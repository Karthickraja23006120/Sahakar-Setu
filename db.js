// lib/db.js
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "db.json");

const DEFAULT_SEED_DATA = {
  tenants: [
    { id: "inst_a", name: "Institute A — Pune", code: "PUN01" },
    { id: "inst_b", name: "Institute B — Nashik", code: "NSK02" },
    { id: "inst_c", name: "Institute C — Nagpur", code: "NGP03" },
  ],
  users: [
    {
      id: "usr_ncct_admin",
      tenantId: "inst_a",
      name: "NCCT Administrator",
      email: "ncct.admin@sahakarsetu.in",
      passwordHash: "$2a$10$L6w8NitpK.s1a6aWG2Wzu.urezX10u.9a/jnqCM04jGshUVPgWwhO",
      role: "ncct_admin",
      skills: {},
      createdAt: "2026-09-07T08:21:36.358Z",
    },
    {
      id: "usr_admin_a",
      tenantId: "inst_a",
      name: "Institute A Admin",
      email: "admin.a@sahakarsetu.in",
      passwordHash: "$2a$10$Z5fV5jgiA8xBnTkelgLGlOotsHQZY31fx9szMRkzHJokkkJJFCFYK",
      role: "admin",
      skills: {},
      createdAt: "2026-09-07T08:21:36.445Z",
    },
    {
      id: "usr_faculty_a",
      tenantId: "inst_a",
      name: "Faculty — Institute A",
      email: "faculty.a@sahakarsetu.in",
      passwordHash: "$2a$10$otZxduu2DLsAY2r1wKS3Te3ztMFmyM4xCujUv4bsXOSmZCZell4r2",
      role: "faculty",
      skills: {},
      createdAt: "2026-09-07T08:21:36.527Z",
    },
    {
      id: "usr_t1",
      tenantId: "inst_a",
      name: "Aarav Sharma",
      email: "trainee1@sahakarsetu.in",
      passwordHash: "$2a$10$.edtYe2L3fGnL59ARsRHSuWJu7TS1YWT..iQIg2Q9tt85sSjC/2RS",
      role: "trainee",
      skills: { python: 0.9, sql: 0.8, statistics: 0.6 },
      createdAt: "2026-09-07T08:21:36.606Z",
    },
    {
      id: "usr_t2",
      tenantId: "inst_a",
      name: "Priya Patil",
      email: "trainee2@sahakarsetu.in",
      passwordHash: "$2a$10$HQKjMUklLAuXHvm13mlE5eT//Lv2HX/d7fNyLivIRi/BL/dm83FuO",
      role: "trainee",
      skills: { excel: 0.9, communication: 0.8 },
      createdAt: "2026-09-07T08:21:36.692Z",
    },
    {
      id: "usr_t3",
      tenantId: "inst_a",
      name: "Rohan Deshmukh",
      email: "trainee3@sahakarsetu.in",
      passwordHash: "$2a$10$0jiw6Tmet1i6HZFPpARGGOfQaZWhA.rF89Rt3pkkvUHYt78IC.50W",
      role: "trainee",
      skills: { welding: 0.8, safety: 0.7 },
      createdAt: "2026-09-07T08:21:36.765Z",
    },
    {
      id: "usr_t4",
      tenantId: "inst_b",
      name: "Sneha Kulkarni",
      email: "trainee4@sahakarsetu.in",
      passwordHash: "$2a$10$dSD3QHHbnJUbcMruSduJou57q7f6E.uTq6EPdMhlrwWb7k.QDcEhu",
      role: "trainee",
      skills: { tally: 0.9, accounting: 0.8 },
      createdAt: "2026-09-07T08:21:36.855Z",
    },
    {
      id: "usr_t5",
      tenantId: "inst_b",
      name: "Vikram Singh",
      email: "trainee5@sahakarsetu.in",
      passwordHash: "$2a$10$muzaVoazw/5FGITLZdmxl.OP0rdFqntOsorMoqzTaTbtFxdy1IKCa",
      role: "trainee",
      skills: { electrical: 0.85, safety: 0.6 },
      createdAt: "2026-09-07T08:21:36.946Z",
    },
  ],
  courses: [
    {
      id: "crs_1",
      tenantId: "inst_a",
      title: "Data Analytics Foundations",
      language: "en",
      offlineCapable: true,
      durationHrs: 40,
      skillTags: ["python", "sql", "statistics"],
      createdAt: "2026-09-07T08:21:36.946Z",
    },
    {
      id: "crs_2",
      tenantId: "inst_a",
      title: "Office Productivity & Excel",
      language: "hi",
      offlineCapable: true,
      durationHrs: 20,
      skillTags: ["excel", "communication"],
      createdAt: "2026-09-07T08:21:36.946Z",
    },
    {
      id: "crs_3",
      tenantId: "inst_b",
      title: "Cooperative Accounting with Tally",
      language: "mr",
      offlineCapable: true,
      durationHrs: 30,
      skillTags: ["tally", "accounting"],
      createdAt: "2026-09-07T08:21:36.946Z",
    },
  ],
  enrollments: [],
  attendance: [],
  certificates: [],
  jobs: [
    {
      id: "job_1",
      title: "Junior Data Analyst",
      employer: "AgroCoop Analytics Pvt Ltd",
      location: "Pune, MH",
      requiredSkills: { python: 0.9, sql: 0.8, statistics: 0.7, excel: 0.6, powerbi: 0.8 },
    },
    {
      id: "job_2",
      title: "Office Assistant",
      employer: "District Cooperative Bank",
      location: "Nashik, MH",
      requiredSkills: { excel: 0.7, communication: 0.7, tally: 0.5 },
    },
    {
      id: "job_3",
      title: "Accounts Executive",
      employer: "Rural Credit Cooperative",
      location: "Nashik, MH",
      requiredSkills: { tally: 0.9, accounting: 0.85, communication: 0.5 },
    },
    {
      id: "job_4",
      title: "Electrical Maintenance Technician",
      employer: "Cooperative Sugar Mill",
      location: "Nagpur, MH",
      requiredSkills: { electrical: 0.8, safety: 0.8 },
    },
  ],
};

let cache = null;

function load() {
  if (!cache) {
    try {
      if (fs.existsSync(FILE)) {
        const raw = fs.readFileSync(FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.users.length > 0) {
          cache = parsed;
        }
      }
    } catch (e) {
      // Fall back to memory seed
    }
    if (!cache) {
      cache = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
    }
  }
  return cache;
}

function persist() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(cache, null, 2));
  } catch (e) {
    // Vercel serverless environment is read-only; memory cache handles state safely
  }
}

export function resetDb(seedData) {
  cache = seedData || JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
  persist();
}

export function getCollection(name) {
  const db = load();
  if (!db[name]) db[name] = [];
  return db[name];
}

export function getAll(name, filterFn) {
  const rows = getCollection(name);
  return filterFn ? rows.filter(filterFn) : rows.slice();
}

export function getById(name, id) {
  return getCollection(name).find((r) => r.id === id) || null;
}

export function insert(name, row) {
  const rows = getCollection(name);
  rows.push(row);
  persist();
  return row;
}

export function update(name, id, patch) {
  const rows = getCollection(name);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], ...patch };
  persist();
  return rows[idx];
}

export function nextId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now()
    .toString(36)
    .slice(-4)}`;
}
