import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subs = await prisma.subscription.findMany({
      include: { customer: true, product: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: subs });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await prisma.subscription.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: sub });
  } catch (error) {
    next(error);
  }
};
