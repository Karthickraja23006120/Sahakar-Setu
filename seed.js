// scripts/seed.js
// Run with: npm run seed
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

function id(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function hash(pw) {
  return bcrypt.hashSync(pw, 10);
}

const PASSWORD = "password123";

const tenants = [
  { id: "inst_a", name: "Institute A — Pune", code: "PUN01" },
  { id: "inst_b", name: "Institute B — Nashik", code: "NSK02" },
  { id: "inst_c", name: "Institute C — Nagpur", code: "NGP03" },
];

const users = [
  {
    id: id("usr"),
    tenantId: "inst_a", // NCCT admin still needs a home tenant, but sees all via role check
    name: "NCCT Administrator",
    email: "ncct.admin@sahakarsetu.in",
    passwordHash: hash(PASSWORD),
    role: "ncct_admin",
    skills: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: id("usr"),
    tenantId: "inst_a",
    name: "Institute A Admin",
    email: "admin.a@sahakarsetu.in",
    passwordHash: hash(PASSWORD),
    role: "admin",
    skills: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: id("usr"),
    tenantId: "inst_a",
    name: "Faculty — Institute A",
    email: "faculty.a@sahakarsetu.in",
    passwordHash: hash(PASSWORD),
    role: "faculty",
    skills: {},
    createdAt: new Date().toISOString(),
  },
];

const traineeSeed = [
  { name: "Aarav Sharma", email: "trainee1@sahakarsetu.in", tenantId: "inst_a", skills: { python: 0.9, sql: 0.8, statistics: 0.6 } },
  { name: "Priya Patil", email: "trainee2@sahakarsetu.in", tenantId: "inst_a", skills: { excel: 0.9, communication: 0.8 } },
  { name: "Rohan Deshmukh", email: "trainee3@sahakarsetu.in", tenantId: "inst_a", skills: { welding: 0.8, safety: 0.7 } },
  { name: "Sneha Kulkarni", email: "trainee4@sahakarsetu.in", tenantId: "inst_b", skills: { tally: 0.9, accounting: 0.8 } },
  { name: "Vikram Singh", email: "trainee5@sahakarsetu.in", tenantId: "inst_b", skills: { electrical: 0.85, safety: 0.6 } },
];

traineeSeed.forEach((t) => {
  users.push({
    id: id("usr"),
    tenantId: t.tenantId,
    name: t.name,
    email: t.email,
    passwordHash: hash(PASSWORD),
    role: "trainee",
    skills: t.skills,
    createdAt: new Date().toISOString(),
  });
});

const courses = [
  { id: id("crs"), tenantId: "inst_a", title: "Data Analytics Foundations", language: "en", offlineCapable: true, durationHrs: 40, skillTags: ["python", "sql", "statistics"], createdAt: new Date().toISOString() },
  { id: id("crs"), tenantId: "inst_a", title: "Office Productivity & Excel", language: "hi", offlineCapable: true, durationHrs: 20, skillTags: ["excel", "communication"], createdAt: new Date().toISOString() },
  { id: id("crs"), tenantId: "inst_b", title: "Cooperative Accounting with Tally", language: "mr", offlineCapable: true, durationHrs: 30, skillTags: ["tally", "accounting"], createdAt: new Date().toISOString() },
];

const jobs = [
  {
    id: id("job"),
    title: "Junior Data Analyst",
    employer: "AgroCoop Analytics Pvt Ltd",
    location: "Pune, MH",
    requiredSkills: { python: 0.9, sql: 0.8, statistics: 0.7, excel: 0.6, powerbi: 0.8 },
  },
  {
    id: id("job"),
    title: "Office Assistant",
    employer: "District Cooperative Bank",
    location: "Nashik, MH",
    requiredSkills: { excel: 0.7, communication: 0.7, tally: 0.5 },
  },
  {
    id: id("job"),
    title: "Accounts Executive",
    employer: "Rural Credit Cooperative",
    location: "Nashik, MH",
    requiredSkills: { tally: 0.9, accounting: 0.85, communication: 0.5 },
  },
  {
    id: id("job"),
    title: "Electrical Maintenance Technician",
    employer: "Cooperative Sugar Mill",
    location: "Nagpur, MH",
    requiredSkills: { electrical: 0.8, safety: 0.8 },
  },
];

const db = {
  tenants,
  users,
  courses,
  enrollments: [],
  attendance: [],
  certificates: [],
  jobs,
};

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "db.json"), JSON.stringify(db, null, 2));

console.log("Seeded", dataDir, "/db.json");
console.log("Demo login password for all accounts:", PASSWORD);
console.log("Accounts:");
users.forEach((u) => console.log(` - ${u.role.padEnd(10)} ${u.email} (tenant: ${u.tenantId})`));
