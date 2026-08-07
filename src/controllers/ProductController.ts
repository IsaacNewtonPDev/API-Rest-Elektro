import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { Response } from "express";
import ProdutoValidator from "../config/productValidator";
import { AuthRequest } from "../config/AuthRequest";

export class ProdutoController {
  public static async createProduto(request: AuthRequest, response: Response) {
    try {
      const { name, descricao, preco, avaliacao, categoria } = ProdutoValidator.createProduto.parse(request.body);
      const userId = request.token_user?.id;

      const imagem = request.file
        ? `uploads/products/${request.file.filename}`
        : null;

      const createInput: Prisma.ProductCreateInput = {
        name,
        descricao,
        preco,
        categoria,
        imagem,
        user: {
          connect: { id: userId! },
        },
      };

      if (avaliacao !== undefined) {
        createInput.avaliacao = avaliacao;
      }

      const createdProduto = await prisma.product.create({
        data: createInput,
      });

      response.status(201).json(createdProduto);
    } catch (error: any) {
      if (error.code === "P2025") {
        return response.status(400).json({ message: "userId não encontrado" });
      }
      response.status(500).json({ message: error.message });
    }
  }

  public static async readProduto(request: AuthRequest, response: Response) {
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
              contato: true,
              foto: true,
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

  public static async readAllProdutos(request: AuthRequest, response: Response) {
    try {
      const produtos = await prisma.product.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contato: true,
              foto: true,
            },
          },
        },
      });

      response.status(200).json(produtos);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async updateProduto(request: AuthRequest, response: Response) {
    try {
      const { idProduto } = request.params;
      const { name, descricao, preco, avaliacao, categoria } = ProdutoValidator.updateProduto.parse(request.body);

      const updateInput: Prisma.ProductUpdateInput = {};

      if (name !== undefined) updateInput.name = name;
      if (descricao !== undefined) updateInput.descricao = descricao;
      if (preco !== undefined) updateInput.preco = preco;
      if (avaliacao !== undefined) updateInput.avaliacao = avaliacao;
      if (categoria !== undefined) updateInput.categoria = categoria;

      if (request.file) {
        updateInput.imagem = `uploads/products/${request.file.filename}`;
      }

      const updatedProduto = await prisma.product.update({
        data: updateInput,
        where: {
          idProduto: Number(idProduto),
        },
      });

      response.status(200).json(updatedProduto);
    } catch (error: any) {
      if (error.code === "P2025") {
        return response.status(404).json({ message: "Produto não encontrado" });
      }
      response.status(500).json({ message: error.message });
    }
  }

  public static async upsertProduto(request: AuthRequest, response: Response) {
    try {
      const { idProduto } = request.params;
      const userId = request.token_user?.id;
      const { name, descricao, preco, avaliacao, categoria } = ProdutoValidator.createProduto.parse(request.body);

      const createInput: Prisma.ProductCreateInput = {
        name,
        descricao,
        preco,
        categoria,
        user: { connect: { id: userId! } },
      };

      if (avaliacao !== undefined) {
        createInput.avaliacao = avaliacao;
      }

      if (request.file) {
        createInput.imagem = `uploads/images/${request.file.filename}`;
      }

      const updateInput: Prisma.ProductUpdateInput = {
        name,
        descricao,
        preco,
        categoria,
      };

      if (avaliacao !== undefined) {
        updateInput.avaliacao = avaliacao;
      }

      if (request.file) {
        updateInput.imagem = `uploads/images/${request.file.filename}`;
      }

      const upsertedProduto = await prisma.product.upsert({
        where: { idProduto: Number(idProduto) },
        create: createInput,
        update: updateInput,
      });

      response.status(200).json(upsertedProduto);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }

  public static async deleteProduto(request: AuthRequest, response: Response) {
    try {
      const { idProduto } = request.params;

      await prisma.product.delete({
        where: {
          idProduto: Number(idProduto),
        },
      });

      response.status(204).send();
    } catch (error: any) {
      if (error.code === "P2025") {
        return response.status(404).json({ message: "Produto não encontrado" });
      }
      response.status(500).json({ message: error.message });
    }
  }

  public static async deleteAllProdutos(request: AuthRequest, response: Response) {
    try {
      const userId = request.token_user?.id;

      const deletedProdutos = await prisma.product.deleteMany({
        where: { userId: userId! },
      });

      response.status(200).json(deletedProdutos);
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }
}