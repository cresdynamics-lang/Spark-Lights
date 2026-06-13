import { z } from "zod";
import { DeliverySlot, PaymentMethod, OrderSource } from "@prisma/client";

export const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string().optional(),
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
    source: z.nativeEnum(OrderSource).optional(),
    recipientName: z.string(),
    recipientPhone: z.string(),
    deliveryAddress: z.string(),
    deliveryArea: z.string(),
    deliveryZoneId: z.string().optional(),
    deliveryDate: z.string(), // ISO date
    deliverySlot: z.nativeEnum(DeliverySlot),
    messageCard: z.string().optional(),
    items: z.array(z.object({
      variantId: z.string(),
      quantity: z.number().min(1),
      colourChoice: z.string().optional(),
    })),
    addons: z.array(z.object({
      addonId: z.string(),
      quantity: z.number().min(1),
    })).optional(),
    paymentMethod: z.nativeEnum(PaymentMethod),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.string(),
    note: z.string().optional(),
  }),
});
