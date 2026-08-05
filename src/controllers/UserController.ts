import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { Request, Response } from "express";
import { treeifyError } from "zod";
import UserValidator from "../config/userValidator";
import auth from "../config/auth";

export class UserController {
  public static async createUser(request: Request, response: Response) {
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

  public static async loginUser(request: Request, response: Response) {
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

  public static async readUser(request: Request, response: Response) {
    try {
      const { userId } = request.params;

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

      const { hash, salt, ...userWithoutPassword } = foundUser;

      response.status(200).json(userWithoutPassword);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async readAllUsers(request: Request, response: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          contato: true,
          foto: true,
        },
      });

      response.status(200).json(users);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async updateUser(request: Request, response: Response) {
    try {
      const validacao = UserValidator.updateUser.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { userId } = request.params;
      const { name, email, cpf, contato } = request.body;

      const updateInput: Prisma.UserUpdateInput = {
        name,
        email,
        cpf,
        contato,
      };

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

  public static async upsertUser(request: Request, response: Response) {
    try {
      const validacao = UserValidator.createUser.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { userId } = request.params;
      const { name, email, password, cpf, contato } = request.body;

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

      const updateInput: Prisma.UserUpdateInput = {
        name,
        email,
        hash,
        salt,
        cpf,
        contato,
        foto,
      };

      const upsertedUser = await prisma.user.upsert({
        create: createInput,
        update: updateInput,
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

      response.status(201).json(upsertedUser);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async deleteUser(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      const deletedUser = await prisma.user.delete({
        where: {
          id: Number(userId),
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      response.status(204).json(deletedUser);
    } catch (error: any) {
      if (error.code === "P2025") {
        return response.status(404).json({ message: "Usuário não encontrado" });
      }
      response.status(500).json({ message: error.message });
    }
  }

  public static async deleteAllUsers(request: Request, response: Response) {
    try {
      const deletedUser = await prisma.user.deleteMany();

      response.status(200).json(deletedUser);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }
}