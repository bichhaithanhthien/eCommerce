const isPrdEnv = (env = process.env.NODE_ENV) => {
  return env === "prd";
};

const isDevEnv = (env = process.env.NODE_ENV) => {
  return env ? env === "dev" : true;
};

module.exports = {
  isPrdEnv,
  isDevEnv,
};
