module.exports = function (models) {
models.advogado.hasMany(models.processo, {
  foreignKey: 'id_advogado',
  as: 'processos',
});

models.processo.belongsTo(models.advogado, {
  foreignKey: 'id_advogado',
  as: 'advogado',
});

};
