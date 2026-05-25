const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

function createApp() {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => {
    res.status(200).json({ ok: true, service: "trusolution-backend" });
  });

  app.use("/api/v1", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;

