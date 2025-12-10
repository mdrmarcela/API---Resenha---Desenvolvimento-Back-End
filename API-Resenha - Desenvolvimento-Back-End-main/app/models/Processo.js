const Sequelize = require('sequelize');
const db = require('./conexao.js');

class Processo {
  #numero_processo;
  #descricao;
  #status;
  #id_advogado;

  constructor() {}

  get numero_processo() {
    return this.#numero_processo;
  }
  set numero_processo(n) {
    this.#numero_processo = n;
  }

  get descricao() {
    return this.#descricao;
  }
  set descricao(d) {
    this.#descricao = d;
  }

  get status() {
    return this.#status;
  }
  set status(s) {
    this.#status = s;
  }

  get id_advogado() {
    return this.#id_advogado;
  }
  set id_advogado(id) {
    this.#id_advogado = id;
  }

  static async findByPk(id) {
    try {
      const resultado = await ProcessoModel.findByPk(id);
      return resultado || null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const resultados = await ProcessoModel.findAll();
      return resultados || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(novoProcesso) {
    try {
      const processo = await ProcessoModel.create({
        numero_processo: novoProcesso.numero_processo,
        descricao: novoProcesso.descricao,
        status: novoProcesso.status,
        id_advogado: novoProcesso.id_advogado,
      });
      return processo;
    } catch (error) {
      throw error;
    }
  }

  static async update(dados, idProcesso) {
    try {
      const resultado = await ProcessoModel.update(dados, {
        where: { id: idProcesso },
      });
      return resultado;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const data = await ProcessoModel.findByPk(id);
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

const ProcessoModel = db.define(
  'processo',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    numero_processo: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    descricao: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'aberto',
    },
    id_advogado: {
      type: Sequelize.INTEGER,
      allowNull: false, 
    },
  },
  {
      tableName: 'processos',
    timestamps: false, 
  }
);

module.exports = { Processo, ProcessoModel };
