import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, search = "", isVip } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      OR: [
        { name: { contains: String(search), mode: "insensitive" } },
        { email: { contains: String(search), mode: "insensitive" } },
        { phone: { contains: String(search), mode: "insensitive" } },
      ],
    };

    if (isVip !== undefined) {
      where.isVip = isVip === "true";
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      success: true,
      data: customers,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id as string },
      include: {
        orders: { take: 5, orderBy: { createdAt: "desc" } },
        occasions: true,
        addresses: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ success: false, error: { message: "Customer not found" } });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};
