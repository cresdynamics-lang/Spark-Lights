import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  // 1. Create Owner
  const owner = await prisma.staff.upsert({
    where: { email: "admin@sparklights.co.ke" },
    update: {},
    create: {
      name: "Main Admin",
      email: "admin@sparklights.co.ke",
      phone: "+254712827840",
      passwordHash: passwordHash,
      role: "OWNER",
    },
  });

  console.log("Seed successful: Created owner admin@sparklights.co.ke");

  // 2. Create some Categories
  const categories = [
    { name: "Birthday", slug: "birthday" },
    { name: "Anniversary", slug: "anniversary" },
    { name: "Romance", slug: "romance" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Seed successful: Created categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
