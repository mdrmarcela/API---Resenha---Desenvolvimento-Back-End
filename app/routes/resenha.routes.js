const express = require("express");
const router = express.Router();

const LivroController = require("../controllers/LivroController");
const TokenValido = require("../middlewares/TokenValido");
const ResenhasRoutes = require("./resenhas.routes");

router.use(TokenValido.check);

// CRUD de Livro
router.post("/", LivroController.criar);
router.get("/", LivroController.listar);
router.get("/:id", LivroController.buscarPorId);
router.put("/:id", LivroController.atualizar);
router.delete("/:id", LivroController.deletar);

// Monta as resenhas aninhadas
router.use("/:livro_id/resenhas", ResenhasRoutes);

module.exports = router;
