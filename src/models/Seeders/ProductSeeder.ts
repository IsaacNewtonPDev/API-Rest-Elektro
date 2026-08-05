import { fakerPT_BR as faker } from "@faker-js/faker";
import { Prisma} from "../../generated/prisma/client";
import { prisma } from "../../config/prisma"

export async function productSeeder(num: number) {
  const products: Prisma.ProductCreateManyInput[] = [];

  for (let i = 0; i < num; i++) {
    products.push({
      name: faker.commerce.productName(),
      descricao: faker.commerce.productDescription(),
      preco: parseFloat(faker.commerce.price()),
      avaliacao: faker.number.float({ min: 1, max: 5 }),
      userId: faker.number.int({ min: 1, max: 20 }),
    });
  }

  await prisma.product.createMany({ data: products });
}