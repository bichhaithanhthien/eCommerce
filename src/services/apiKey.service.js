"use strict";
const { ApiKeyStatus, apiKeyStatusValueSchema } = require("../enums");
const ApiKeyModel = require("../models/apiKey.model");

class ApiKeyService {
  static findOneByKey = async (key) => {
    return await ApiKeyModel.findOne({
      key,
      status: new ApiKeyStatus(apiKeyStatusValueSchema.Enum.Active).id,
    }).lean();
  };
}

module.exports = ApiKeyService;
