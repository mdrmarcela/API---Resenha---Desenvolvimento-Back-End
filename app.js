const express = require("express");
require("dotenv").config();

require("./app/models");

const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(express.json());

// CORS 
app.use(
  cors({
    origin:  ["http://localhost:5173"],
  credentials: true
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rotas
const usuarioRoutes = require("./app/routes/usuario.routes");
const livroRoutes = require("./app/routes/livro.routes");

app.use("/usuarios", usuarioRoutes);
app.use("/livros", livroRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor on-line na porta ${PORT}`);
});

module.exports = app;
