module.exports = function (models) {
  // Livro 1:N Resenha
  models.livro.hasMany(models.resenha, {
    foreignKey: "livro_id",
    as: "resenhas",
  });

  models.resenha.belongsTo(models.livro, {
    foreignKey: "livro_id",
    as: "livro",
  });

  // Usuario 1:N Resenha
  models.usuario.hasMany(models.resenha, {
    foreignKey: "usuario_id",
    as: "resenhas",
  });

  models.resenha.belongsTo(models.usuario, {
    foreignKey: "usuario_id",
    as: "usuario",
  });
};
