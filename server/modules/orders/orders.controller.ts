import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) {
      if (typeof status === 'string' && status.includes(',')) {
        where.status = { in: status.split(',') };
      } else {
        where.status = status;
      }
    }
    if (search) where.OR = [
      { orderNumber: { contains: String(search), mode: "insensitive" } },
      { recipientName: { contains: String(search), mode: "insensitive" } },
    ];

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true, variant: true } },
          customer: true,
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, addons, ...data } = req.body;

    // Calculate totals (simplified for now)
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUniqueOrThrow({
        where: { id: item.variantId },
      });
      const price = Number(variant.priceKes);
      const total = price * item.quantity;
      subtotal += total;

      orderItemsData.push({
        productId: variant.productId,
        variantId: variant.id,
        quantity: item.quantity,
        unitPriceKes: price,
        totalPriceKes: total,
        colourChoice: item.colourChoice,
      });
    }

    const orderNumber = `LF-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        ...data,
        orderNumber,
        deliveryDate: new Date(data.deliveryDate),
        subtotalKes: subtotal,
        totalKes: subtotal, // Assuming no delivery fee/discount for now
        items: {
          create: orderItemsData,
        },
      },
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
