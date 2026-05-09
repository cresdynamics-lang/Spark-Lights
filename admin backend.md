@---
name: flower-ecommerce-admin
description: >
  Complete backend skill for a flower / florist ecommerce admin system.
  Use this skill whenever the user asks to build, scaffold, extend, or debug
  any part of a flower shop admin panel, REST API, database schema, or backend
  logic — including orders, deliveries, products, inventory, customers, analytics,
  discounts, subscriptions, staff roles, notifications, or payment integration
  (M-Pesa / Stripe). Trigger even if the user mentions just one module
  (e.g. "build the orders API", "design the delivery system", "set up M-Pesa",
  "create the product database"). This skill is the single source of truth for
  all architectural decisions, schema, API contracts, and business-logic rules
---

# Flower Ecommerce Admin — Complete Backend Skill

Everything needed to build the backend for a Nairobi-based luxury flower delivery
ecommerce admin system. All modules, all schemas, all API endpoints, all business
logic — in one place.

---

## 1. Stack & Technology Decisions

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js 20 LTS | Wide ecosystem, good async I/O |
| Framework | Express 5 | Minimal, well-understood, easy to extend |
| Database | PostgreSQL 16 | Relational integrity; JSONB for flexible fields |
| ORM | Prisma | Type-safe, auto-migrations, excellent DX |
| Auth | JWT (access 15 min + refresh 7 days) | Stateless, works for mobile driver app |
| File storage | Cloudinary | Product images, delivery photos |
| SMS / WhatsApp | Africa's Talking + WhatsApp Business Cloud API | Kenya-native |
| Payments | M-Pesa Daraja API (STK Push) + Stripe (cards) | Primary KES methods |
| Email | Resend | Transactional emails |
| Cache | Redis | Sessions, rate limiting, delivery slot locks |
| Queue | BullMQ (on Redis) | Async: notifications, reminders, reports |
| Timezone | Africa/Nairobi (EAT UTC+3) | Stored UTC, displayed EAT |
| API style | REST JSON | Simple; consumed by React admin + mobile |
| Validation | Zod | Schema-first, generates TypeScript types |
| Testing | Vitest + Supertest | Unit + integration |

---

## 2. Project Folder Structure

```
flower-admin-api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── index.ts
│   ├── config/
│   │   ├── env.ts            # Zod-validated env vars
│   │   ├── redis.ts
│   │   └── prisma.ts
│   ├── middleware/
│   │   ├── auth.ts           # JWT verify + attach req.user
│   │   ├── roles.ts          # requireRole(...)
│   │   ├── validate.ts       # Zod body/query validation
│   │   └── errorHandler.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── orders/
│   │   ├── delivery/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── customers/
│   │   ├── analytics/
│   │   ├── payments/
│   │   ├── discounts/
│   │   ├── subscriptions/
│   │   ├── notifications/
│   │   └── settings/
│   ├── jobs/
│   │   ├── notificationWorker.ts
│   │   ├── reminderWorker.ts
│   │   └── subscriptionWorker.ts
│   └── utils/
│       ├── mpesa.ts
│       ├── whatsapp.ts
│       ├── cloudinary.ts
│       └── pagination.ts
├── package.json
└── .env.example
```

---

## 3. Environment Variables

```env
NODE_ENV=development
PORT=3001
API_BASE_URL=https://api.yourdomain.co.ke/v1

DATABASE_URL=postgresql://user:pass@localhost:5432/flower_admin
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# M-Pesa Daraja (Safaricom)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=https://api.yourdomain.co.ke/v1/payments/mpesa/callback
MPESA_ENV=sandbox

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Africa's Talking (SMS)
AT_API_KEY=
AT_USERNAME=
AT_SENDER_ID=LUXEFLOWERS

# WhatsApp Business Cloud API
WA_PHONE_NUMBER_ID=
WA_ACCESS_TOKEN=
WA_VERIFY_TOKEN=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=orders@yourdomain.co.ke

# Google Maps (route optimization)
GOOGLE_MAPS_KEY=

# Store defaults
STORE_NAME="Luxe Flowers Kenya"
STORE_TIMEZONE=Africa/Nairobi
DEFAULT_CURRENCY=KES
SAME_DAY_CUTOFF_HOUR=13
FREE_DELIVERY_THRESHOLD=3000
```

---

## 4. Universal API Conventions

**Base URL:** `https://api.yourdomain.co.ke/v1`

**Auth header:** `Authorization: Bearer <access_token>`

**Standard response envelope:**

```jsonc
// Success
{ "success": true, "data": { ... }, "meta": { "page":1,"limit":20,"total":143 } }

// Error
{ "success": false, "error": { "code": "ORDER_NOT_FOUND", "message": "...", "details": [] } }
```

**Pagination (all list endpoints):**
`GET /orders?page=1&limit=20&sortBy=createdAt&sortOrder=desc`

**Timestamps:** ISO 8601 UTC stored; frontend converts to EAT (UTC+3).

**HTTP codes:** 200 OK · 201 Created · 400 Validation · 401 Unauthenticated · 403 Forbidden · 404 Not found · 409 Conflict/stock · 422 Business rule · 500 Server error

---

## 5. Role Permissions Matrix

| Permission | OWNER | MANAGER | FLORIST | DRIVER |
|---|---|---|---|---|
| View all orders | ✅ | ✅ | Own only | Own only |
| Change order status | ✅ | ✅ | Assigned only | Assigned only |
| Process refunds | ✅ | ❌ | ❌ | ❌ |
| Manage products | ✅ | ✅ | ❌ | ❌ |
| View inventory | ✅ | ✅ | ✅ | ❌ |
| View customers | ✅ | ✅ | ❌ | ❌ |
| View financial reports | ✅ | ❌ | ❌ | ❌ |
| Manage staff | ✅ | ❌ | ❌ | ❌ |
| Change store settings | ✅ | ❌ | ❌ | ❌ |
| Upload delivery photo | ❌ | ❌ | ❌ | ✅ |

---

## 6. Key Business Rules

1. **Same-day cutoff** — Orders placed after `settings.sameDayCutoffHour` (default 13:00 EAT) cannot select same-day delivery. Enforce in both frontend and backend.
2. **Inventory auto-deduct** — When order transitions PENDING→CONFIRMED, deduct stem quantities. If stock insufficient, return HTTP 409 `INSUFFICIENT_STOCK`.
3. **Freshness window** — FlowerInventory has `receivedAt + freshnessWindowDays`. Past-window items flagged `DISCARD` and excluded from available stock.
4. **Order immutability** — Once status is `OUT_FOR_DELIVERY` or later, items cannot be edited. Only status transitions and notes allowed.
5. **Refund timing rules** — Cancellation >4h before delivery = full refund. <4h = 50% refund. After dispatch = no refund (OWNER override only).
6. **Slot locking** — Delivery time slots have `maxOrders` capacity. Lock in Redis for 10 min during checkout to prevent double-booking.
7. **Free delivery threshold** — Orders ≥ `settings.freeDeliveryThreshold` (default KES 3,000) have delivery fee set to 0 automatically.
8. **M-Pesa verification** — All Daraja STK callbacks must be verified against stored `CheckoutRequestID` before marking payment confirmed.
9. **Occasion reminders** — 3 days before any saved customer occasion, BullMQ reminder job fires email + WhatsApp to customer.
10. **Subscription skip window** — Customer can skip a delivery up to 24h before the scheduled delivery date.

