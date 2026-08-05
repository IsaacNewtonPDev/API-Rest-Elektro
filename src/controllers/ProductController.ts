import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { Request, Response } from "express";
import { treeifyError } from "zod";
import ProdutoValidator from "../config/productValidator";

export class ProdutoController {
  public static async createProduto(request: Request, response: Response) {
    try {
      const validacao = ProdutoValidator.createProduto.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { name, descricao, preco, avaliacao, userId } = request.body;

      const imagem = request.file
        ? `uploads/photos/${request.file.filename}`
        : null;

      const createInput: Prisma.ProductCreateInput = {
        name,
        descricao,
        preco,
        avaliacao,
        imagem,
        user: {
          connect: { id: userId },
        },
      };

      const createdProduto = await prisma.product.create({
        data: createInput,
      });

      response.status(201).json(createdProduto);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async readProduto(request: Request, response: Response) {
    try {
      const { idProduto } = request.params;

      const foundProduto = await prisma.product.findUnique({
        where: {
          idProduto: Number(idProduto),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!foundProduto) {
        response.status(404).json({ message: "Produto não encontrado" });
        return;
      }

      response.status(200).json(foundProduto);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async readAllProdutos(request: Request, response: Response) {
    try {
      const produtos = await prisma.product.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      response.status(200).json(produtos);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async updateProduto(request: Request, response: Response) {
    try {
      const validacao = ProdutoValidator.updateProduto.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { idProduto } = request.params;
      const { name, descricao, preco, avaliacao, userId } = request.body;

      const updateInput: Prisma.ProductUpdateInput = {
        name,
        descricao,
        preco,
        avaliacao,
      };

      if (userId) {
        updateInput.user = {
          connect: { id: userId },
        };
      }

      if (request.file) {
        updateInput.imagem = `uploads/images/${request.file.filename}`;
      }

      const updatedProduto = await prisma.product.update({
        data: updateInput,
        where: {
          idProduto: Number(idProduto),
        },
      });

      response.status(200).json(updatedProduto);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async upsertProduto(request: Request, response: Response) {
    try {
      const validacao = ProdutoValidator.createProduto.safeParse(request.body);

      if (validacao.error) {
        response.status(400).json({ errors: treeifyError(validacao.error) });
        return;
      }

      const { idProduto } = request.params;
      const { name, descricao, preco, avaliacao, userId } = request.body;

      const imagem = request.file
        ? `uploads/images/${request.file.filename}`
        : null;

      const createInput: Prisma.ProductCreateInput = {
        name,
        descricao,
        preco,
        avaliacao,
        imagem,
        user: {
          connect: { id: userId },
        },
      };

      const updateInput: Prisma.ProductUpdateInput = {
        name,
        descricao,
        preco,
        avaliacao,
        imagem,
        user: {
          connect: { id: userId },
        },
      };

      const upsertedProduto = await prisma.product.upsert({
        create: createInput,
        update: updateInput,
        where: {
          idProduto: Number(idProduto),
        },
      });

      response.status(201).json(upsertedProduto);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async deleteProduto(request: Request, response: Response) {
    try {
      const { idProduto } = request.params;

      const deletedProduto = await prisma.product.delete({
        where: {
          idProduto: Number(idProduto),
        },
      });

      response.status(200).json(deletedProduto);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async deleteAllProdutos(request: Request, response: Response) {
    try {
      const deletedProdutos = await prisma.product.deleteMany();

      response.status(200).json(deletedProdutos);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }
}