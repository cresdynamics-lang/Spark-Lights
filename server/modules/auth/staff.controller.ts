import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

export const getStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const staff = await prisma.staff.update({
      where: { id: id as string },
      data: req.body,
    });
    res.json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};
