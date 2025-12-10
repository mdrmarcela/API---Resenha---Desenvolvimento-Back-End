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

module.exports = router;
