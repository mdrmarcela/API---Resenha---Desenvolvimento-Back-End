const conexao = require('./conexao.js');

// Carrega e registra os models no Sequelize
require('./Usuario.js'); //Não carrega nada, apenas executa. 
require('./Advogado.js');
require('./Processo.js');

// Configura os relacionamentos
require('./relations.js')(conexao.models);

conexao
  .sync({})
  .then(() => {
    console.log('sincronizacao com bd...');
  })
  .catch((err) => {
    console.log('falha ao sincronizar: ' + err.message);
  });

// Exporta diretamente os models do Sequelize
module.exports = conexao.models;


// Explico que um advogado tem vários processsos;
//Um processo pertence a um advogado;

//Todos os models passam por aqui antes de ir para os controllers. 