const express = require("express");
const router = express.Router();
const ResenhaController = require("../controllers/ResenhaController");
const TokenValido = require("../middlewares/TokenValido");

// Se quiser proteger tudo:
router.use(TokenValido.check);

router.post("/", ResenhaController.criar);           // criar
router.get("/", ResenhaController.listar);           // listar todos
router.get("/:id", ResenhaController.buscarPorId);   // buscar 1
router.put("/:id", ResenhaController.atualizar);     // atualizar
router.delete("/:id", ResenhaController.deletar);    // deletar

module.exports = router;
