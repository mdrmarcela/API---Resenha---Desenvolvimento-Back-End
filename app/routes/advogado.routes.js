const express = require('express');
const router = express.Router();
const AdvogadoController = require('../controllers/AdvogadoController');
const ProcessoController = require('../controllers/ProcessoController');
const TokenValido = require('../middlewares/TokenValido');

// CRUD
router.post('/', AdvogadoController.criar);           // criar
router.get('/', AdvogadoController.listar);           // listar todos
router.get('/:id', AdvogadoController.buscarPorId);   // buscar 1
router.put('/:id', AdvogadoController.atualizar);     // atualizar
router.delete('/:id', AdvogadoController.deletar);    // deletar

// ROTAS ANINHADAS DE PROCESSO
// GET /advogados/:id_advogado/processos
router.get('/:id_advogado/processos', ProcessoController.listarPorAdvogado);

// POST /advogados/:id_advogado/processos
router.post('/:id_advogado/processos', ProcessoController.criarParaAdvogado);

module.exports = router;
