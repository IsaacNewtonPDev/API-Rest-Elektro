import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { Response } from "express";
import { treeifyError } from "zod";
import UserValidator from "../config/userValidator";
import auth from "../config/auth";
import { AuthRequest } from "../config/AuthRequest";

export class UserController {
public static async createUser(request: AuthRequest, response: Response) {
    try {
      const validacao = UserValidator.createUser.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { name, email, password, cpf, contato } = request.body;

      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        response.status(409).json({ message: "E-mail já cadastrado" });
        return;
      }

      const existingCpf = await prisma.user.findUnique({
        where: { cpf },
      });

      if (existingCpf) {
        response.status(409).json({ message: "CPF já cadastrado" });
        return;
      }

      const existingContato = await prisma.user.findUnique({
        where: { contato },
      });

      if (existingContato) {
        response.status(409).json({ message: "Contato já cadastrado" });
        return;
      }

      const { salt, hash } = auth.generatePassword(password);

      const foto = request.file
        ? `uploads/photos/${request.file.filename}`
        : null;

      const createInput: Prisma.UserCreateInput = {
        name,
        email,
        hash,
        salt,
        cpf,
        contato,
        foto,
      };

      const createdUser = await prisma.user.create({
        data: createInput,
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          contato: true,
          foto: true,
        },
      });

      response.status(201).json(createdUser);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async loginUser(request: AuthRequest, response: Response) {
    try {
      const validacao = UserValidator.loginUser.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { email, password } = request.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        response.status(401).json({ message: "Email ou senha incorreta" });
        return;
      }

      const passwordMatch = auth.checkPassword(password, user.hash, user.salt);

      if (!passwordMatch) {
        response.status(401).json({ message: "Email ou senha incorreta" });
        return;
      }

      const token = auth.generateJWT(user.id);

      response.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          cpf: user.cpf,
          contato: user.contato,
          foto: user.foto,
        },
        token,
      });
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async readUser(request: AuthRequest, response: Response) {
    try {
      const { userId } = request.params;
      const userIdDoToken = request.token_user?.id;

      const foundUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        include: {
          produtos: true,
        },
      });

      if (!foundUser) {
        response.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      if (Number(userId) === Number(userIdDoToken)) {
        const { hash, salt, ...userWithoutPassword } = foundUser;
        response.status(200).json(userWithoutPassword);
        return;
      }

      response.status(200).json({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        contato: foundUser.contato,
        foto: foundUser.foto,
        produtos: foundUser.produtos,
      });
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async readAllUsers(request: AuthRequest, response: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          contato: true,
          foto: true,
        },
      });

      response.status(200).json(users);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async updateUser(request: AuthRequest, response: Response) {
    try {
      const validacao = UserValidator.updateUser.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { userId } = request.params;
      const { name, email, cpf, contato, password } = validacao.data;

      const updateInput: Prisma.UserUpdateInput = {};

      if (name !== undefined) updateInput.name = name;
      if (email !== undefined) updateInput.email = email;
      if (cpf !== undefined) updateInput.cpf = cpf;
      if (contato !== undefined) updateInput.contato = contato;

      if (password) {
        const { salt, hash } = auth.generatePassword(password);
        updateInput.hash = hash;
        updateInput.salt = salt;
      }

      if (request.file) {
        updateInput.foto = `uploads/photos/${request.file.filename}`;
      }

      const updatedUser = await prisma.user.update({
        data: updateInput,
        where: {
          id: Number(userId),
        },
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          contato: true,
          foto: true,
        },
      });

      response.status(200).json(updatedUser);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async upsertUser(request: AuthRequest, response: Response) {
    try {
      const validacao = UserValidator.createUser.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { userId } = request.params;
      const { name, email, password, cpf, contato } = validacao.data;

      const { salt, hash } = auth.generatePassword(password);

      const createInput: Prisma.UserCreateInput = {
        name,
        email,
        hash,
        salt,
        cpf,
        contato,
      };

      const updateInput: Prisma.UserUpdateInput = {
        name,
        email,
        hash,
        salt,
        cpf,
        contato,
      };

      if (request.file) {
        createInput.foto = `uploads/photos/${request.file.filename}`;
        updateInput.foto = `uploads/photos/${request.file.filename}`;
      }

      const upsertedUser = await prisma.user.upsert({
        where: { id: Number(userId) },
        create: createInput,
        update: updateInput,
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          contato: true,
          foto: true,
        },
      });

      response.status(200).json(upsertedUser);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async deleteUser(request: AuthRequest, response: Response) {
    try {
      const { userId } = request.params;

      await prisma.user.delete({
        where: {
          id: Number(userId),
        },
      });

      response.status(204).send();
    } catch (error: any) {
      if (error.code === "P2025") {
        return response.status(404).json({ message: "Usuário não encontrado" });
      }
      response.status(500).json({ message: error.message });
    }
  }

  public static async deleteAllUsers(request: AuthRequest, response: Response) {
    try {
      const userId = request.token_user?.id;

      const deletedUser = await prisma.user.deleteMany({
        where: { id: userId! },
      });

      response.status(200).json(deletedUser);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }
}