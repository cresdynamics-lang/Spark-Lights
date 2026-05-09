import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  // 1. Create Staff Members
  const staffMembers = [
    {
      name: "Main Admin",
      email: "admin@marigold.co.ke",
      phone: "+254700000000",
      role: Role.OWNER,
      password: "admin123"
    },
    {
      name: "Sarah Manager",
      email: "sarah@marigold.co.ke",
      phone: "+254711111111",
      role: Role.MANAGER,
      password: "manager123"
    },
    {
      name: "John Florist",
      email: "john@marigold.co.ke",
      phone: "+254722222222",
      role: Role.FLORIST,
      password: "florist123"
    }
  ];

  for (const staff of staffMembers) {
    const hash = await bcrypt.hash(staff.password, 10);
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: { passwordHash: hash },
      create: {
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        passwordHash: hash,
        role: staff.role,
      },
    });
    console.log(`Seed successful: Created ${staff.role.toLowerCase()} ${staff.email}`);
  }

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
