require("dotenv").config();

const createApp = require("./app");

const PORT = Number(process.env.PORT || 4000);

async function start() {
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`TRUSOLUTION backend listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
