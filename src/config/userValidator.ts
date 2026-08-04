import z from "zod";

const user = z.object({
  name: z
    .string("name deve ser string")
    .trim()
    .min(3, "name deve ter no mínimo 3 caracteres")
    .max(50, "name não deve ter mais que 50 caracteres"),
  email: z.email("Email inválido"),
  password: z
    .string("password deve ser string")
    .min(6, "password deve ter no mínimo 6 caracteres")
    .max(20, "password não deve ter mais que 20 caracteres"),
  cpf: z
    .string("cpf deve ser string")
    .length(11, "cpf deve ter 11 caracteres"),
  contato: z
    .string("contato deve ser string")
    .min(10, "contato deve ter no mínimo 10 caracteres")
    .max(15, "contato não deve ter mais que 15 caracteres"),
});

const loginUser = z.object({
  email: z.email("Email ou Senha inválidos"),
  password: z
    .string("password deve ser string")
    .min(6, "password deve ter no mínimo 6 caracteres"),
});

const createUser = user;

const updateUser = user.partial();

const userParam = z.object({
  userId: z.coerce.number("Formato de id inválido"),
});

export default {
  createUser,
  loginUser,
  updateUser,
  userParam,
};