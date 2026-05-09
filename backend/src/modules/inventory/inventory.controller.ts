import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

export const getFlowerInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.flowerInventory.findMany({
      include: { supplier: true },
      orderBy: { receivedAt: "desc" },
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const createFlowerStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receivedAt, freshnessWindowDays, ...data } = req.body;
    const receivedDate = new Date(receivedAt);
    const discardAt = new Date(receivedDate);
    discardAt.setDate(discardAt.getDate() + (freshnessWindowDays || 7));

    const item = await prisma.flowerInventory.create({
      data: {
        ...data,
        receivedAt: receivedDate,
        freshnessWindowDays: freshnessWindowDays || 7,
        discardAt: discardAt,
      },
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};
export const getInventoryAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lowStock = await prisma.flowerInventory.findMany({
      where: {
        OR: [
          { currentStemsQty: { lte: 20 } }, // Using 20 as default reorder point if not specified
          { freshness: "DISCARD" },
        ],
      },
      include: { supplier: true },
    });
    res.json({ success: true, data: lowStock });
  } catch (error) {
    next(error);
  }
};

export const getInventoryMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movements = await prisma.inventoryMovement.findMany({
      where: { inventoryId: req.params.inventoryId as string },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ success: true, data: movements });
  } catch (error) {
    next(error);
  }
};
