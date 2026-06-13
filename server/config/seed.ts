import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const staffMembers = [
    {
      name: "Mary Admin",
      email: "mary@sparklights.co.ke",
      phone: "+254712827840",
      role: Role.OWNER,
      password: "Mary@Admin254",
    },
    {
      name: "Sarah Manager",
      email: "sarah@sparklights.co.ke",
      phone: "+254799953563",
      role: Role.MANAGER,
      password: "manager123",
    },
    {
      name: "John Staff",
      email: "john@sparklights.co.ke",
      phone: "+254722222222",
      role: Role.FLORIST,
      password: "florist123",
    },
  ];

  for (const staff of staffMembers) {
    const hash = await bcrypt.hash(staff.password, 10);
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: { passwordHash: hash, name: staff.name, phone: staff.phone, role: staff.role },
      create: {
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        passwordHash: hash,
        role: staff.role,
      },
    });
    console.log(`Seed successful: ${staff.role.toLowerCase()} ${staff.email}`);
  }

  const categories = [
    { name: "Wall Lights", slug: "wall-lights", sortOrder: 1 },
    { name: "Ceiling Lights", slug: "ceiling-lights", sortOrder: 2 },
    { name: "Outdoor Lights", slug: "outdoor-lights", sortOrder: 3 },
    { name: "Bedroom Lights", slug: "bedroom-lights", sortOrder: 4 },
    { name: "Dining Lights", slug: "dining-lights", sortOrder: 5 },
    { name: "Kitchen Lights", slug: "kitchen-lights", sortOrder: 6 },
    { name: "Parking Lights", slug: "parking-lights", sortOrder: 7 },
    { name: "Events Lights", slug: "events-lights", sortOrder: 8 },
    { name: "Corridor Lights", slug: "corridor-lights", sortOrder: 9 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  console.log("Seed successful: Created lighting categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
