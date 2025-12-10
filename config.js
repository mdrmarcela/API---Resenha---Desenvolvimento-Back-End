module.exports = {
  dbconfig: {
    database: 'advogados_db', // nome do banco no phpMyAdmin
    user: 'root',             // padrão do XAMPP
    passwd: '',               // senha em branco 
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    define: {
      underscored: false,
      freezeTableName: false,
      timestamps: true, 
      paranoid: false,
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'minha_chave_super_secreta_123',
    expiresIn: '1h', 
  },
};
