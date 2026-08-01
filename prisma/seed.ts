import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean slate so the seed is repeatable
  await prisma.task.deleteMany();
  await prisma.taskList.deleteMany();

  await prisma.taskList.create({
    data: {
      name: "Groceries",
      tasks: {
        create: [
          { title: "Buy oat milk" },
          { title: "Buy bread" },
          { title: "Buy coffee", completed: true },
        ],
      },
    },
  });

  await prisma.taskList.create({
    data: {
      name: "Work",
      tasks: {
        create: [
          { title: "Finish take-home assessment" },
          { title: "Reply to emails", completed: true },
          { title: "Prep for Monday interview" },
        ],
      },
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
