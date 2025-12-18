const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const TokenValido = require('../middlewares/TokenValido');


router.post('/', UsuarioController.criar);
router.post('/login', UsuarioController.login);
router.get('/', TokenValido.check, UsuarioController.listar);
router.delete("/:id", TokenValido.check, UsuarioController.deletar); 
router.put("/:id", TokenValido.check, UsuarioController.atualizar);

module.exports = router;