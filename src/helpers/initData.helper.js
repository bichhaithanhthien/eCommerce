"use strict";
const { ApiKeyStatus, apiKeyStatusValueSchema } = require("../enums");
const ApiKeyModel = require("../models/apiKey.model");
const ApiKeyService = require("../services/apiKey.service");

const initData = async () => {
  if (process.env.API_KEY) {
    const defaultApiKey = await ApiKeyService.findOneByKey(process.env.API_KEY);
    !defaultApiKey &&
      (await ApiKeyModel.create({
        key: process.env.API_KEY,
        status: new ApiKeyStatus(apiKeyStatusValueSchema.Enum.Active).id,
      }));
  }
};

module.exports = {
  initData,
};
