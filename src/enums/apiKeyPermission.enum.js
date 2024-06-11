const { z } = require("zod");

const apiKeyPermissionValueSchema = z.enum(["Unknown", "All"]);

class ApiKeyPermission {
  constructor(value) {
    this.value = value;
    this.id = apiKeyPermissionValueSchema.options.indexOf(value);
  }

  static fromId = (id) => {
    return new ApiKeyPermission(apiKeyPermissionValueSchema.options[id]);
  };

  static getIds = () => {
    return apiKeyPermissionValueSchema.options.map((_, index) => index);
  };
}

module.exports = {
  apiKeyPermissionValueSchema,
  ApiKeyPermission,
};