---

## 7. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── ENUMS ──────────────────────────────────────────────────────────

enum Role {
  OWNER
  MANAGER
  FLORIST
  DRIVER
}

enum OrderStatus {
  PENDING           // placed, awaiting confirmation
  CONFIRMED         // admin confirmed, inventory deducted
  PREPARING         // florist arranging
  READY             // ready for driver pickup
  OUT_FOR_DELIVERY  // driver collected
  DELIVERED         // confirmed delivered
  FAILED_DELIVERY   // delivery attempt failed
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  UNPAID
  PENDING           // STK push sent, awaiting callback
  PAID
  PARTIALLY_PAID
  REFUNDED
  FAILED
}

enum PaymentMethod {
  MPESA
  CARD
  CASH_ON_DELIVERY
}

enum DeliverySlot {
  MORNING       // 09:00–12:00
  AFTERNOON     // 13:00–17:00
  EVENING       // 17:00–19:00
  SPECIFIC_TIME // exact time in order.deliveryTime
}

enum FlowerFreshness {
  FRESH
  USE_TODAY
  DISCARD
}

enum InventoryMovementType {
  RECEIVED
  USED
  DISCARDED
  ADJUSTED
}

enum SubscriptionStatus {
  ACTIVE
  PAUSED
  CANCELLED
  EXPIRED
}

enum SubscriptionFrequency {
  WEEKLY
  BIWEEKLY
  MONTHLY
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_DELIVERY
}

enum NotificationChannel {
  EMAIL
  SMS
  WHATSAPP
  PUSH
}

enum OrderSource {
  WEBSITE
  WHATSAPP
  PHONE
  WALK_IN
}

// ── STAFF / AUTH ───────────────────────────────────────────────────

