const express = require("express");
require("dotenv").config();

require("./app/models");

const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(express.json());

// CORS (ajuste o FRONTEND_URL no .env)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rotas
const usuarioRoutes = require("./app/routes/usuario.routes");
const livroRoutes = require("./app/routes/livro.routes");

// base correta e no plural
app.use("/usuarios", usuarioRoutes);
app.use("/livros", livroRoutes);

// (Opcional)
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor on-line na porta ${PORT}`);
});

module.exports = app;
