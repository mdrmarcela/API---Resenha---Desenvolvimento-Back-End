const models = require("../models");
const UsuarioModel = models.usuario.UsuarioModel || models.usuario;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config.js");

// ===== AJV (validação) =====
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

// schema para CADASTRO
const schemaCadastroUsuario = {
  type: "object",
  required: ["nome", "email", "senha"],
  properties: {
    nome: { type: "string", minLength: 1 },
    email: { type: "string", minLength: 5, pattern: "^.+@.+\\..+$" },
    senha: { type: "string", minLength: 6 },
  },
  additionalProperties: false,
};

// schema para LOGIN
const schemaLoginUsuario = {
  type: "object",
  required: ["email", "senha"],
  properties: {
    email: { type: "string", minLength: 5, pattern: "^.+@.+\\..+$" },
    senha: { type: "string", minLength: 6 },
  },
  additionalProperties: false,
};

// schema para UPDATE (senha opcional)
const schemaUpdateUsuario = {
  type: "object",
  required: ["nome", "email"],
  properties: {
    nome: { type: "string", minLength: 1 },
    email: { type: "string", minLength: 5, pattern: "^.+@.+\\..+$" },
    senha: { type: "string", minLength: 6 }, // opcional
  },
  additionalProperties: false,
};

const validateCadastro = ajv.compile(schemaCadastroUsuario);
const validateLogin = ajv.compile(schemaLoginUsuario);
const validateUpdate = ajv.compile(schemaUpdateUsuario);

const UsuarioController = {
  // POST /usuarios  (cadastro)
  async criar(req, res) {
    const valido = validateCadastro(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para cadastro",
        detalhes: validateCadastro.errors,
      });
    }

    try {
      const { nome, email, senha } = req.body;

      const usuarioExistente = await UsuarioModel.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(409).json({ erro: "E-mail já cadastrado" });
      }

      // Se seu model já hasheia no beforeCreate, OK.
      // Se NÃO hasheia, descomente esta linha e remova o hook do model:
      // const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = await UsuarioModel.create({ nome, email, senha /* senha: senhaHash */ });

      const payload = { id: usuario.id, email: usuario.email, nome: usuario.nome };
      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn || "1h",
      });

      const { senha: _senha, ...usuarioSemSenha } = usuario.toJSON();

      return res.status(201).json({ usuario: usuarioSemSenha, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  },

  // POST /usuarios/login
  async login(req, res) {
    const valido = validateLogin(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para login",
        detalhes: validateLogin.errors,
      });
    }

    try {
      const { email, senha } = req.body;

      const usuario = await UsuarioModel.findOne({ where: { email } });
      if (!usuario) return res.status(401).json({ erro: "Credenciais inválidas" });

      const senhaConfere = await bcrypt.compare(senha, usuario.senha);
      if (!senhaConfere) return res.status(401).json({ erro: "Credenciais inválidas" });

      const payload = { id: usuario.id, email: usuario.email, nome: usuario.nome };
      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn || "1h",
      });

      const { senha: _senha, ...usuarioSemSenha } = usuario.toJSON();

      return res.json({ usuario: usuarioSemSenha, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao realizar login" });
    }
  },

  // GET /usuarios
  async listar(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll({
        attributes: { exclude: ["senha"] },
      });
      return res.json(usuarios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao listar usuários" });
    }
  },

  // DELETE /usuarios/:id
  async deletar(req, res) {
    try {
      const { id } = req.params;

      const apagados = await UsuarioModel.destroy({ where: { id } });
      if (!apagados) return res.status(404).json({ erro: "Usuário não encontrado" });

      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao deletar usuário" });
    }
  }, // ✅ vírgula aqui era obrigatória

  // PUT /usuarios/:id
  async atualizar(req, res) {
    const valido = validateUpdate(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: "Dados inválidos para atualizar usuário",
        detalhes: validateUpdate.errors,
      });
    }

    try {
      const { id } = req.params;
      const idNum = Number(id);

      // ✅ (OPCIONAL e recomendado) só permite editar a própria conta
      // precisa do TokenValido.check colocando req.user = decoded
      if (req.user?.id && Number(req.user.id) !== idNum) {
        return res.status(403).json({ erro: "Você não pode editar outro usuário" });
      }

      const { nome, email, senha } = req.body;

      const usuario = await UsuarioModel.findByPk(idNum);
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

      // evita email duplicado (ignorando o próprio usuário)
      const usuarioExistente = await UsuarioModel.findOne({ where: { email } });
      if (usuarioExistente && Number(usuarioExistente.id) !== idNum) {
        return res.status(409).json({ erro: "E-mail já cadastrado" });
      }

      // Atualiza campos
      usuario.nome = nome;
      usuario.email = email;

      // ✅ Se veio senha, HASHEIA (porque beforeCreate não cobre update)
      if (senha && senha.trim()) {
        usuario.senha = await bcrypt.hash(senha, 10);
      }

      await usuario.save();

      const { senha: _senha, ...usuarioSemSenha } = usuario.toJSON();
      return res.json(usuarioSemSenha);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
  },
};

module.exports = UsuarioController;
