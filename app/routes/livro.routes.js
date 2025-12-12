const express = require("express");
const router = express.Router();

const LivroController = require("../controllers/LivroController");
const ResenhaController = require("../controllers/ResenhaController");
const TokenValido = require("../middlewares/TokenValido");

// Protege tudo aqui 
router.use(TokenValido.check);

// CRUD de Livro
router.post("/", LivroController.criar);
router.get("/", LivroController.listar);
router.get("/:id", LivroController.buscarPorId);
router.put("/:id", LivroController.atualizar);
router.delete("/:id", LivroController.deletar);

// CRUD ANINHADO de Resenha
router.get("/:livro_id/resenhas", ResenhaController.listarPorLivro);
router.get("/:livro_id/resenhas/:id", ResenhaController.buscarPorIdDoLivro);

router.post("/:livro_id/resenhas", ResenhaController.criarParaLivro);

router.put("/:livro_id/resenhas/:id", ResenhaController.atualizarDoLivro);
router.delete("/:livro_id/resenhas/:id", ResenhaController.deletarDoLivro);

module.exports = router;
