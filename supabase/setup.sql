-- =============================================================================
-- SPARK LIGHTS 254 — COMPLETE SUPABASE SETUP (single file — run once)
-- =============================================================================
--
-- HOW TO RUN
--   1. Open Supabase Dashboard → SQL Editor → New query
--   2. Paste this ENTIRE file and click Run
--
-- FRESH INSTALL (empty database)
--   Uncomment PART 1 (schema block) below, then run the whole file.
--
-- EXISTING DATABASE (tables already created — run this now)
--   Leave PART 1 commented out. Run PART 1.5 → 4 only.
--   Then run supabase/blogs.sql for blog CRUD table + seed.
--
-- AFTER RUNNING
--   RLS is disabled on every table (Prisma handles auth, not Supabase RLS).
--   BLOGS: also run supabase/blogs.sql for BlogPost table + admin CRUD.
--   Admin login: mary@sparklights.co.ke / Mary@Admin254
--   Manager:     sarah@sparklights.co.ke / manager123
--   Staff:       john@sparklights.co.ke / florist123
--
-- Project: xvllxzcjjleronqneftg.supabase.co
-- =============================================================================


-- =============================================================================
-- PART 0 — RESET (optional — uncomment only for clean reinstall)
-- =============================================================================
/*
DROP TABLE IF EXISTS "AuditLog" CASCADE;
DROP TABLE IF EXISTS "StoreSetting" CASCADE;
DROP TABLE IF EXISTS "WhatsappLog" CASCADE;
DROP TABLE IF EXISTS "NotificationLog" CASCADE;
DROP TABLE IF EXISTS "Subscription" CASCADE;
DROP TABLE IF EXISTS "LoyaltyTransaction" CASCADE;
DROP TABLE IF EXISTS "Coupon" CASCADE;
DROP TABLE IF EXISTS "BlockoutDate" CASCADE;
DROP TABLE IF EXISTS "DeliverySlotConfig" CASCADE;
DROP TABLE IF EXISTS "DeliveryZone" CASCADE;
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "OrderStatusHistory" CASCADE;
DROP TABLE IF EXISTS "OrderAddon" CASCADE;
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "InventoryMovement" CASCADE;
DROP TABLE IF EXISTS "FlowerInventory" CASCADE;
DROP TABLE IF EXISTS "Supplier" CASCADE;
DROP TABLE IF EXISTS "ProductAddon" CASCADE;
DROP TABLE IF EXISTS "ProductVariant" CASCADE;
DROP TABLE IF EXISTS "ProductImage" CASCADE;
DROP TABLE IF EXISTS "ProductTag" CASCADE;
DROP TABLE IF EXISTS "ProductCategory" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "FlowerTag" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Occasion" CASCADE;
DROP TABLE IF EXISTS "Address" CASCADE;
DROP TABLE IF EXISTS "Customer" CASCADE;
DROP TABLE IF EXISTS "RefreshToken" CASCADE;
DROP TABLE IF EXISTS "Staff" CASCADE;
DROP TYPE IF EXISTS "OrderSource" CASCADE;
DROP TYPE IF EXISTS "NotificationChannel" CASCADE;
DROP TYPE IF EXISTS "CouponType" CASCADE;
DROP TYPE IF EXISTS "SubscriptionFrequency" CASCADE;
DROP TYPE IF EXISTS "SubscriptionStatus" CASCADE;
DROP TYPE IF EXISTS "InventoryMovementType" CASCADE;
DROP TYPE IF EXISTS "FlowerFreshness" CASCADE;
DROP TYPE IF EXISTS "DeliverySlot" CASCADE;
DROP TYPE IF EXISTS "PaymentMethod" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;
*/


