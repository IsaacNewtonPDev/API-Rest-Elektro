import { prisma } from "../../config/prisma";
import { userSeeder } from "./UserSeeder";
import { productSeeder } from "./ProductSeeder";

async function main() {
  await prisma.$connect();
  await userSeeder(20);
  await productSeeder(20);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: any) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });