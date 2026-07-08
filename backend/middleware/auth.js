import jwt from "jsonwebtoken";
import { isAdminEmail } from "../utils/admin.js";

export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}

export function adminOnly(req, res, next) {
  if (!isAdminEmail(req.user?.email)) {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
}