-- =============================================================================
-- PART 1 — SCHEMA (tables, enums, indexes, foreign keys)
-- COMMENTED OUT — database already exists. Uncomment for fresh install only.
-- =============================================================================
/*
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'MANAGER', 'FLORIST', 'DRIVER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MPESA', 'CARD', 'CASH_ON_DELIVERY');

-- CreateEnum
CREATE TYPE "DeliverySlot" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'SPECIFIC_TIME');

-- CreateEnum
CREATE TYPE "FlowerFreshness" AS ENUM ('FRESH', 'USE_TODAY', 'DISCARD');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('RECEIVED', 'USED', 'DISCARDED', 'ADJUSTED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SubscriptionFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_DELIVERY');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'PUSH');

-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('WEBSITE', 'WHATSAPP', 'PHONE', 'WAL_IN');

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "avatarUrl" TEXT,
    "vehicleInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "newsletterOptIn" BOOLEAN NOT NULL DEFAULT false,
    "preferredPayment" "PaymentMethod",
    "notes" TEXT,
    "flowerPreferences" TEXT,
    "totalSpent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "orderCount" INTEGER NOT NULL DEFAULT 0,
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "label" TEXT,
    "recipientName" TEXT,
    "recipientPhone" TEXT,
    "street" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "zoneId" TEXT,
    "instructions" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occasion" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "recipientName" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "yearMatters" BOOLEAN NOT NULL DEFAULT false,
    "reminderDays" INTEGER NOT NULL DEFAULT 3,
    "lastRemindedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Occasion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowerTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "FlowerTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "careInstructions" TEXT,
    "badgeLabel" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "ProductTag" (
    "productId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("productId","tagId")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "priceKes" DECIMAL(10,2) NOT NULL,
    "salePriceKes" DECIMAL(10,2),
    "saleStartsAt" TIMESTAMP(3),
    "saleEndsAt" TIMESTAMP(3),
    "stockQty" INTEGER NOT NULL DEFAULT 0,
    "lowStockAlert" INTEGER NOT NULL DEFAULT 5,
    "allowBackorder" BOOLEAN NOT NULL DEFAULT false,
    "stemsUsed" INTEGER NOT NULL DEFAULT 1,
    "flowerTypeId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAddon" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceKes" DECIMAL(10,2) NOT NULL,
    "stockQty" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowerInventory" (
    "id" TEXT NOT NULL,
    "flowerName" TEXT NOT NULL,
    "flowerType" TEXT NOT NULL,
    "colour" TEXT,
    "supplierId" TEXT,
    "currentStemsQty" INTEGER NOT NULL DEFAULT 0,
    "costPerStemKes" DECIMAL(8,2) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "freshnessWindowDays" INTEGER NOT NULL DEFAULT 7,
    "freshness" "FlowerFreshness" NOT NULL DEFAULT 'FRESH',
    "discardAt" TIMESTAMP(3) NOT NULL,
    "reorderPoint" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlowerInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "type" "InventoryMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" TEXT,
    "reason" TEXT,
    "staffId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT,
    "guestName" TEXT,
    "guestPhone" TEXT,
    "guestEmail" TEXT,
    "source" "OrderSource" NOT NULL DEFAULT 'WEBSITE',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" "PaymentMethod",
    "recipientName" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "deliveryArea" TEXT NOT NULL,
    "deliveryZoneId" TEXT,
    "deliveryInstructions" TEXT,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "deliverySlot" "DeliverySlot" NOT NULL,
    "deliveryTime" TEXT,
    "subtotalKes" DECIMAL(10,2) NOT NULL,
    "deliveryFeeKes" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discountKes" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalKes" DECIMAL(10,2) NOT NULL,
    "couponCode" TEXT,
    "couponId" TEXT,
    "messageCard" TEXT,
    "messageCardFont" TEXT,
    "floristId" TEXT,
    "driverId" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "deliveryPhotoUrl" TEXT,
    "recipientSignature" TEXT,
    "failureReason" TEXT,
    "internalNotes" TEXT,
    "staffNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceKes" DECIMAL(10,2) NOT NULL,
    "totalPriceKes" DECIMAL(10,2) NOT NULL,
    "colourChoice" TEXT,
    "customNote" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderAddon" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceKes" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fromStatus" "OrderStatus",
    "toStatus" "OrderStatus" NOT NULL,
    "changedBy" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amountKes" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "mpesaCheckoutRequestId" TEXT,
    "mpesaReceiptNumber" TEXT,
    "mpesaPhoneNumber" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeChargeId" TEXT,
    "refundedAmountKes" DECIMAL(10,2),
    "refundReason" TEXT,
    "refundedAt" TIMESTAMP(3),
    "refundedBy" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deliveryFeeKes" DECIMAL(8,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliverySlotConfig" (
    "id" TEXT NOT NULL,
    "slot" "DeliverySlot" NOT NULL,
    "maxOrders" INTEGER NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dayOfWeek" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliverySlotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockoutDate" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockoutDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "CouponType" NOT NULL,
    "value" DECIMAL(8,2) NOT NULL,
    "maxDiscountKes" DECIMAL(8,2),
    "minOrderKes" DECIMAL(8,2),
    "maxUsesTotal" INTEGER,
    "maxUsesPerCustomer" INTEGER DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "firstOrderOnly" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyTransaction" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "points" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoyaltyTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantLabel" TEXT NOT NULL,
    "priceKes" DECIMAL(10,2) NOT NULL,
    "frequency" "SubscriptionFrequency" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "deliveryAddressId" TEXT,
    "deliverySlot" "DeliverySlot" NOT NULL,
    "preferences" TEXT,
    "nextDeliveryDate" TIMESTAMP(3) NOT NULL,
    "lastDeliveryDate" TIMESTAMP(3),
    "totalDeliveries" INTEGER NOT NULL DEFAULT 0,
    "skipUntil" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "customerId" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "templateKey" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error" TEXT,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsappLog" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "direction" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "waMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "staffId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_phone_key" ON "Staff"("phone");

-- CreateIndex
CREATE INDEX "Staff_role_idx" ON "Staff"("role");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");

-- CreateIndex
CREATE INDEX "Occasion_customerId_idx" ON "Occasion"("customerId");

-- CreateIndex
CREATE INDEX "Occasion_date_idx" ON "Occasion"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FlowerTag_name_key" ON "FlowerTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FlowerTag_slug_key" ON "FlowerTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_isActive_isFeatured_idx" ON "Product"("isActive", "isFeatured");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "FlowerInventory_freshness_idx" ON "FlowerInventory"("freshness");

-- CreateIndex
CREATE INDEX "FlowerInventory_flowerType_idx" ON "FlowerInventory"("flowerType");

-- CreateIndex
CREATE INDEX "InventoryMovement_inventoryId_createdAt_idx" ON "InventoryMovement"("inventoryId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_status_deliveryDate_idx" ON "Order"("status", "deliveryDate");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_driverId_deliveryDate_idx" ON "Order"("driverId", "deliveryDate");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "OrderStatusHistory_orderId_idx" ON "OrderStatusHistory"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_mpesaCheckoutRequestId_key" ON "Payment"("mpesaCheckoutRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_mpesaCheckoutRequestId_idx" ON "Payment"("mpesaCheckoutRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryZone_name_key" ON "DeliveryZone"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BlockoutDate_date_key" ON "BlockoutDate"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "LoyaltyTransaction_customerId_idx" ON "LoyaltyTransaction"("customerId");

-- CreateIndex
CREATE INDEX "Subscription_customerId_status_idx" ON "Subscription"("customerId", "status");

-- CreateIndex
CREATE INDEX "Subscription_nextDeliveryDate_status_idx" ON "Subscription"("nextDeliveryDate", "status");

-- CreateIndex
CREATE INDEX "WhatsappLog_customerId_idx" ON "WhatsappLog"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreSetting_key_key" ON "StoreSetting"("key");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_staffId_createdAt_idx" ON "AuditLog"("staffId", "createdAt");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DeliveryZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occasion" ADD CONSTRAINT "Occasion_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "FlowerTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAddon" ADD CONSTRAINT "ProductAddon_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowerInventory" ADD CONSTRAINT "FlowerInventory_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "FlowerInventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryZoneId_fkey" FOREIGN KEY ("deliveryZoneId") REFERENCES "DeliveryZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_floristId_fkey" FOREIGN KEY ("floristId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddon" ADD CONSTRAINT "OrderAddon_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAddon" ADD CONSTRAINT "OrderAddon_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "ProductAddon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsappLog" ADD CONSTRAINT "WhatsappLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
*/