model Staff {
  id             String         @id @default(cuid())
  name           String
  email          String         @unique
  phone          String         @unique
  passwordHash   String
  role           Role
  isActive       Boolean        @default(true)
  avatarUrl      String?
  vehicleInfo    String?        // "Toyota Vitz KCB 123A" for drivers
  refreshTokens  RefreshToken[]
  assignedOrders Order[]        @relation("AssignedFlorist")
  deliveries     Order[]        @relation("AssignedDriver")
  auditLogs      AuditLog[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  @@index([role])
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  staffId   String
  staff     Staff    @relation(fields: [staffId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

// ── CUSTOMERS ──────────────────────────────────────────────────────

model Customer {
  id                String         @id @default(cuid())
  name              String
  phone             String         @unique
  email             String?        @unique
  passwordHash      String?        // null = guest
  newsletterOptIn   Boolean        @default(false)
  preferredPayment  PaymentMethod?
  notes             String?
  flowerPreferences String?        // "no lilies, pet-safe only"
  totalSpent        Decimal        @default(0) @db.Decimal(12,2)
  orderCount        Int            @default(0)
  loyaltyPoints     Int            @default(0)
  isVip             Boolean        @default(false)
  addresses         Address[]
  orders            Order[]
  occasions         Occasion[]
  subscriptions     Subscription[]
  whatsappLogs      WhatsappLog[]
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  @@index([phone])
  @@index([email])
}

model Address {
  id             String       @id @default(cuid())
  customerId     String
  customer       Customer     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  label          String?      // "Home", "Office"
  recipientName  String?
  recipientPhone String?
  street         String
  area           String       // "Westlands", "Karen"
  zoneId         String?
  zone           DeliveryZone? @relation(fields: [zoneId], references: [id])
  instructions   String?      // "Blue gate, ring twice"
  isDefault      Boolean      @default(false)
  createdAt      DateTime     @default(now())
  @@index([customerId])
}

model Occasion {
  id            String   @id @default(cuid())
  customerId    String
  customer      Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  type          String   // "birthday", "anniversary", "custom"
  label         String   // "Mum's birthday"
  recipientName String?
  date          DateTime // month+day matter; year optional
  yearMatters   Boolean  @default(false)
  reminderDays  Int      @default(3)
  lastRemindedAt DateTime?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  @@index([customerId])
  @@index([date])
}

// ── PRODUCTS ───────────────────────────────────────────────────────

model Category {
  id          String            @id @default(cuid())
  name        String            @unique
  slug        String            @unique
  description String?
  imageUrl    String?
  sortOrder   Int               @default(0)
  isActive    Boolean           @default(true)
  products    ProductCategory[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model FlowerTag {
  id       String       @id @default(cuid())
  name     String       @unique  // "Rose", "Lily"
  slug     String       @unique
  products ProductTag[]
}

model Product {
  id               String            @id @default(cuid())
  name             String
  slug             String            @unique
  sku              String?           @unique
  shortDescription String
  longDescription  String
  careInstructions String?
  badgeLabel       String?           // "Best Seller", "New", "Sale"
  isFeatured       Boolean           @default(false)
  isActive         Boolean           @default(true)
  sortOrder        Int               @default(0)
  seoTitle         String?
  seoDescription   String?
  categories       ProductCategory[]
  tags             ProductTag[]
  images           ProductImage[]
  variants         ProductVariant[]
  addons           ProductAddon[]
  orderItems       OrderItem[]
  subscriptions    Subscription[]
  relatedProducts  Product[]         @relation("RelatedProducts")
  relatedTo        Product[]         @relation("RelatedProducts")
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  @@index([slug])
  @@index([isActive, isFeatured])
}

model ProductCategory {
  productId  String
  categoryId String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  @@id([productId, categoryId])
}

model ProductTag {
  productId String
  tagId     String
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  tag       FlowerTag @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([productId, tagId])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  altText   String?
  isPrimary Boolean @default(false)
  sortOrder Int     @default(0)
}

model ProductVariant {
  id             String      @id @default(cuid())
  productId      String
  product        Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  label          String      // "12 Stems", "Medium", "Pink"
  priceKes       Decimal     @db.Decimal(10,2)
  salePriceKes   Decimal?    @db.Decimal(10,2)
  saleStartsAt   DateTime?
  saleEndsAt     DateTime?
  stockQty       Int         @default(0)
  lowStockAlert  Int         @default(5)
  allowBackorder Boolean     @default(false)
  stemsUsed      Int         @default(1)  // stems consumed per unit
  flowerTypeId   String?
  isActive       Boolean     @default(true)
  orderItems     OrderItem[]
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  @@index([productId])
}

model ProductAddon {
  id          String       @id @default(cuid())
  productId   String
  product     Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  name        String       // "Vase", "Chocolates", "Greeting Card"
  priceKes    Decimal      @db.Decimal(10,2)
  stockQty    Int          @default(0)
  isActive    Boolean      @default(true)
  orderAddons OrderAddon[]
}

// ── INVENTORY ──────────────────────────────────────────────────────

model FlowerInventory {
  id                  String                @id @default(cuid())
  flowerName          String                // "Red Naomi Rose"
  flowerType          String                // "Rose", "Lily"
  colour              String?
  supplierId          String?
  supplier            Supplier?             @relation(fields: [supplierId], references: [id])
  currentStemsQty     Int                   @default(0)
  costPerStemKes      Decimal               @db.Decimal(8,2)
  receivedAt          DateTime
  freshnessWindowDays Int                   @default(7)
  freshness           FlowerFreshness       @default(FRESH)
  discardAt           DateTime              // receivedAt + freshnessWindowDays
  reorderPoint        Int                   @default(20)
  movements           InventoryMovement[]
  createdAt           DateTime              @default(now())
  updatedAt           DateTime              @updatedAt
  @@index([freshness])
  @@index([flowerType])
}

model InventoryMovement {
  id          String                @id @default(cuid())
  inventoryId String
  inventory   FlowerInventory       @relation(fields: [inventoryId], references: [id])
  type        InventoryMovementType
  quantity    Int                   // positive=in, negative=out
  orderId     String?
  reason      String?
  staffId     String?
  createdAt   DateTime              @default(now())
  @@index([inventoryId, createdAt])
}

model Supplier {
  id           String            @id @default(cuid())
  name         String
  contactName  String?
  phone        String?
  email        String?
  address      String?
  leadTimeDays Int               @default(1)
  notes        String?
  isActive     Boolean           @default(true)
  flowerStock  FlowerInventory[]
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
}

// ── ORDERS ─────────────────────────────────────────────────────────

model Order {
  id               String      @id @default(cuid())
  orderNumber      String      @unique  // LF-0001
  customerId       String?
  customer         Customer?   @relation(fields: [customerId], references: [id])
  guestName        String?
  guestPhone       String?
  guestEmail       String?
  source           OrderSource @default(WEBSITE)
  status           OrderStatus @default(PENDING)
  paymentStatus    PaymentStatus @default(UNPAID)
  paymentMethod    PaymentMethod?

  // Recipient
  recipientName    String
  recipientPhone   String
  deliveryAddress  String
  deliveryArea     String
  deliveryZoneId   String?
  deliveryZone     DeliveryZone? @relation(fields: [deliveryZoneId], references: [id])
  deliveryInstructions String?

  // Timing
  deliveryDate     DateTime
  deliverySlot     DeliverySlot
  deliveryTime     String?       // specific time if SPECIFIC_TIME

  // Financials
  subtotalKes      Decimal     @db.Decimal(10,2)
  deliveryFeeKes   Decimal     @db.Decimal(10,2) @default(0)
  discountKes      Decimal     @db.Decimal(10,2) @default(0)
  totalKes         Decimal     @db.Decimal(10,2)
  couponCode       String?
  couponId         String?
  coupon           Coupon?     @relation(fields: [couponId], references: [id])

  // Message card
  messageCard      String?
  messageCardFont  String?

  // Staff assignment
  floristId        String?
  florist          Staff?      @relation("AssignedFlorist", fields: [floristId], references: [id])
  driverId         String?
  driver           Staff?      @relation("AssignedDriver", fields: [driverId], references: [id])

  // Delivery confirmation
  deliveredAt      DateTime?
  deliveryPhotoUrl String?
  recipientSignature String?
  failureReason    String?

  // Notes
  internalNotes    String?
  staffNotes       String?

  items            OrderItem[]
  addons           OrderAddon[]
  payments         Payment[]
  statusHistory    OrderStatusHistory[]
  notifications    NotificationLog[]
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  @@index([status, deliveryDate])
  @@index([customerId])
  @@index([driverId, deliveryDate])
  @@index([orderNumber])
}

model OrderItem {
  id            String         @id @default(cuid())
  orderId       String
  order         Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId     String
  product       Product        @relation(fields: [productId], references: [id])
  variantId     String
  variant       ProductVariant @relation(fields: [variantId], references: [id])
  quantity      Int            @default(1)
  unitPriceKes  Decimal        @db.Decimal(10,2)
  totalPriceKes Decimal        @db.Decimal(10,2)
  colourChoice  String?
  customNote    String?
}

model OrderAddon {
  id           String       @id @default(cuid())
  orderId      String
  order        Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)
  addonId      String
  addon        ProductAddon @relation(fields: [addonId], references: [id])
  quantity     Int          @default(1)
  unitPriceKes Decimal      @db.Decimal(10,2)
}

model OrderStatusHistory {
  id         String       @id @default(cuid())
  orderId    String
  order      Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)
  fromStatus OrderStatus?
  toStatus   OrderStatus
  changedBy  String?
  note       String?
  createdAt  DateTime     @default(now())
  @@index([orderId])
}

// ── PAYMENTS ───────────────────────────────────────────────────────

model Payment {
  id                      String        @id @default(cuid())
  orderId                 String
  order                   Order         @relation(fields: [orderId], references: [id])
  method                  PaymentMethod
  amountKes               Decimal       @db.Decimal(10,2)
  status                  PaymentStatus @default(PENDING)
  mpesaCheckoutRequestId  String?       @unique
  mpesaReceiptNumber      String?
  mpesaPhoneNumber        String?
  stripePaymentIntentId   String?       @unique
  stripeChargeId          String?
  refundedAmountKes       Decimal?      @db.Decimal(10,2)
  refundReason            String?
  refundedAt              DateTime?
  refundedBy              String?
  metadata                Json?
  createdAt               DateTime      @default(now())
  updatedAt               DateTime      @updatedAt
  @@index([orderId])
  @@index([mpesaCheckoutRequestId])
}

// ── DELIVERY ───────────────────────────────────────────────────────

model DeliveryZone {
  id             String    @id @default(cuid())
  name           String    @unique  // "Westlands", "Karen"
  deliveryFeeKes Decimal   @db.Decimal(8,2)
  isActive       Boolean   @default(true)
  addresses      Address[]
  orders         Order[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model DeliverySlotConfig {
  id        String       @id @default(cuid())
  slot      DeliverySlot
  maxOrders Int          @default(10)
  isActive  Boolean      @default(true)
  dayOfWeek Int?         // 0=Sun..6=Sat; null=all days
  updatedAt DateTime     @updatedAt
}

model BlockoutDate {
  id        String   @id @default(cuid())
  date      DateTime @unique
  reason    String?
  createdAt DateTime @default(now())
}

// ── DISCOUNTS ──────────────────────────────────────────────────────

model Coupon {
  id                 String     @id @default(cuid())
  code               String     @unique
  type               CouponType
  value              Decimal    @db.Decimal(8,2)
  maxDiscountKes     Decimal?   @db.Decimal(8,2)
  minOrderKes        Decimal?   @db.Decimal(8,2)
  maxUsesTotal       Int?
  maxUsesPerCustomer Int?       @default(1)
  usedCount          Int        @default(0)
  firstOrderOnly     Boolean    @default(false)
  startsAt           DateTime?
  expiresAt          DateTime?
  isActive           Boolean    @default(true)
  orders             Order[]
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
  @@index([code])
}

model LoyaltyTransaction {
  id          String   @id @default(cuid())
  customerId  String
  orderId     String?
  points      Int      // positive=earned, negative=redeemed
  description String
  createdAt   DateTime @default(now())
  @@index([customerId])
}

// ── SUBSCRIPTIONS ──────────────────────────────────────────────────

model Subscription {
  id                String                @id @default(cuid())
  customerId        String
  customer          Customer              @relation(fields: [customerId], references: [id])
  productId         String
  product           Product               @relation(fields: [productId], references: [id])
  variantLabel      String
  priceKes          Decimal               @db.Decimal(10,2)
  frequency         SubscriptionFrequency
  status            SubscriptionStatus    @default(ACTIVE)
  deliveryAddressId String?
  deliverySlot      DeliverySlot
  preferences       String?
  nextDeliveryDate  DateTime
  lastDeliveryDate  DateTime?
  totalDeliveries   Int                   @default(0)
  skipUntil         DateTime?
  pausedAt          DateTime?
  cancelledAt       DateTime?
  cancelReason      String?
  paymentMethod     PaymentMethod
  createdAt         DateTime              @default(now())
  updatedAt         DateTime              @updatedAt
  @@index([customerId, status])
  @@index([nextDeliveryDate, status])
}

// ── NOTIFICATIONS ──────────────────────────────────────────────────

model NotificationLog {
  id          String              @id @default(cuid())
  orderId     String?
  order       Order?              @relation(fields: [orderId], references: [id])
  customerId  String?
  channel     NotificationChannel
  templateKey String
  recipient   String
  status      String              // "sent" | "delivered" | "failed"
  sentAt      DateTime            @default(now())
  error       String?
}

model WhatsappLog {
  id          String    @id @default(cuid())
  customerId  String?
  customer    Customer? @relation(fields: [customerId], references: [id])
  direction   String    // "inbound" | "outbound"
  message     String
  waMessageId String?
  createdAt   DateTime  @default(now())
  @@index([customerId])
}

// ── SETTINGS ───────────────────────────────────────────────────────

model StoreSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  updatedBy String?
  updatedAt DateTime @updatedAt
}

// ── AUDIT ──────────────────────────────────────────────────────────

model AuditLog {
  id         String   @id @default(cuid())
  staffId    String?
  staff      Staff?   @relation(fields: [staffId], references: [id])
  action     String   // "ORDER_STATUS_CHANGED", "PRODUCT_UPDATED"
  entityType String
  entityId   String
  before     Json?
  after      Json?
  ip         String?
  createdAt  DateTime @default(now())
  @@index([entityType, entityId])
  @@index([staffId, createdAt])
}
```

---

## 8. Auth API

### Endpoints

```
POST /auth/login              { email, password } → { accessToken, refreshToken, staff }
POST /auth/refresh            { refreshToken }    → { accessToken, refreshToken }
POST /auth/logout             { refreshToken }
GET  /auth/me                                     → current staff profile
PATCH /auth/change-password   { currentPassword, newPassword }

GET    /staff                 OWNER only — list all staff
POST   /staff                 OWNER — create { name, email, phone, role, password }
PATCH  /staff/:id             OWNER — update name/role/isActive
DELETE /staff/:id             OWNER — soft-deactivate
POST   /staff/:id/reset-password  OWNER — send password reset link
```

### JWT Middleware

```typescript
// src/middleware/auth.ts
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success:false, error:{ code:'NO_TOKEN' } });
  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
    req.user = await prisma.staff.findUniqueOrThrow({ where:{ id: payload.sub } });
    next();
  } catch {
    res.status(401).json({ success:false, error:{ code:'INVALID_TOKEN' } });
  }
};

export const requireRole = (...roles: Role[]) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ success:false, error:{ code:'FORBIDDEN' } });
  next();
};

