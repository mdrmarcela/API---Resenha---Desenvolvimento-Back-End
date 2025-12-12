const models = require("../models");

const ResenhaModel = models.resenha.ResenhaModel || models.resenha;
const LivroModel = models.livro.LivroModel || models.livro;
const UsuarioModel = models.usuario.UsuarioModel || models.usuario;

// Ajv
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

// ===== SCHEMAS =====

// Base para rotas aninhadas (livro_id vem da URL)
const schemaResenhaNested = {
  type: "object",
  required: ["titulo", "conteudo", "nota", "usuario_id"],
  properties: {
    titulo: { type: "string", minLength: 1 },
    conteudo: { type: "string", minLength: 1 },
    nota: { type: "integer", minimum: 1, maximum: 5 },
    usuario_id: { type: "integer" },
  },
  additionalProperties: false,
};

// Para rotas planas (/resenhas) — aceita livro_id no body
const schemaResenhaFlat = {
  type: "object",
  required: ["titulo", "conteudo", "nota", "livro_id", "usuario_id"],
  properties: {
    titulo: { type: "string", minLength: 1 },
    conteudo: { type: "string", minLength: 1 },
    nota: { type: "integer", minimum: 1, maximum: 5 },
    livro_id: { type: "integer" },
    usuario_id: { type: "integer" },
  },
  additionalProperties: false,
};

const validateResenhaNested = ajv.compile(schemaResenhaNested);
const validateResenhaFlat = ajv.compile(schemaResenhaFlat);

const ResenhaController = {
  
  // ===================== ROTAS PLANAS =====================
  // POST /resenhas
  async criar(req, res) {
    const valido = validateResenhaFlat(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para resenha",
        detalhes: validateResenhaFlat.errors,
      });
    }

    try {
      const { titulo, conteudo, nota, livro_id, usuario_id } = req.body;

      const livro = await LivroModel.findByPk(livro_id);
      if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      const usuario = await UsuarioModel.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const resenha = await ResenhaModel.create({
        titulo,
        conteudo,
        nota,
        livro_id,
        usuario_id,
      });

      return res.status(201).json(resenha);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao criar resenha" });
    }
  },

  // GET /resenhas
  async listar(req, res) {
    try {
      const resenhas = await ResenhaModel.findAll();
      return res.json(resenhas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao listar resenhas" });
    }
  },

  // GET /resenhas/:id
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const resenha = await ResenhaModel.findByPk(id);

      if (!resenha) {
        return res.status(404).json({ erro: "Resenha não encontrada" });
      }

      return res.json(resenha);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao buscar resenha" });
    }
  },

  // PUT /resenhas/:id
  async atualizar(req, res) {
    const valido = validateResenhaFlat(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para resenha",
        detalhes: validateResenhaFlat.errors,
      });
    }

    try {
      const { id } = req.params;
      const { titulo, conteudo, nota, livro_id, usuario_id } = req.body;

      const livro = await LivroModel.findByPk(livro_id);
      if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      const usuario = await UsuarioModel.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const [linhasAfetadas] = await ResenhaModel.update(
        { titulo, conteudo, nota, livro_id, usuario_id },
        { where: { id } }
      );

      if (linhasAfetadas === 0) {
        return res.status(404).json({ erro: "Resenha não encontrada" });
      }

      const resenhaAtualizada = await ResenhaModel.findByPk(id);
      return res.json(resenhaAtualizada);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao atualizar resenha" });
    }
  },

  // DELETE /resenhas/:id
  async deletar(req, res) {
    try {
      const { id } = req.params;

      const apagados = await ResenhaModel.destroy({ where: { id } });

      if (apagados === 0) {
        return res.status(404).json({ erro: "Resenha não encontrada" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao deletar resenha" });
    }
  },

  // ===================== ROTAS ANINHADAS =====================
  // GET /livros/:livro_id/resenhas
  async listarPorLivro(req, res) {
    try {
      const { livro_id } = req.params;

      const livro = await LivroModel.findByPk(livro_id);
      if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      const resenhas = await ResenhaModel.findAll({
        where: { livro_id },
      });

      return res.json(resenhas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao listar resenhas do livro" });
    }
  },

  // POST /livros/:livro_id/resenhas
  async criarParaLivro(req, res) {
    const valido = validateResenhaNested(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para resenha",
        detalhes: validateResenhaNested.errors,
      });
    }

    try {
      const { livro_id } = req.params;
      const { titulo, conteudo, nota, usuario_id } = req.body;

      const livro = await LivroModel.findByPk(livro_id);
      if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      const usuario = await UsuarioModel.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const resenha = await ResenhaModel.create({
        titulo,
        conteudo,
        nota,
        livro_id,
        usuario_id,
      });

      return res.status(201).json(resenha);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao criar resenha para livro" });
    }
  },

  // GET /livros/:livro_id/resenhas/:id
  async buscarPorIdDoLivro(req, res) {
    try {
      const { livro_id, id } = req.params;

      const resenha = await ResenhaModel.findOne({
        where: { id, livro_id },
      });

      if (!resenha) {
        return res.status(404).json({
          erro: "Resenha não encontrada para este livro",
        });
      }

      return res.json(resenha);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao buscar resenha do livro" });
    }
  },

  // PUT /livros/:livro_id/resenhas/:id
  async atualizarDoLivro(req, res) {
    const valido = validateResenhaNested(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para resenha",
        detalhes: validateResenhaNested.errors,
      });
    }

    try {
      const { livro_id, id } = req.params;
      const { titulo, conteudo, nota, usuario_id } = req.body;

      const livro = await LivroModel.findByPk(livro_id);
      if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      const usuario = await UsuarioModel.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const [linhas] = await ResenhaModel.update(
        { titulo, conteudo, nota, usuario_id },
        { where: { id, livro_id } }
      );

      if (linhas === 0) {
        return res.status(404).json({
          erro: "Resenha não encontrada para este livro",
        });
      }

      const resenhaAtualizada = await ResenhaModel.findOne({
        where: { id, livro_id },
      });

      return res.json(resenhaAtualizada);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao atualizar resenha do livro" });
    }
  },

  // DELETE /livros/:livro_id/resenhas/:id
  async deletarDoLivro(req, res) {
    try {
      const { livro_id, id } = req.params;

      const apagados = await ResenhaModel.destroy({
        where: { id, livro_id },
      });

      if (apagados === 0) {
        return res.status(404).json({
          erro: "Resenha não encontrada para este livro",
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao deletar resenha do livro" });
    }
  },
};

module.exports = ResenhaController;