-- =============================================================================
-- PART 1.5 — DISABLE ROW LEVEL SECURITY
-- Prisma + Express handle auth; RLS must stay off on every table.
-- Safe to re-run. Drops all policies and disables RLS explicitly + via loop.
-- =============================================================================

-- Drop every RLS policy in public schema
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      pol.policyname, pol.schemaname, pol.tablename
    );
  END LOOP;
END $$;

-- Disable RLS on all app tables (explicit list)
ALTER TABLE IF EXISTS "Staff"                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "RefreshToken"           DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Customer"               DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Address"                DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Occasion"               DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Category"               DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "FlowerTag"              DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Product"                DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ProductCategory"        DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ProductTag"             DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ProductImage"           DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ProductVariant"         DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ProductAddon"           DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "FlowerInventory"        DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "InventoryMovement"      DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Supplier"               DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Order"                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "OrderItem"              DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "OrderAddon"             DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "OrderStatusHistory"     DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Payment"                DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "DeliveryZone"           DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "DeliverySlotConfig"     DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "BlockoutDate"           DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Coupon"                 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "LoyaltyTransaction"     DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Subscription"           DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "NotificationLog"        DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "WhatsappLog"            DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "StoreSetting"           DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AuditLog"               DISABLE ROW LEVEL SECURITY;

-- Safety net: disable RLS on any other public tables
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I DISABLE ROW LEVEL SECURITY', 'public', tbl.tablename);
  END LOOP;
