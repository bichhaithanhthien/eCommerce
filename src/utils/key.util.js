"use strict";
const crypto = require("crypto");

const createPairOfKeys = () => {
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");

  return { privateKey, publicKey };
};

module.exports = {
  createPairOfKeys,
};
