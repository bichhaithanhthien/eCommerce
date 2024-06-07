"use strict";
const JWT = require("jsonwebtoken");
const { BadRequestErrorResponse } = require("../core/error.response");

const createToken = async (payload, privateKey) => {
  try {
    const token = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(token, privateKey, (error) => {
      if (error) throw new BadRequestErrorResponse("Verified token fail.");
    });
    return token;
  } catch (error) {
    throw new BadRequestErrorResponse("Created token pair fail.");
  }
};

const verifyJWT = async (token, key) => {
  return await JWT.verify(token, key, (error, decode) => {
    if (error) throw new BadRequestErrorResponse("Verified token fail.");
    else return decode;
  });
};

module.exports = {
  createToken,
  verifyJWT,
};