// Usage in router:
// router.post('/staff', authenticate, requireRole('OWNER'), createStaff);
```

---

## 9. Orders API

### Status Machine

```
PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
                                                             ↘ FAILED_DELIVERY
PENDING → CANCELLED
CONFIRMED → CANCELLED (50% fee if <4hr to delivery)
DELIVERED → REFUNDED  (OWNER only)
```

Transition permissions:

- **OWNER/MANAGER**: any
- **FLORIST**: CONFIRMED→PREPARING, PREPARING→READY
- **DRIVER**: READY→OUT_FOR_DELIVERY, OUT_FOR_DELIVERY→DELIVERED or FAILED_DELIVERY

### Endpoints

```
GET    /orders                        page,limit,status,driverId,floristId,deliveryDate,source,paymentStatus,area,search
GET    /orders/:id                    full order with items,addons,payments,statusHistory
POST   /orders                        create (admin/walk-in)
PATCH  /orders/:id                    edit items/address/notes (before OUT_FOR_DELIVERY)
PATCH  /orders/:id/status             { status, note }
PATCH  /orders/:id/assign-driver      { driverId }
PATCH  /orders/:id/assign-florist     { floristId }
POST   /orders/:id/deliver            multipart: { photo, signature?, note? }
POST   /orders/:id/fail-delivery      { reason }
POST   /orders/:id/cancel             { reason }
POST   /orders/:id/refund             { amountKes, reason }  OWNER only
GET    /orders/:id/ticket?type=work|delivery   PDF blob
GET    /orders/export?format=csv&from=&to=
POST   /orders/bulk-status            { orderIds[], status }
```

### Create Order — request body

```jsonc
{
  "customerId": "cuid",          // null for guest
  "guestName": "John Doe",
  "guestPhone": "+254700000000",
  "source": "WALK_IN",
  "recipientName": "Jane Doe",
  "recipientPhone": "+254711111111",
  "deliveryAddress": "14 Rose Lane, Karen",
  "deliveryArea": "Karen",
  "deliveryZoneId": "zone_cuid",
  "deliveryDate": "2025-02-14",
  "deliverySlot": "MORNING",
  "messageCard": "Happy Valentine's Day!",
  "items": [{ "variantId": "var_cuid", "quantity": 1, "colourChoice": "red" }],
  "addons": [{ "addonId": "addon_cuid", "quantity": 1 }],
  "couponCode": "LOVE20",
  "paymentMethod": "MPESA"
}
```

### createOrder service

```typescript
async function createOrder(data: CreateOrderDto): Promise<Order> {
  // 1. Same-day cutoff check
  if (!isSameDayAllowed(data.deliveryDate, settings)) throw new SameDayCutoffError();

  // 2. Slot capacity (Redis atomic increment)
  const slotKey = `slot:${data.deliveryDate}:${data.deliverySlot}`;
  const slotCount = await redis.incr(slotKey);
  await redis.expire(slotKey, 86400);
  if (slotCount > MAX_SLOT_ORDERS) throw new SlotFullError();

  return prisma.$transaction(async (tx) => {
    // 3. Stock validation
    for (const item of data.items) {
      const variant = await tx.productVariant.findUniqueOrThrow({ where:{ id: item.variantId } });
      if (variant.stockQty < item.quantity && !variant.allowBackorder)
        throw new InsufficientStockError(variant.id);
    }

    // 4. Coupon validation + discount
    let discountKes = 0, couponId = null;
    if (data.couponCode) {
      const result = await validateCoupon(data.couponCode, subtotalKes, data.customerId, tx);
      discountKes = result.discountKes;
      couponId = result.coupon.id;
    }

    // 5. Delivery fee
    const zone = data.deliveryZoneId
      ? await tx.deliveryZone.findUnique({ where:{ id: data.deliveryZoneId } })
      : null;
    const deliveryFeeKes = subtotalKes >= FREE_DELIVERY_THRESHOLD ? 0 : (zone?.deliveryFeeKes ?? 300);

    // 6. Create order
    const order = await tx.order.create({
      data: { ...mapped, orderNumber: await nextOrderNumber(tx), couponId, deliveryFeeKes, discountKes }
    });

    // 7. Enqueue confirmation notification
    await notificationQueue.add('order.created', { orderId: order.id });
    return order;
  });
}
```

### transitionStatus service

```typescript
async function transitionStatus(
  orderId: string, newStatus: OrderStatus, staffId: string, note?: string
) {
  const order = await prisma.order.findUniqueOrThrow({ where:{ id: orderId } });
  validateTransition(order.status, newStatus);    // throws if disallowed

  return prisma.$transaction(async (tx) => {
    // Deduct inventory on confirmation
    if (order.status === 'PENDING' && newStatus === 'CONFIRMED') {
      await deductInventory(order.id, tx);
    }

    const updated = await tx.order.update({ where:{ id: orderId }, data:{ status: newStatus } });

    await tx.orderStatusHistory.create({
      data:{ orderId, fromStatus: order.status, toStatus: newStatus, changedBy: staffId, note }
    });
    await tx.auditLog.create({
      data:{ staffId, action:'ORDER_STATUS_CHANGED', entityType:'Order', entityId: orderId,
             before:{ status: order.status }, after:{ status: newStatus } }
    });

    // Fire customer-facing notifications
    if (['CONFIRMED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'].includes(newStatus))
      await notificationQueue.add(`order.${newStatus.toLowerCase()}`, { orderId });

    return updated;
  });
}
```

### deductInventory

```typescript
async function deductInventory(orderId: string, tx: PrismaTransaction) {
  const items = await tx.orderItem.findMany({ where:{ orderId }, include:{ variant: true } });
  for (const item of items) {
    const stems = item.variant.stemsUsed * item.quantity;
    await tx.productVariant.update({ where:{ id: item.variantId }, data:{ stockQty:{ decrement: stems } } });
    await tx.inventoryMovement.create({
      data:{ type:'USED', quantity: -stems, orderId, inventoryId: item.variant.flowerTypeId! }
    });
  }
}
```

---

## 10. Delivery API

### Endpoints

```
GET  /delivery/board?date=YYYY-MM-DD               all orders grouped by slot
GET  /delivery/driver/:driverId?date=YYYY-MM-DD    driver's run list
PATCH /delivery/orders/:orderId/driver             { driverId }
POST  /delivery/bulk-assign                        { slot, date, driverId }
POST  /delivery/optimize-route                     { orderIds[], startLocation }
GET  /delivery/slots/availability?date=YYYY-MM-DD  remaining capacity per slot
GET  /delivery/zones                               list zones
POST /delivery/zones                               create zone
PATCH /delivery/zones/:id                          update zone
DELETE /delivery/zones/:id                         deactivate
GET  /delivery/slots                               list slot configs
PATCH /delivery/slots/:id                          update maxOrders / isActive
GET  /delivery/blockout-dates                      list
POST /delivery/blockout-dates                      { date, reason }
DELETE /delivery/blockout-dates/:id
POST /delivery/driver-location                     { latitude, longitude } — driver app
GET  /delivery/driver-location/:driverId           admin map
POST /delivery/orders/:orderId/confirm-delivered   multipart { photo, note? }
POST /delivery/orders/:orderId/failed              { reason }
```

### Core delivery logic

```typescript
// Same-day cutoff
function isSameDayAllowed(deliveryDate: string, settings: StoreSettings): boolean {
  const now = DateTime.now().setZone('Africa/Nairobi');
  const delivery = DateTime.fromISO(deliveryDate, { zone: 'Africa/Nairobi' });
  if (!delivery.hasSame(now, 'day')) return true;
  return now.hour < settings.sameDayCutoffHour;
}

