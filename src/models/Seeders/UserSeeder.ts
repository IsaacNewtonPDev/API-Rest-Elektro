import { fakerPT_BR as faker } from "@faker-js/faker";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma"
import  auth  from "../../config/auth";

export async function userSeeder(num: number) {
  const users: Prisma.UserCreateManyInput[] = [];
  // Usuário Admin pra poder conseguir fazer teste
  const { salt, hash } = auth.generatePassword("admin");
  users.push({
    name: "Admin Teste",
    email: "admin@teste.com",
    hash,
    salt,
    cpf: "12345678901",
    contato: "62999999999",
  });

  for (let i = 0; i < num - 1; i++) {
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