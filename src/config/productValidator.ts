import z from "zod";

const produto = z.object({
  name: z
    .string("name deve ser string")
    .trim()
    .min(3, "name deve ter no mínimo 3 caracteres")
    .max(50, "name não deve ter mais que 50 caracteres"),
  descricao: z
    .string("descricao deve ser string")
    .trim()
    .min(5, "descrição deve ter no mínimo 5 caracteres")
    .max(200, "descriçao não deve ter mais que 200 caracteres"),
  preco: z
    .number("preço deve ser number")
    .min(0, "preço não pode ser negativo"),
  avaliacao: z
    .number("avaliação deve ser number")
    .min(0, "avaliação não pode ser negativa")
    .max(5, "avaliação não pode ser maior que 5")
    .optional(),
  userId: z
    .number("userId deve ser number")
    .int("userId deve ser inteiro")
    .positive("userId deve ser positivo"),
});

const createProduto = produto;

const updateProduto = produto.partial();

const produtoParam = z.object({
  idProduto: z.coerce.number("Formato de id inválido"),
});

export default {
  createProduto,
  updateProduto,
  produtoParam,
};