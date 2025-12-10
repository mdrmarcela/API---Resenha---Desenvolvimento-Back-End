const express = require('express');
require('dotenv').config(); // carrega JWT_SECRET etc.

// carrega models + relations + sync com o BD
require('./app/models'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// middleware de autenticação
const auth = require('./app/middlewares/TokenValido');

const app = express();

// middleware pra ler JSON do body
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rotas
const usuarioRoutes = require('./app/routes/usuario.routes');
const livroRoutes = require('./app/routes/livro.routes');
const resenhaRoutes = require('./app/routes/resenha.routes');

// rotas públicas
app.use('/usuario', usuarioRoutes);

// rotas protegidas
app.use('/livro', auth.check, livroRoutes);
app.use('/resenha', auth.check, resenhaRoutes);

// porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor on-line na porta ${PORT}`);
});

module.exports = app;