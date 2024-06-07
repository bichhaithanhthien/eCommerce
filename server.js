const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/server.config");

const PORT = port || 3055;

const server = app.listen(PORT, () => {
  console.log(`server start listen port ${PORT}...`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`Server (port: ${PORT}) closed.`));
});
