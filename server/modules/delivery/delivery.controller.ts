import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

export const getDeliveryZones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
    });
    res.json({ success: true, data: zones });
  } catch (error) {
    next(error);
  }
};

export const getDeliverySlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slots = await prisma.deliverySlotConfig.findMany({
      where: { isActive: true },
    });
    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
};

export const getManifest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query;
    const manifestDate = date ? new Date(String(date)) : new Date();
    
    const orders = await prisma.order.findMany({
      where: {
        deliveryDate: {
          gte: new Date(manifestDate.setHours(0, 0, 0, 0)),
          lt: new Date(manifestDate.setHours(23, 59, 59, 999)),
        },
        status: { in: ["READY", "OUT_FOR_DELIVERY", "DELIVERED"] },
      },
      include: {
        driver: true,
        customer: true,
      },
      orderBy: { deliverySlot: "asc" },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const dispatchOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driverId } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        driverId,
        status: "OUT_FOR_DELIVERY",
      },
    });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
