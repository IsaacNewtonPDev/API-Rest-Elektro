import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../config/AuthRequest";

export async function checkProductOwner(request: AuthRequest, response: Response, next: NextFunction) {
  try {
    const userIdDoToken = request.token_user?.id;
    const idProduto = Number(request.params.idProduto || request.params.id);

    const produto = await prisma.product.findUnique({
      where: { idProduto },
    });

    if (!produto) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }

    if (produto.userId !== userIdDoToken) {
      return response.status(403).json({ message: "Acesso negado: este produto não pertence a você" });
    }

    next();
  } catch (error: any) {
    response.status(500).json({ message: error.message });
  }
}