// Delivery fee
function calcDeliveryFee(subtotalKes: number, zone: DeliveryZone | null, settings: StoreSettings): number {
  if (subtotalKes >= settings.freeDeliveryThreshold) return 0;
  return zone ? Number(zone.deliveryFeeKes) : settings.defaultDeliveryFeeKes;
}

// Route optimization (Google Maps Distance Matrix — greedy nearest-neighbour)
async function optimizeRoute(orderIds: string[], startLocation: string) {
  const orders = await prisma.order.findMany({ where:{ id:{ in: orderIds } }, select:{ id:true, deliveryAddress:true } });
  const dests = orders.map(o => encodeURIComponent(o.deliveryAddress)).join('|');
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(startLocation)}&destinations=${dests}&key=${GOOGLE_MAPS_KEY}`;
  const { rows } = await (await fetch(url)).json();
  return greedyNearestNeighbour(orders, rows[0].elements);  // returns sorted order array
}

// Driver location (Redis TTL 5 min)
async function updateDriverLocation(driverId: string, lat: number, lng: number) {
  await redis.setex(`driver:${driverId}:location`, 300, JSON.stringify({ lat, lng, updatedAt: Date.now() }));
}
```

---

## 11. Products API

### Endpoints

```
GET    /products                              page,limit,category,tag,status,search,featured
GET    /products/:id                          full product with variants,images,addons
POST   /products                              create
PATCH  /products/:id                          update
DELETE /products/:id                          soft-delete (isActive=false)
POST   /products/:id/images                   multipart upload → Cloudinary
DELETE /products/:id/images/:imageId
GET    /products/:id/variants
POST   /products/:id/variants                 add variant
PATCH  /products/variants/:variantId          update price/stock/active
GET    /categories
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id
GET    /tags
POST   /tags
```

### Create product body

```jsonc
{
  "name": "Classic Red Roses",
  "slug": "classic-red-roses",
  "shortDescription": "Twelve long-stem red roses",
  "longDescription": "...",
  "careInstructions": "Trim stems at 45°...",
  "badgeLabel": "Best Seller",
  "isFeatured": true,
  "categoryIds": ["cat_birthday", "cat_romance"],
  "tagIds": ["tag_rose"],
  "seoTitle": "Classic Red Roses Nairobi | Same-Day Delivery",
  "seoDescription": "...",
  "variants": [
    { "label": "6 Stems",  "priceKes": 1800, "stockQty": 20, "stemsUsed": 6 },
    { "label": "12 Stems", "priceKes": 3200, "stockQty": 15, "stemsUsed": 12 },
    { "label": "24 Stems", "priceKes": 5800, "stockQty": 10, "stemsUsed": 24 }
  ],
  "addons": [
    { "name": "Glass Vase",    "priceKes": 500,  "stockQty": 30 },
    { "name": "Chocolates",    "priceKes": 800,  "stockQty": 25 },
    { "name": "Greeting Card", "priceKes": 200,  "stockQty": 100 }
  ]
}
```

