const models = require('../models');
const UsuarioModel = models.usuario.UsuarioModel || models.usuario;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config.js'); 

// ===== AJV (validação) =====
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

// schema para CADASTRO
const schemaCadastroUsuario = {
  type: 'object',
  required: ['nome', 'email', 'senha'],
  properties: {
    nome: { type: 'string', minLength: 1 },
    email: {
      type: 'string',
      minLength: 5,
      pattern: '^.+@.+\\..+$',
    },
    senha: { type: 'string', minLength: 6 },
  },
  additionalProperties: false,
};

// schema para LOGIN
const schemaLoginUsuario = {
  type: 'object',
  required: ['email', 'senha'],
  properties: {
    email: {
      type: 'string',
      minLength: 5,
      pattern: '^.+@.+\\..+$',
    },
    senha: { type: 'string', minLength: 6 },
  },
  additionalProperties: false,
};

const validateCadastro = ajv.compile(schemaCadastroUsuario);
const validateLogin = ajv.compile(schemaLoginUsuario);

const UsuarioController = {
  // POST /usuarios  (cadastro)
  async criar(req, res) {
    // valida com Ajv
    const valido = validateCadastro(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: 'Dados inválidos para cadastro',
        detalhes: validateCadastro.errors,
      });
    }

    try {
      const { nome, email, senha } = req.body;

      // evita cadastro duplicado
      const usuarioExistente = await UsuarioModel.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(409).json({ erro: 'E-mail já cadastrado' });
      }

      // senha será hasheada pelo hook do model (beforeCreate)
      const usuario = await UsuarioModel.create({ nome, email, senha });

      // gera token JWT
      const payload = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      };

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn || '1h',
      });

      // remove a senha da resposta
      const { senha: _senha, ...usuarioSemSenha } = usuario.toJSON();

      return res.status(201).json({
        usuario: usuarioSemSenha,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
  },

  // POST /usuarios/login  (login + geração do token)
  async login(req, res) {
    // valida com Ajv
    const valido = validateLogin(req.body);
    if (!valido) {
      return res.status(400).json({
        erro: 'Dados inválidos para login',
        detalhes: validateLogin.errors,
      });
    }

    try {
      const { email, senha } = req.body;

      const usuario = await UsuarioModel.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const senhaConfere = await bcrypt.compare(senha, usuario.senha);
      if (!senhaConfere) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const payload = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      };

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn || '1h',
      });

      const { senha: _senha, ...usuarioSemSenha } = usuario.toJSON();

      return res.json({
        usuario: usuarioSemSenha,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao realizar login' });
    }
  },

  // GET /usuarios  (vamos deixar protegido com JWT)
  async listar(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll({
        attributes: { exclude: ['senha'] },
      });
      return res.json(usuarios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  },
};

module.exports = UsuarioController;
