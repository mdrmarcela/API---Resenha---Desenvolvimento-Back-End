const express = require("express");
const router = express.Router();

const LivroController = require("../controllers/LivroController");
const ResenhaController = require("../controllers/ResenhaController");
const TokenValido = require("../middlewares/TokenValido");

// Se quiser proteger tudo de livro/resenha:
router.use(TokenValido.check);

// CRUD de Livro
router.post("/", LivroController.criar);
router.get("/", LivroController.listar);
router.get("/:id", LivroController.buscarPorId);
router.put("/:id", LivroController.atualizar);
router.delete("/:id", LivroController.deletar);

// ROTAS ANINHADAS DE RESENHA
// GET /livros/:livro_id/resenhas
router.get("/:livro_id/resenhas", ResenhaController.listarPorLivro);

// POST /livros/:livro_id/resenhas
router.post("/:livro_id/resenhas", ResenhaController.criarParaLivro);

module.exports = router;
