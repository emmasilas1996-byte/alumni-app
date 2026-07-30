import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------- Admin user (for Add Contribution / Add Dues login) ----------
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });
  console.log("Seeded admin user — username: admin, password: ChangeMe123! (change this immediately)");

  // ---------- Organization settings ----------
  const existingSettings = await prisma.organizationSettings.findFirst();
  if (!existingSettings) {
    await prisma.organizationSettings.create({
      data: { groupName: "Alumni Association" },
    });
    console.log("Seeded default organization settings (upload a logo from Settings later).");
  }

  // ---------- Constitution: Table of Contents ----------
  const sectionCount = await prisma.constitutionSection.count();
  if (sectionCount === 0) {
    const sections = [
      { title: "1. Name and Objectives", orderIndex: 1, content: "Replace with the actual constitution text for Name and Objectives." },
      { title: "2. Membership", orderIndex: 2, content: "Replace with the actual constitution text for Membership." },
      { title: "3. Executive Structure", orderIndex: 3, content: "Replace with the actual constitution text for Executive Structure." },
      { title: "4. Finances", orderIndex: 4, content: "Replace with the actual constitution text for Finances." },
    ];
    for (const s of sections) {
      await prisma.constitutionSection.create({ data: s });
    }
    console.log("Seeded placeholder constitution sections — edit these via Prisma Studio or the DB directly.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
