require("dotenv").config();
const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { isDevEnv } = require("./utils/envChecker.util");
const { initData } = require("./helpers/initData.helper");
require("./helpers/global.helper.js");
//const { checkOverload } = require("./helpers/connectionChecker.helper");

const app = express();

/*
  Init middlewares
  MEMO:
    dev env: dev
    prd env: combined
*/
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Init DB
require("./db/init.mongodb");
// checkOverload();
if (isDevEnv()) {
  initData();
}

// Init routes
app.use("/", require("./routes"));

// Init handling errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
