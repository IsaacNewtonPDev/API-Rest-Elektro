import { Request } from "express";

export interface AuthRequest extends Request {
  token_user?: {
    id: number;
  };
}
/*
 Eu to usando o AuthRequest aqui porque ele estende o Request do Express me dando o campo `token_user`.
 
 O `token_user` tem o ID do usuário logado, que veio do token JWT pelo middleware `authenticateJWT`. Então,
 em vez de o controller ler o `userId` do body (onde o usuário poderia usar o ID de outra pessoa),
 ele pega do token, que é assinado e não pode ser falsificado.
 
 O `?` existe porque o TypeScript não sabe que o middleware `authenticateJWT` já bloqueia requisições sem token 
 antes de chegar no Controller, por isso quando ta acessando `token_user?.id` nos controllers, usei
 o `!` para avisar que o valor sempre vai existir.

 Em resumo, não to pegando mais id do usuário da request mas sim do token.
 */