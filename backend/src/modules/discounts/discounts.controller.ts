import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await prisma.coupon.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};
