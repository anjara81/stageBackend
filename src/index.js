require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const districtsRoutes = require("./routes/districts.routes");
const programmesRoutes = require("./routes/programmes.routes");
const indicateursRoutes = require("./routes/indicateurs.routes");
const valeursRoutes = require("./routes/valeurs.routes");
const servicesRoutes = require("./routes/services.routes");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API DRSP Analamanga opérationnelle" });
});

app.use("/api/auth", authRoutes);
app.use("/api/districts", districtsRoutes);
app.use("/api/programmes", programmesRoutes);
app.use("/api/indicateurs", indicateursRoutes);
app.use("/api/valeurs", valeursRoutes);
app.use("/api/services", servicesRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});

const utilisateursRoutes = require("./routes/utilisateurs.routes");
// ...
app.use("/api/utilisateurs", utilisateursRoutes);