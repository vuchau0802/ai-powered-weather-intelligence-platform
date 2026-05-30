require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "WeatherSearch" (
      "id" SERIAL PRIMARY KEY,
      "city" TEXT NOT NULL,
      "latitude" DOUBLE PRECISION NOT NULL,
      "longitude" DOUBLE PRECISION NOT NULL,
      "temperature" DOUBLE PRECISION NOT NULL,
      "humidity" INTEGER NOT NULL,
      "description" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const count = await prisma.weatherSearch.count();
  console.log(`WeatherSearch table is ready. Existing rows: ${count}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
