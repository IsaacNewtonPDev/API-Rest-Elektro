import { Response, NextFunction } from "express";
import { AuthRequest } from "../config/AuthRequest";

export function checkUserOwner(request: AuthRequest, response: Response, next: NextFunction) {
  const userIdDoToken = request.token_user?.id;
  const userIdDaURL = Number(request.params.userId || request.params.id);

  if (userIdDoToken !== userIdDaURL) {
    return response.status(403).json({ message: "Acesso negado: você não pode acessar dados de outro usuário" });
  }

  next();
}