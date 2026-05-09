import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";
import { startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from "date-fns";

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Total Revenue
    const totalRevenue = await prisma.order.aggregate({
      where: { status: { notIn: ["CANCELLED"] } },
      _sum: { totalKes: true },
    });

    // Revenue this month vs last month for change calculation
    const currentMonthRevenue = await prisma.order.aggregate({
      where: {
        status: { notIn: ["CANCELLED"] },
        createdAt: { gte: currentMonthStart },
      },
      _sum: { totalKes: true },
    });

    const lastMonthRevenue = await prisma.order.aggregate({
      where: {
        status: { notIn: ["CANCELLED"] },
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      _sum: { totalKes: true },
    });

    // Active Orders
    const activeOrders = await prisma.order.count({
      where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"] } },
    });

    // New Customers this month
    const newCustomers = await prisma.customer.count({
      where: { createdAt: { gte: currentMonthStart } },
    });

    // Calculate changes
    const revChange = lastMonthRevenue._sum.totalKes 
      ? ((Number(currentMonthRevenue._sum.totalKes || 0) - Number(lastMonthRevenue._sum.totalKes)) / Number(lastMonthRevenue._sum.totalKes)) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.totalKes || 0,
        revenueChange: revChange.toFixed(1),
        activeOrders,
        newCustomers,
        avgOrderValue: (Number(totalRevenue._sum.totalKes || 0) / (await prisma.order.count() || 1)).toFixed(0),
      },
    });
  } catch (error) {
    next(error);
  }
};
