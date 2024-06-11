const { z } = require("zod");

const apiKeyStatusValueSchema = z.enum(["Unknown", "Active", "Inactive"]);

class ApiKeyStatus {
  constructor(value) {
    this.value = value;
    this.id = apiKeyStatusValueSchema.options.indexOf(value);
  }

  static fromId = (id) => {
    return new ApiKeyStatus(apiKeyStatusValueSchema.options[id]);
  };

  static getIds = () => {
    return apiKeyStatusValueSchema.options.map((_, index) => index);
  };
}

module.exports = {
  apiKeyStatusValueSchema,
  ApiKeyStatus,
};
