const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const TokenValido = require('../middlewares/TokenValido');

// criar usuário (público)
router.post('/', UsuarioController.criar);

// login (público)
router.post('/login', UsuarioController.login);

// listar usuários (protegido por JWT)
router.get('/', TokenValido.check, UsuarioController.listar);

// deletar usuário (protegido por JWT)
router.delete("/:id", TokenValido.check, UsuarioController.deletar); 

// atualizar usuário (protegido)
router.put("/:id", TokenValido.check, UsuarioController.atualizar);

module.exports = router;