---

## 12. Inventory API

### Endpoints

```
GET    /inventory/flowers              list all flower stock, filter by freshness/type
POST   /inventory/flowers              add new batch { flowerName, flowerType, stemsQty, costPerStem, receivedAt, freshnessWindowDays, supplierId }
PATCH  /inventory/flowers/:id          adjust qty, update freshness manually
DELETE /inventory/flowers/:id          archive
GET    /inventory/movements/:inventoryId   movement history
POST   /inventory/movements            manual adjustment { inventoryId, type, quantity, reason }
GET    /inventory/suppliers
POST   /inventory/suppliers
PATCH  /inventory/suppliers/:id
GET    /inventory/alerts               items below reorderPoint or freshness=DISCARD
GET    /inventory/supplies             packaging/add-on stock
PATCH  /inventory/supplies/:id         update qty
```

### Daily freshness update job (runs 05:00 EAT)

```typescript
async function updateFreshness() {
  const now = new Date();
  const items = await prisma.flowerInventory.findMany({ where:{ freshness:{ not:'DISCARD' } } });
  for (const item of items) {
    const daysOld = differenceInDays(now, item.receivedAt);
    const window = item.freshnessWindowDays;
    const freshness = daysOld >= window ? 'DISCARD'
                    : daysOld >= window - 1 ? 'USE_TODAY'
                    : 'FRESH';
    if (freshness !== item.freshness)
      await prisma.flowerInventory.update({ where:{ id: item.id }, data:{ freshness } });
  }
  // Alert owner on low stock
  const lowStock = await prisma.flowerInventory.findMany({
    where:{ currentStemsQty:{ lte: prisma.flowerInventory.fields.reorderPoint } }
  });
  if (lowStock.length) await notificationQueue.add('low_stock.alert', { items: lowStock });
}
```

---

## 13. Customers API

### Endpoints

```
GET    /customers                         page,limit,search(name|phone|email),isVip
GET    /customers/:id                     full profile + order history + occasions
POST   /customers                         create
PATCH  /customers/:id                     update
GET    /customers/:id/orders
GET    /customers/:id/occasions
POST   /customers/:id/occasions           { type, label, recipientName, date, reminderDays }
PATCH  /customers/:id/occasions/:oid      update
DELETE /customers/:id/occasions/:oid
GET    /customers/:id/loyalty             { balance, history[] }
POST   /customers/:id/loyalty/adjust      { points, description }  MANAGER+
```

### LTV update (called after every paid order)

```typescript
async function updateCustomerLtv(customerId: string) {
  const { _sum, _count } = await prisma.order.aggregate({
    where:{ customerId, paymentStatus:'PAID' },
    _sum:{ totalKes: true }, _count: true
  });
  await prisma.customer.update({
    where:{ id: customerId },
    data:{ totalSpent: _sum.totalKes ?? 0, orderCount: _count,
           isVip: (_sum.totalKes ?? 0) >= VIP_THRESHOLD }
  });
}
```

### Occasion reminder job (daily 08:00 EAT)

```typescript
async function processOccasionReminders() {
  const target = DateTime.now().setZone('Africa/Nairobi').plus({ days: 3 });
  const occasions = await prisma.occasion.findMany({
    where:{
      isActive: true,
      date:{ gte: target.startOf('day').toJSDate(), lt: target.endOf('day').toJSDate() },
      OR:[{ lastRemindedAt: null }, { lastRemindedAt:{ lt: subDays(new Date(), 300) } }]
    },
    include:{ customer: true }
  });
  for (const occ of occasions) {
    await notificationQueue.add('occasion.reminder', {
      customerId: occ.customerId, phone: occ.customer.phone,
      label: occ.label, recipientName: occ.recipientName, daysUntil: 3
    });
    await prisma.occasion.update({ where:{ id: occ.id }, data:{ lastRemindedAt: new Date() } });
  }
}
```

---

## 14. Payments API

### M-Pesa STK Push (initiate)

```
POST /payments/mpesa/stk-push
{ "orderId": "cuid", "phone": "+254700000000" }
```

```typescript
async function initiateStkPush(orderId: string, phone: string) {
  const order = await prisma.order.findUniqueOrThrow({ where:{ id: orderId } });

  // 1. Get Daraja OAuth token
  const authB64 = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const { access_token } = await (await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers:{ Authorization:`Basic ${authB64}` } }
  )).json();

  // 2. Build STK Push payload
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14);
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
  const formattedPhone = phone.replace(/^\+/,'').replace(/^0/,'254');

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password, Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(Number(order.totalKes)),
    PartyA: formattedPhone, PartyB: MPESA_SHORTCODE, PhoneNumber: formattedPhone,
    CallBackURL: MPESA_CALLBACK_URL,
    AccountReference: order.orderNumber,
    TransactionDesc: `Payment for order ${order.orderNumber}`
  };

  const data = await (await fetch(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    { method:'POST', headers:{ Authorization:`Bearer ${access_token}`, 'Content-Type':'application/json' },
      body: JSON.stringify(payload) }
  )).json();

  if (data.ResponseCode !== '0') throw new Error(data.ResponseDescription);

  await prisma.payment.create({
    data:{ orderId, method:'MPESA', amountKes: order.totalKes, status:'PENDING',
           mpesaCheckoutRequestId: data.CheckoutRequestID, mpesaPhoneNumber: formattedPhone }
  });
  await prisma.order.update({ where:{ id: orderId }, data:{ paymentStatus:'PENDING' } });
  return { checkoutRequestId: data.CheckoutRequestID };
}
```

### M-Pesa Callback handler (public endpoint, no auth)

```
POST /payments/mpesa/callback
```

```typescript
async function handleMpesaCallback(body: any) {
  const { stkCallback } = body.Body;
  const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;

  const payment = await prisma.payment.findUnique({
    where:{ mpesaCheckoutRequestId: CheckoutRequestID }, include:{ order: true }
  });
  if (!payment) return;

  if (ResultCode === 0) {
    const receipt = CallbackMetadata.Item.find((i:any) => i.Name === 'MpesaReceiptNumber')?.Value;
    await prisma.$transaction([
      prisma.payment.update({ where:{ id: payment.id }, data:{ status:'PAID', mpesaReceiptNumber: receipt } }),
      prisma.order.update({ where:{ id: payment.orderId }, data:{ paymentStatus:'PAID' } })
    ]);
    if (payment.order.status === 'PENDING')
      await ordersService.transitionStatus(payment.orderId, 'CONFIRMED', 'system');
  } else {
    await prisma.payment.update({ where:{ id: payment.id }, data:{ status:'FAILED' } });
  }
}
```

