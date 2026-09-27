// lib/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// In production this MUST come from a secret manager / env var and be
// rotated. Hardcoded only because this is an offline prototype.
const JWT_SECRET = process.env.JWT_SECRET || "sahakar-setu-dev-secret-change-me";
const TOKEN_TTL = "8h";

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

export function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

export function signToken(payload) {
  // payload MUST include: userId, tenantId, role
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// Pulls the bearer token out of an API request and returns the decoded
// { userId, tenantId, role } claims, or null if missing/invalid.
//
// This is the ONE place authorization is decided. Every API route calls this
// server-side and filters data by the returned tenantId/role instead of
// trusting anything the client sends in the request body/query - this is the
// "never trust frontend authorization alone" principle called out repeatedly
// in the architecture doc (multi-tenancy, Q26).
export function requireAuth(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  return verifyToken(token);
}

export function requireRole(claims, allowedRoles) {
  if (!claims) return false;
  return allowedRoles.includes(claims.role);
}
