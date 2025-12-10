//Cuida das rotas do Advogado (CRUD) e faz a validação com Ajv. 
const models = require('../models');
const AdvogadoModel =
  models.advogado.AdvogadoModel || models.advogado;
const ProcessoModel =
  models.processo.ProcessoModel || models.processo;

// Validação com Ajv 
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

//Explica como o corpo do req.body precisa ser. 
const schemaAdvogado = {
  type: 'object',
  required: ['nome', 'oab', 'especialidade'],
  properties: {
    nome: { type: 'string', minLength: 1 },
    oab: { type: 'string', minLength: 3 },
    especialidade: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
};

const validateAdvogado = ajv.compile(schemaAdvogado); //Validação 

const AdvogadoController = {
  // POST /advogados
  async criar(req, res) {
    // valida com Ajv
    const valido = validateAdvogado(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: 'Dados inválidos para advogado',
        detalhes: validateAdvogado.errors,
      });
    }

    try {
      const { nome, oab, especialidade } = req.body;

      const advogado = await AdvogadoModel.create({ nome, oab, especialidade }); //Chama o create para gravar no BD. 
      return res.status(201).json(advogado);
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ erro: 'OAB já cadastrada' });
      }
      return res.status(500).json({ erro: 'Erro ao criar advogado' });
    }
  },

  // GET /advogados
  async listar(req, res) {
    try {
      const advogados = await AdvogadoModel.findAll();
      return res.json(advogados);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao listar advogados' });
    }
  },

  // GET /advogados/:id
  async buscarPorId(req, res) {
    try {
      const { id } = req.params; //Pega o id da url.
      const advogado = await AdvogadoModel.findByPk(id); //Busca pela PK. 

      if (!advogado) {
        return res.status(404).json({ erro: 'Advogado não encontrado' });
      }

      return res.json(advogado); //Achou, retorna o advogado.
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao buscar advogado' });
    }
  },

  // PUT /advogados/:id
  async atualizar(req, res) {
    // valida com Ajv
    const valido = validateAdvogado(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: 'Dados inválidos para advogado',
        detalhes: validateAdvogado.errors,
      });
    }

    try {
      const { id } = req.params;
      const { nome, oab, especialidade } = req.body;

      const [linhasAfetadas] = await AdvogadoModel.update(
        { nome, oab, especialidade },
        { where: { id } }
      );

      if (linhasAfetadas === 0) { //Ninguém com esse id 
        return res.status(404).json({ erro: 'Advogado não encontrado' });
      }

      const advogadoAtualizado = await AdvogadoModel.findByPk(id); //Busca atualizado 
      return res.json(advogadoAtualizado); //Devolde o advogado atualizado 
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ erro: 'OAB já cadastrada' });
      }
      return res.status(500).json({ erro: 'Erro ao atualizar advogado' });
    }
  },

  // DELETE /advogados/:id
  async deletar(req, res) {
    try {
      const { id } = req.params;

      // não permitir excluir advogado com processos vinculados
      const qtdProcessos = await ProcessoModel.count({
        where: { id_advogado: id },
      });

      if (qtdProcessos > 0) {
        return res.status(409).json({
          erro: 'Não é possível excluir advogado com processos vinculados',
        });
      }

      const apagados = await AdvogadoModel.destroy({ where: { id } }); //Deleta o advogado. 

      if (apagados === 0) {
        return res.status(404).json({ erro: 'Advogado não encontrado' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao deletar advogado' });
    }
  },
};

module.exports = AdvogadoController;