### Stripe

```
POST /payments/stripe/create-intent  { orderId } → { clientSecret }
POST /payments/stripe/webhook        verified by stripe-signature header
POST /payments/:id/refund            { amountKes, reason }  OWNER only
GET  /payments/order/:orderId        all payments for order
```

```typescript
// Stripe Payment Intent
async function createStripeIntent(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({ where:{ id: orderId } });
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.totalKes) * 100), currency:'kes',
    metadata:{ orderId, orderNumber: order.orderNumber }
  });
  await prisma.payment.create({ data:{ orderId, method:'CARD', amountKes: order.totalKes,
    status:'PENDING', stripePaymentIntentId: intent.id } });
  return { clientSecret: intent.client_secret };
}

// Refund
async function issueRefund(paymentId: string, amountKes: number, reason: string, staffId: string) {
  const payment = await prisma.payment.findUniqueOrThrow({ where:{ id: paymentId } });
  if (payment.method === 'CARD')
    await stripe.refunds.create({ payment_intent: payment.stripePaymentIntentId!, amount: Math.round(amountKes*100) });
  // M-Pesa: manual reversal via Daraja B2C (requires separate Initiator creds — log for manual processing)
  await prisma.$transaction([
    prisma.payment.update({ where:{ id: paymentId }, data:{ refundedAmountKes: amountKes,
      refundReason: reason, refundedAt: new Date(), refundedBy: staffId, status:'REFUNDED' } }),
    prisma.order.update({ where:{ id: payment.orderId }, data:{ paymentStatus:'REFUNDED', status:'REFUNDED' } })
  ]);
  await notificationQueue.add('order.refunded', { orderId: payment.orderId, amountKes });
}
```

---

## 15. Analytics API

All analytics require OWNER or MANAGER role.

### Endpoints

```
GET /analytics/dashboard                          today + MTD KPIs in one call
GET /analytics/revenue?from=&to=&groupBy=day|week|month
GET /analytics/products?from=&to=&limit=10        top products by revenue
GET /analytics/categories?from=&to=
GET /analytics/channels?from=&to=                website|whatsapp|phone|walk-in
GET /analytics/areas?from=&to=                   revenue by delivery area
GET /analytics/heatmap?from=&to=                 7×24 orders matrix
GET /analytics/customers?from=&to=               new/returning, LTV, repeat rate
GET /analytics/delivery?from=&to=                on-time %, per-driver stats
GET /analytics/products/performance?from=&to=    best + worst sellers
```

### SQL patterns (PostgreSQL)

```sql
-- Revenue by day (Africa/Nairobi timezone)
SELECT
  DATE_TRUNC('day', "createdAt" AT TIME ZONE 'Africa/Nairobi') AS period,
  SUM("totalKes") AS revenue,
  COUNT(*) AS order_count,
  AVG("totalKes") AS avg_order_value
FROM "Order"
WHERE "paymentStatus" = 'PAID'
  AND "createdAt" >= $1 AND "createdAt" < $2
GROUP BY 1 ORDER BY 1;

-- Peak hour heatmap
SELECT
  EXTRACT(DOW FROM "createdAt" AT TIME ZONE 'Africa/Nairobi') AS day_of_week,
  EXTRACT(HOUR FROM "createdAt" AT TIME ZONE 'Africa/Nairobi') AS hour,
  COUNT(*) AS order_count
FROM "Order" WHERE "createdAt" >= $1 AND "createdAt" < $2
GROUP BY 1, 2;

-- Top products by revenue
SELECT p.name, SUM(oi."totalPriceKes") AS revenue, SUM(oi.quantity) AS units_sold
FROM "OrderItem" oi
JOIN "Product" p ON p.id = oi."productId"
JOIN "Order" o ON o.id = oi."orderId"
WHERE o."paymentStatus" = 'PAID' AND o."createdAt" >= $1 AND o."createdAt" < $2
GROUP BY p.id, p.name ORDER BY revenue DESC LIMIT $3;

-- New vs returning customers
SELECT
  COUNT(DISTINCT CASE WHEN o."orderCount" = 1 THEN o."customerId" END) AS new_customers,
  COUNT(DISTINCT CASE WHEN o."orderCount" > 1 THEN o."customerId" END) AS returning_customers
FROM "Order" o
WHERE o."createdAt" >= $1 AND o."createdAt" < $2 AND o."paymentStatus" = 'PAID';
```

---

## 16. Notifications

### Templates & triggers

| Key | Channels | Trigger | Recipient |
|---|---|---|---|
| order.created | Email + WhatsApp | Order placed | Customer |
| order.confirmed | WhatsApp + SMS | → CONFIRMED | Customer |
| order.dispatched | WhatsApp + SMS | → OUT_FOR_DELIVERY | Customer + Recipient |
| order.delivered | Email + WhatsApp | → DELIVERED | Customer |
| order.failed_delivery | WhatsApp | → FAILED_DELIVERY | Customer |
| order.cancelled | Email | Cancelled | Customer |
| order.refunded | Email | Refund issued | Customer |
| occasion.reminder | Email + WhatsApp | 3 days before | Customer |
| subscription.reminder | WhatsApp | 2 days before delivery | Subscriber |
| review.request | Email | 24h after DELIVERED | Customer |
| low_stock.alert | Email | Stems below reorder | Owner/Manager |
| new_order.alert | Push + WhatsApp | Order placed | Owner |

### WhatsApp Cloud API helper

