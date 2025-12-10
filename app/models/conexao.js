//Conexão do sequelize com o banco de dados

const config = require('../../config.js');
const dbconfig = config.dbconfig;
const Sequelize = require('sequelize');

const conexao = new Sequelize( //Instanciando o Sequelize. Passando os parametros de conexão
  dbconfig.database,
  dbconfig.user,
  dbconfig.passwd,
  {
    host: dbconfig.host,
    dialect: dbconfig.dialect,
    pool: {
      max: dbconfig.pool.max,
      min: dbconfig.pool.min,
      acquire: dbconfig.pool.acquire,
      idle: dbconfig.pool.idle,
    },
    define: {
      underscored: dbconfig.define.underscored,
      freezeTableName: dbconfig.define.freezeTableName,
      timestamps: dbconfig.define.timestamps, 
      paranoid: dbconfig.define.paranoid,
    },
    dialectOptions: {
      dateStrings: false,
      typeCast: function (field, next) {
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
    timezone: '-03:00',
  }
);

conexao
  .authenticate()
  .then(() => {
    console.log('Conexao com o BD realizada com sucesso.');
  })
  .catch((error) => {
    console.error('Nao foi possivel se conectar com o BD:', error);
  });

module.exports = conexao;
