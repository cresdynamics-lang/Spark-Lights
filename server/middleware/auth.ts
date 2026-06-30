import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { Role } from "@prisma/client";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "your-access-secret";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: { code: "NO_TOKEN", message: "No token provided" } });
  }

  let payload: { sub: string; role?: string };
  try {
    payload = jwt.verify(token, JWT_ACCESS_SECRET) as { sub: string; role?: string };
  } catch {
    return res
      .status(401)
      .json({ success: false, error: { code: "INVALID_TOKEN", message: "Invalid or expired token" } });
  }

  try {
    const staff = await prisma.staff.findUnique({
      where: { id: payload.sub },
    });

    if (!staff || !staff.isActive) {
      return res
        .status(401)
        .json({ success: false, error: { code: "INVALID_TOKEN", message: "Invalid or inactive staff" } });
    }

    req.user = staff;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole =
  (...roles: Role[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, error: { code: "FORBIDDEN", message: "Insufficient permissions" } });
    }
    next();
  };