```typescript
async function sendWhatsApp(to: string, templateName: string, params: string[]) {
  const res = await fetch(`https://graph.facebook.com/v18.0/${WA_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers:{ Authorization:`Bearer ${WA_ACCESS_TOKEN}`, 'Content-Type':'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to.replace(/^\+/,''),
      type: 'template',
      template:{
        name: templateName,
        language:{ code:'en' },
        components:[{ type:'body', parameters: params.map(v => ({ type:'text', text: v })) }]
      }
    })
  });
  return res.json();
}
```

### BullMQ notification worker

```typescript
// src/jobs/notificationWorker.ts
import { Worker } from 'bullmq';
const worker = new Worker('notifications', async (job) => {
  switch (job.name) {
    case 'order.created':      return sendOrderCreated(job.data.orderId);
    case 'order.confirmed':    return sendOrderConfirmed(job.data.orderId);
    case 'order.dispatched':   return sendOrderDispatched(job.data.orderId);
    case 'order.delivered':    return sendOrderDelivered(job.data.orderId);
    case 'order.refunded':     return sendRefundNotice(job.data.orderId, job.data.amountKes);
    case 'occasion.reminder':  return sendOccasionReminder(job.data);
    case 'low_stock.alert':    return sendLowStockAlert(job.data.items);
    default: throw new Error(`Unknown notification: ${job.name}`);
  }
}, { connection: redis });
worker.on('failed', (job, err) => logger.error(`Notification ${job?.id} failed:`, err));
```

---

## 17. Discounts API

### Endpoints

```
GET    /discounts/coupons
POST   /discounts/coupons              { code, type, value, minOrderKes, expiresAt, ... }
PATCH  /discounts/coupons/:id
DELETE /discounts/coupons/:id          deactivate
POST   /discounts/coupons/validate     { code, subtotalKes, customerId } → { discountKes, coupon }
GET    /discounts/loyalty/:customerId  { balance, history[] }
POST   /discounts/loyalty/:customerId/redeem  { points }
```

### Coupon validation

```typescript
async function validateCoupon(code: string, subtotalKes: number, customerId: string | null, tx: PrismaTransaction) {
  const coupon = await tx.coupon.findUnique({ where:{ code, isActive: true } });
  if (!coupon) throw new ApiError('INVALID_COUPON', 400);

  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt)       throw new ApiError('COUPON_NOT_ACTIVE', 400);
  if (coupon.expiresAt && now > coupon.expiresAt)     throw new ApiError('COUPON_EXPIRED', 400);
  if (coupon.maxUsesTotal && coupon.usedCount >= coupon.maxUsesTotal) throw new ApiError('COUPON_EXHAUSTED', 400);
  if (coupon.minOrderKes && subtotalKes < Number(coupon.minOrderKes)) throw new ApiError('ORDER_TOO_SMALL', 400);

  if (customerId && coupon.maxUsesPerCustomer) {
    const used = await tx.order.count({ where:{ customerId, couponId: coupon.id } });
    if (used >= coupon.maxUsesPerCustomer) throw new ApiError('COUPON_ALREADY_USED', 400);
  }

  if (coupon.firstOrderOnly && customerId) {
    const prev = await tx.order.count({ where:{ customerId } });
    if (prev > 0) throw new ApiError('FIRST_ORDER_ONLY', 400);
  }

  let discountKes = 0;
  if (coupon.type === 'PERCENTAGE') {
    discountKes = subtotalKes * (Number(coupon.value) / 100);
    if (coupon.maxDiscountKes) discountKes = Math.min(discountKes, Number(coupon.maxDiscountKes));
  } else if (coupon.type === 'FIXED_AMOUNT') {
    discountKes = Math.min(Number(coupon.value), subtotalKes);
  }
  // FREE_DELIVERY handled in delivery fee calculation

  await tx.coupon.update({ where:{ id: coupon.id }, data:{ usedCount:{ increment: 1 } } });
  return { coupon, discountKes };
}
```

---

## 18. Subscriptions API

### Endpoints

```
GET    /subscriptions                        page,limit,status,customerId
GET    /subscriptions/:id
POST   /subscriptions                        create
PATCH  /subscriptions/:id/pause
PATCH  /subscriptions/:id/resume
PATCH  /subscriptions/:id/skip              { skipUntil: date }  — up to 24h before delivery
DELETE /subscriptions/:id                   cancel { cancelReason }
```

### Next delivery date

```typescript
function nextDeliveryDate(from: Date, freq: SubscriptionFrequency): Date {
  const d = DateTime.fromJSDate(from).setZone('Africa/Nairobi');
  return { WEEKLY: d.plus({weeks:1}), BIWEEKLY: d.plus({weeks:2}), MONTHLY: d.plus({months:1}) }[freq].toJSDate();
}
```

### Daily subscription processor (06:00 EAT)

```typescript
async function processDueSubscriptions() {
  const today = DateTime.now().setZone('Africa/Nairobi').startOf('day');
  const due = await prisma.subscription.findMany({
    where:{
      status: 'ACTIVE',
      nextDeliveryDate:{ gte: today.toJSDate(), lt: today.plus({days:1}).toJSDate() },
      OR:[{ skipUntil: null }, { skipUntil:{ lt: new Date() } }]
    },
    include:{ customer: true }
  });
  for (const sub of due) {
    await ordersService.createOrder({
      customerId: sub.customerId, source:'WEBSITE',
      items:[{ productId: sub.productId, variantLabel: sub.variantLabel }],
      deliveryAddressId: sub.deliveryAddressId, deliveryDate: today.toISODate(),
      deliverySlot: sub.deliverySlot, paymentMethod: sub.paymentMethod
    });
    await prisma.subscription.update({ where:{ id: sub.id }, data:{
      lastDeliveryDate: today.toJSDate(),
      nextDeliveryDate: nextDeliveryDate(today.toJSDate(), sub.frequency),
      totalDeliveries:{ increment: 1 }
    }});
  }
}
```

---

## 19. Settings API

### Endpoints

```
GET   /settings          all settings as flat object
PATCH /settings          update one or more keys  (OWNER only)
```

### Setting keys reference

| Key | Type | Default |
|---|---|---|
| storeName | string | "Luxe Flowers Kenya" |
| storePhone | string | — |
| storeEmail | string | — |
| storeAddress | string | — |
| timezone | string | Africa/Nairobi |
| currency | string | KES |
| orderPrefix | string | LF- |
| sameDayCutoffHour | number | 13 |
| freeDeliveryThreshold | number | 3000 |
| defaultDeliveryFeeKes | number | 300 |
| vatRate | number | 0.16 |
| loyaltyPointsPerKes | number | 1 |
| loyaltyRedemptionRate | number | 100 |
| businessHours | object | `{mon:{open:"08:00",close:"18:00"},...}` |
| maintenanceMode | boolean | false |
| mpesaPaybill | string | — |
| whatsappNumber | string | — |

### Business hours check

```typescript
function isStoreOpen(settings: StoreSettings): boolean {
  const now = DateTime.now().setZone('Africa/Nairobi');
  const day = now.weekdayLong.toLowerCase().slice(0,3);
  const h = settings.businessHours[day];
  if (!h) return false;
  const toMin = (t: string) => { const [hr,mn] = t.split(':').map(Number); return hr*60+mn; };
  const cur = now.hour*60 + now.minute;
  return cur >= toMin(h.open) && cur < toMin(h.close);
}
```

---

## 20. Build Order Checklist

Follow this sequence — each module depends on the previous:

```
1. npm init → install deps → npx prisma init
2. Write prisma/schema.prisma (Section 7 above)
3. npx prisma migrate dev --name init
4. src/config/ → env.ts (Zod), redis.ts, prisma.ts
5. src/middleware/ → auth.ts, roles.ts, validate.ts, errorHandler.ts
6. modules/auth        (login, refresh, staff CRUD)
7. modules/settings    (store config + business rules)
8. modules/products    (CRUD, variants, images, addons)
9. modules/inventory   (flower stock, freshness, suppliers)
10. modules/orders     (create, status machine, deduct)
11. modules/delivery   (zones, slots, dispatch, confirm)
12. modules/customers  (CRM, occasions, LTV)
13. modules/discounts  (coupons, loyalty)
14. modules/payments   (M-Pesa STK, Stripe, refunds)
15. modules/notifications (BullMQ workers)
16. modules/analytics  (SQL report queries)
17. modules/subscriptions (recurring processor)
18. Cron jobs: freshness update (05:00), occasion reminders (08:00), subscription processor (06:00)
19. Integration tests with Supertest + test DB
```
