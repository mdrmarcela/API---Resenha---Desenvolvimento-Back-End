const Sequelize = require("sequelize");
const db = require("./conexao.js");

class Resenha {
  #titulo;
  #conteudo;
  #nota;
  #livro_id;
  #usuario_id;

  constructor() {}

  get titulo() {
    return this.#titulo;
  }
  set titulo(t) {
    this.#titulo = t;
  }

  get conteudo() {
    return this.#conteudo;
  }
  set conteudo(c) {
    this.#conteudo = c;
  }

  get nota() {
    return this.#nota;
  }
  set nota(n) {
    this.#nota = n;
  }

  get livro_id() {
    return this.#livro_id;
  }
  set livro_id(id) {
    this.#livro_id = id;
  }

  get usuario_id() {
    return this.#usuario_id;
  }
  set usuario_id(id) {
    this.#usuario_id = id;
  }

  static async findByPk(id) {
    try {
      const resultado = await ResenhaModel.findByPk(id);
      return resultado || null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const resultados = await ResenhaModel.findAll();
      return resultados || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(novaResenha) {
    try {
      const resenha = await ResenhaModel.create({
        titulo: novaResenha.titulo,
        conteudo: novaResenha.conteudo,
        nota: novaResenha.nota,
        livro_id: novaResenha.livro_id,
        usuario_id: novaResenha.usuario_id,
      });
      return resenha;
    } catch (error) {
      throw error;
    }
  }

  static async update(dados, idResenha) {
    try {
      const resultado = await ResenhaModel.update(dados, {
        where: { id: idResenha },
      });
      return resultado;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const data = await ResenhaModel.findByPk(id);
      if (data) {
        await data.destroy();
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}

const ResenhaModel = db.define(
  "resenha",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    titulo: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },

    conteudo: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    nota: {
      type: Sequelize.INTEGER,
      allowNull: false,
      // opcional: se quiser já reforçar no model:
      validate: {
        min: 1,
        max: 5,
      },
    },

    livro_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    usuario_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "resenhas",
    timestamps: false,
  }
);

module.exports = { Resenha, ResenhaModel };
