const conexao = require("./conexao.js");

// Carrega e registra os models no Sequelize
require("./Usuario.js");
require("./Livro.js");
require("./Resenha.js");

// Configura os relacionamentos
require("./relations.js")(conexao.models);

conexao
  .sync({})
  .then(() => {
    console.log("sincronizacao com bd...");
  })
  .catch((err) => {
    console.log("falha ao sincronizar: " + err.message);
  });

// Exporta diretamente os models do Sequelize
module.exports = conexao.models;

// Explico que um livro tem várias resenhas;
// Uma resenha pertence a um livro;
// Um usuário pode fazer várias resenhas;
// Uma resenha pertence a um usuário;

// Todos os models passam por aqui antes de ir para os controllers.