END $$;


-- =============================================================================
-- PART 2 — SEED DATA
-- =============================================================================

-- ── Staff (admin login) ─────────────────────────────────────────────────────
-- Owner: mary@sparklights.co.ke / Mary@Admin254

INSERT INTO "Staff" (
  "id", "name", "email", "phone", "passwordHash", "role", "isActive", "createdAt", "updatedAt"
) VALUES
  (
    'staff_owner_spark',
    'Mary Admin',
    'mary@sparklights.co.ke',
    '+254712827840',
    '$2b$10$tYg9e3SRpeN.ulWl/yY25uVc5Q8gGkhvr.2EPwOAT/p2VAxS6eT0.',
    'OWNER',
    true,
    NOW(),
    NOW()
  ),
  (
    'staff_manager_spark',
    'Sarah Manager',
    'sarah@sparklights.co.ke',
    '+254799953563',
    '$2b$10$I6xGeODELA4OSFHZieLpdeqYqjRKby8UaaqVeVAn.7rDHYaAgp27S',
    'MANAGER',
    true,
    NOW(),
    NOW()
  ),
  (
    'staff_florist_spark',
    'John Staff',
    'john@sparklights.co.ke',
    '+254722222222',
    '$2b$10$IIKMMzndI.VSI3K0CwNQZ.HTIsRkFlL5Nhyoz62kiAakU5LDd2Wzm',
    'FLORIST',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT ("email") DO UPDATE SET
  "name" = EXCLUDED."name",
  "phone" = EXCLUDED."phone",
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = EXCLUDED."role",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ── Lighting categories ─────────────────────────────────────────────────────

INSERT INTO "Category" (
  "id", "name", "slug", "description", "imageUrl", "sortOrder", "isActive", "createdAt", "updatedAt"
) VALUES
  ('cat_wall', 'Wall Lights', 'wall-lights', 'Decorative and functional wall-mounted lighting.', '/5500.jpeg', 1, true, NOW(), NOW()),
  ('cat_ceiling', 'Ceiling Lights', 'ceiling-lights', 'Chandeliers, flush mounts, and ceiling fixtures.', '/round1.jpg', 2, true, NOW(), NOW()),
  ('cat_outdoor', 'Outdoor Lights', 'outdoor-lights', 'Weather-resistant exterior and gate lighting.', '/6000.jpeg', 3, true, NOW(), NOW()),
  ('cat_bedroom', 'Bedroom Lights', 'bedroom-lights', 'Soft, ambient lighting for bedrooms.', '/roomm3.png', 4, true, NOW(), NOW()),
  ('cat_dining', 'Dining Lights', 'dining-lights', 'Statement pendants and chandeliers for dining.', '/3500.jpeg', 5, true, NOW(), NOW()),
  ('cat_kitchen', 'Kitchen Lights', 'kitchen-lights', 'Bright panel and ceiling lights for kitchens.', '/3500..jpeg', 6, true, NOW(), NOW()),
  ('cat_parking', 'Parking Lights', 'parking-lights', 'Security and flood lighting for parking areas.', '/7000.jpeg', 7, true, NOW(), NOW()),
  ('cat_events', 'Events Lights', 'events-lights', 'Decorative lighting for events and venues.', '/Screenshot_20251008_142202_1.jpg', 8, true, NOW(), NOW()),
  ('cat_corridor', 'Corridor Lights', 'corridor-lights', 'Hallway and corridor ceiling lights.', '/2500.jpeg', 9, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "imageUrl" = EXCLUDED."imageUrl",
  "sortOrder" = EXCLUDED."sortOrder",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ── Nairobi delivery zones ──────────────────────────────────────────────────

INSERT INTO "DeliveryZone" (
  "id", "name", "deliveryFeeKes", "isActive", "createdAt", "updatedAt"
) VALUES
  ('zone_westlands', 'Westlands', 500, true, NOW(), NOW()),
  ('zone_kilimani', 'Kilimani', 500, true, NOW(), NOW()),
  ('zone_karen', 'Karen', 800, true, NOW(), NOW()),
  ('zone_lavington', 'Lavington', 600, true, NOW(), NOW()),
  ('zone_cbd', 'CBD', 400, true, NOW(), NOW()),
  ('zone_parklands', 'Parklands', 500, true, NOW(), NOW()),
  ('zone_syokimau', 'Syokimau', 1000, true, NOW(), NOW()),
  ('zone_ruaka', 'Ruaka', 900, true, NOW(), NOW())
ON CONFLICT ("name") DO UPDATE SET
  "deliveryFeeKes" = EXCLUDED."deliveryFeeKes",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ── Delivery slot capacity ──────────────────────────────────────────────────

INSERT INTO "DeliverySlotConfig" ("id", "slot", "maxOrders", "isActive", "updatedAt") VALUES
  ('slot_morning', 'MORNING', 20, true, NOW()),
  ('slot_afternoon', 'AFTERNOON', 30, true, NOW()),
  ('slot_evening', 'EVENING', 15, true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "maxOrders" = EXCLUDED."maxOrders",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ── Store settings (JSON) ───────────────────────────────────────────────────

INSERT INTO "StoreSetting" ("id", "key", "value", "updatedAt") VALUES
  ('setting_store_name', 'store_name', '"Spark Lights 254"', NOW()),
  ('setting_currency', 'default_currency', '"KES"', NOW()),
  ('setting_timezone', 'timezone', '"Africa/Nairobi"', NOW()),
  ('setting_free_delivery', 'free_delivery_threshold_kes', '3000', NOW()),
  ('setting_same_day_cutoff', 'same_day_cutoff_hour', '14', NOW()),
  ('setting_whatsapp', 'whatsapp_number', '"+254712827840"', NOW())
ON CONFLICT ("key") DO UPDATE SET
  "value" = EXCLUDED."value",
  "updatedAt" = NOW();

-- ── Sample product (optional — links public image to DB for admin edit demo) ─

INSERT INTO "Product" (
  "id", "name", "slug", "shortDescription", "longDescription",
  "isFeatured", "isActive", "sortOrder", "createdAt", "updatedAt"
) VALUES (
  'prod_3500_demo',
  'Modern Ceiling Light — KES 3,500',
  '3500',
  'Modern ceiling light for homes and offices in Nairobi.',
  'Available at Spark Lights 254, Nyamakima. Same-day delivery across Nairobi. Professional installation on request.',
  true,
  true,
  1,
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "shortDescription" = EXCLUDED."shortDescription",
  "longDescription" = EXCLUDED."longDescription",
  "updatedAt" = NOW();

INSERT INTO "ProductImage" ("id", "productId", "url", "isPrimary", "sortOrder")
VALUES ('img_3500_demo', 'prod_3500_demo', '/3500.jpeg', true, 0)
ON CONFLICT ("id") DO UPDATE SET
  "url" = EXCLUDED."url",
  "isPrimary" = EXCLUDED."isPrimary";

INSERT INTO "ProductVariant" (
  "id", "productId", "label", "priceKes", "stockQty", "lowStockAlert", "stemsUsed", "isActive", "createdAt", "updatedAt"
) VALUES (
  'var_3500_demo', 'prod_3500_demo', 'Default', 3500.00, 25, 5, 1, true, NOW(), NOW()
)
ON CONFLICT ("id") DO UPDATE SET
  "priceKes" = EXCLUDED."priceKes",
  "stockQty" = EXCLUDED."stockQty",
  "updatedAt" = NOW();

INSERT INTO "ProductCategory" ("productId", "categoryId")
VALUES
  ('prod_3500_demo', 'cat_ceiling'),
  ('prod_3500_demo', 'cat_kitchen')
ON CONFLICT ("productId", "categoryId") DO NOTHING;

-- =============================================================================
-- PART 3 — VERIFY (RLS off + data readable)
-- =============================================================================

-- RLS check: should return 0 rows
SELECT
  c.relname AS table_with_rls_still_on
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = true
ORDER BY c.relname;

-- Row counts
SELECT 'Staff' AS table_name, COUNT(*) AS rows FROM "Staff"
UNION ALL SELECT 'Category', COUNT(*) FROM "Category"
UNION ALL SELECT 'DeliveryZone', COUNT(*) FROM "DeliveryZone"
UNION ALL SELECT 'Product', COUNT(*) FROM "Product"
UNION ALL SELECT 'StoreSetting', COUNT(*) FROM "StoreSetting";

SELECT "email", "role", "isActive" FROM "Staff" ORDER BY "role";

SELECT "name", "slug", "sortOrder" FROM "Category" ORDER BY "sortOrder";


-- =============================================================================
-- PART 4 — FINAL RLS LOCKOFF (run after seed; catches dashboard-enabled RLS)
-- =============================================================================

DO $$
DECLARE
  pol RECORD;
  tbl RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      pol.policyname, pol.schemaname, pol.tablename
    );
  END LOOP;

  FOR tbl IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I DISABLE ROW LEVEL SECURITY', 'public', tbl.tablename);
  END LOOP;
END $$;

-- Final RLS check: should return 0 rows
SELECT
  c.relname AS table_with_rls_still_on
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = true
ORDER BY c.relname;
