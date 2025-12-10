const Sequelize = require("sequelize");
const db = require("./conexao.js");

class Livro {
  #titulo;
  #autor;
  #genero;
  #isbn;

  constructor() {}

  get titulo() {
    return this.#titulo;
  }
  set titulo(titulo) {
    this.#titulo = titulo;
  }

  get autor() {
    return this.#autor;
  }
  set autor(autor) {
    this.#autor = autor;
  }

  get genero() {
    return this.#genero;
  }
  set genero(genero) {
    this.#genero = genero;
  }

  get isbn() {
    return this.#isbn;
  }
  set isbn(isbn) {
    this.#isbn = isbn;
  }

  // ===== Métodos que falam com o banco =====
  static async findByPk(id) {
    try {
      const resultado = await LivroModel.findByPk(id);
      return resultado || null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const resultados = await LivroModel.findAll();
      return resultados || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(novoLivro) {
    try {
      const livro = await LivroModel.create({
        titulo: novoLivro.titulo,
        autor: novoLivro.autor,
        genero: novoLivro.genero,
        isbn: novoLivro.isbn,
      });
      return livro;
    } catch (error) {
      throw error;
    }
  }

  static async update(dados, idLivro) {
    try {
      const resultado = await LivroModel.update(dados, {
        where: { id: idLivro },
      });
      return resultado;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const data = await LivroModel.findByPk(id);
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

const LivroModel = db.define(
  "livro",
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
    autor: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    genero: {
      type: Sequelize.STRING(80),
      allowNull: true,
    },
    isbn: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "livros",
    timestamps: false,
  }
);

module.exports = { Livro, LivroModel };
