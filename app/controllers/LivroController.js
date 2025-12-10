// Cuida das rotas do Livro (CRUD) e faz a validação com Ajv.
const models = require("../models");

const LivroModel =
  models.livro.LivroModel || models.livro;

const ResenhaModel =
  models.resenha.ResenhaModel || models.resenha;

// Validação com Ajv
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

// Schema do Livro (sem ano_publicacao)
const schemaLivro = {
  type: "object",
  required: ["titulo", "autor", "isbn"],
  properties: {
    titulo: { type: "string", minLength: 1 },
    autor: { type: "string", minLength: 1 },
    genero: { type: "string", minLength: 1 },
    isbn: { type: "string", minLength: 3 },
  },
  additionalProperties: false,
};

const validateLivro = ajv.compile(schemaLivro);

const LivroController = {
  // POST /livros
  async criar(req, res) {
    const valido = validateLivro(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para livro",
        detalhes: validateLivro.errors,
      });
    }

    try {
      const { titulo, autor, genero, isbn } = req.body;

      const livro = await LivroModel.create({
        titulo,
        autor,
        genero,
        isbn,
      });

      return res.status(201).json(livro);
    } catch (error) {
      console.error(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ erro: "ISBN já cadastrado" });
      }
      return res.status(500).json({ erro: "Erro ao criar livro" });
    }
  },

  // GET /livros
  async listar(req, res) {
    try {
      const livros = await LivroModel.findAll();
      return res.json(livros);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao listar livros" });
    }
  },

  // GET /livros/:id
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const livro = await LivroModel.findByPk(id);

      if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      return res.json(livro);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao buscar livro" });
    }
  },

  // PUT /livros/:id
  async atualizar(req, res) {
    const valido = validateLivro(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para livro",
        detalhes: validateLivro.errors,
      });
    }

    try {
      const { id } = req.params;
      const { titulo, autor, genero, isbn } = req.body;

      const [linhasAfetadas] = await LivroModel.update(
        { titulo, autor, genero, isbn },
        { where: { id } }
      );

      if (linhasAfetadas === 0) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      const livroAtualizado = await LivroModel.findByPk(id);
      return res.json(livroAtualizado);
    } catch (error) {
      console.error(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ erro: "ISBN já cadastrado" });
      }
      return res.status(500).json({ erro: "Erro ao atualizar livro" });
    }
  },

  // DELETE /livros/:id
  async deletar(req, res) {
    try {
      const { id } = req.params;

      // não permitir excluir livro com resenhas vinculadas
      const qtdResenhas = await ResenhaModel.count({
        where: { livro_id: id },
      });

      if (qtdResenhas > 0) {
        return res.status(409).json({
          erro: "Não é possível excluir livro com resenhas vinculadas",
        });
      }

      const apagados = await LivroModel.destroy({ where: { id } });

      if (apagados === 0) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao deletar livro" });
    }
  },
};

module.exports = LivroController;
