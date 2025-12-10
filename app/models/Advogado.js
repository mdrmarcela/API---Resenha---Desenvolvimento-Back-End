const Sequelize = require('sequelize');
const db = require('./conexao.js');

class Advogado {
  #nome;
  #oab;
  #especialidade;

  constructor() {}

  get nome() {
    return this.#nome;
  }
  set nome(nome) {
    this.#nome = nome;
  }

  get oab() {
    return this.#oab;
  }
  set oab(oab) {
    this.#oab = oab;
  }

  get especialidade() {
    return this.#especialidade;
  }
  set especialidade(e) {
    this.#especialidade = e;
  }

  static async findByPk(id) { //Métodos que falam com o banco 
    try {
      const resultado = await AdvogadoModel.findByPk(id);
      return resultado || null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const resultados = await AdvogadoModel.findAll();
      return resultados || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(novoAdvogado) { //Recebe o novo advogado, chama o create, criao registro no banco e devolte. 
    try {
      const advogado = await AdvogadoModel.create({
        nome: novoAdvogado.nome,
        oab: novoAdvogado.oab,
        especialidade: novoAdvogado.especialidade,
      });
      return advogado;
    } catch (error) {
      throw error;
    }
  }

  static async update(dados, idAdvogado) { //Atualiza os dados do advogado. 
    try {
      const resultado = await AdvogadoModel.update(dados, {
        where: { id: idAdvogado },
      });
      return resultado;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const data = await AdvogadoModel.findByPk(id);
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

const AdvogadoModel = db.define(
  'advogado',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    oab: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true, 
    },
    especialidade: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
  },
  {
     tableName: 'advogados',
    timestamps: false, 
  
  }
);

module.exports = { Advogado, AdvogadoModel };
