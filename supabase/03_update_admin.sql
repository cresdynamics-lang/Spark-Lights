-- Run in Supabase SQL Editor to update owner login (if you already ran an older seed)
UPDATE "Staff"
SET
  "name" = 'Mary Admin',
  "email" = 'mary@sparklights.co.ke',
  "passwordHash" = '$2b$10$tYg9e3SRpeN.ulWl/yY25uVc5Q8gGkhvr.2EPwOAT/p2VAxS6eT0.',
  "updatedAt" = NOW()
WHERE "email" IN ('admin@sparklights.co.ke', 'mary@sparklights.co.ke');
