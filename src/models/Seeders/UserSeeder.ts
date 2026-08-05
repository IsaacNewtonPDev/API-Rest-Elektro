import { fakerPT_BR as faker } from "@faker-js/faker";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma"

export async function userSeeder(num: number) {
  const users: Prisma.UserCreateManyInput[] = [];

  for (let i = 0; i < num; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      hash: faker.string.alphanumeric(32),
      salt: faker.string.alphanumeric(16),
      cpf: faker.string.numeric(11),
      contato: faker.string.numeric(11),
    });
  }

  await prisma.user.createMany({ data: users });
}