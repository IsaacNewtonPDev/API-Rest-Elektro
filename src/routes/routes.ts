import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { ProdutoController } from "../controllers/ProductController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { validateBody, validateParams } from "../middlewares/ValidateMiddleware";
import UserValidator from "../config/userValidator";
import ProdutoValidator from "../config/productValidator";
import uploader from "../config/uploader";

const router = Router();

// USER ROTAS

router.post(
  "/user",
  uploader.single("foto"),
  validateBody(UserValidator.createUser),
  UserController.createUser,
);

router.post(
  "/user/login",
  validateBody(UserValidator.loginUser),
  UserController.loginUser,
);

router.get(
  "/user/:userId",
  authenticateJWT,
  validateParams(UserValidator.userParam),
  UserController.readUser,
);

router.get(
  "/users",
  authenticateJWT,
  UserController.readAllUsers,
);

router.put(
  "/user/:userId",
  authenticateJWT,
  uploader.single("foto"),
  validateBody(UserValidator.updateUser),
  validateParams(UserValidator.userParam),
  UserController.updateUser,
);

router.put(
  "/user/:userId/upsert",
  authenticateJWT,
  uploader.single("foto"),
  validateBody(UserValidator.updateUser),
  validateParams(UserValidator.userParam),
  UserController.upsertUser,
);

router.delete(
  "/user/:userId",
  authenticateJWT,
  validateParams(UserValidator.userParam),
  UserController.deleteUser,
);

router.delete("/users", authenticateJWT, UserController.deleteAllUsers);

// PRODUTO ROTAS

router.post(
  "/product",
  authenticateJWT,
  uploader.single("imagem"),
  validateBody(ProdutoValidator.createProduto),
  ProdutoController.createProduto,
);

router.get(
  "/product/:idProduto",
  authenticateJWT,
  validateParams(ProdutoValidator.produtoParam),
  ProdutoController.readProduto,
);

router.get(
  "/products",
  authenticateJWT,
  ProdutoController.readAllProdutos,
);

router.put(
  "/product/:idProduto",
  authenticateJWT,
  uploader.single("imagem"),
  validateBody(ProdutoValidator.updateProduto),
  validateParams(ProdutoValidator.produtoParam),
  ProdutoController.updateProduto,
);

router.put(
  "/product/:idProduto/upsert",
  authenticateJWT,
  uploader.single("imagem"),
  validateBody(ProdutoValidator.updateProduto),
  validateParams(ProdutoValidator.produtoParam),
  ProdutoController.upsertProduto,
);

router.delete(
  "/product/:idProduto",
  authenticateJWT,
  validateParams(ProdutoValidator.produtoParam),
  ProdutoController.deleteProduto,
);

router.delete("/products", authenticateJWT, ProdutoController.deleteAllProdutos);

export default router;