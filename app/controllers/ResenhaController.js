const models = require("../models");

const ResenhaModel =
  models.resenha.ResenhaModel || models.resenha;

const LivroModel =
  models.livro.LivroModel || models.livro;

const UsuarioModel =
  models.usuario.UsuarioModel || models.usuario;

// Ajv
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

// Schema Resenha
const schemaResenha = {
  type: "object",
  required: ["titulo", "conteudo", "nota"], // mantém simples
  properties: {
    titulo: { type: "string", minLength: 1 },
    conteudo: { type: "string", minLength: 1 },
    nota: { type: "integer"}, // opcional, mas validaremos faixa se vier
    livro_id: { type: "integer"},
    usuario_id: { type: "integer" },
  },
  additionalProperties: false,
};

const validateResenha = ajv.compile(schemaResenha);

const ResenhaController = {
  // POST /resenhas
  async criar(req, res) {
    const valido = validateResenha(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para resenha",
        detalhes: validateResenha.errors,
      });
    }

    try {
      const { titulo, conteudo, nota, livro_id, usuario_id } = req.body;

      if (!livro_id) {
        return res.status(400).json({ erro: "livro_id é obrigatório" });
      }

      if (!usuario_id) {
        return res.status(400).json({ erro: "usuario_id é obrigatório" });
      }

      // valida nota (se enviada)
      if (nota !== undefined && nota !== null) {
        const n = Number(nota);
        if (Number.isNaN(n) || n < 1 || n > 5) {
          return res.status(400).json({ erro: "nota deve ser entre 1 e 5" });
        }
      }

      // verifica se o livro existe
      const livro = await LivroModel.findByPk(livro_id);
      if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      // verifica se o usuário existe
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
    const valido = validateResenha(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para resenha",
        detalhes: validateResenha.errors,
      });
    }

    try {
      const { id } = req.params;
      const { titulo, conteudo, nota, livro_id, usuario_id } = req.body;

      // valida nota (se enviada)
      if (nota !== undefined && nota !== null) {
        const n = Number(nota);
        if (Number.isNaN(n) || n < 1 || n > 5) {
          return res.status(400).json({ erro: "nota deve ser entre 1 e 5" });
        }
      }

      if (livro_id) {
        const livro = await LivroModel.findByPk(livro_id);
        if (!livro) {
          return res.status(404).json({ erro: "Livro não encontrado" });
        }
      }

      if (usuario_id) {
        const usuario = await UsuarioModel.findByPk(usuario_id);
        if (!usuario) {
          return res.status(404).json({ erro: "Usuário não encontrado" });
        }
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

  // ========== ROTAS ANINHADAS ==========
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
    const valido = validateResenha(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para resenha",
        detalhes: validateResenha.errors,
      });
    }

    try {
      const { livro_id } = req.params;
      const { titulo, conteudo, nota, usuario_id } = req.body;

      if (!usuario_id) {
        return res.status(400).json({ erro: "usuario_id é obrigatório" });
      }

      // valida nota (se enviada)
      if (nota !== undefined && nota !== null) {
        const n = Number(nota);
        if (Number.isNaN(n) || n < 1 || n > 5) {
          return res.status(400).json({ erro: "nota deve ser entre 1 e 5" });
        }
      }

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
};

module.exports = ResenhaController;
