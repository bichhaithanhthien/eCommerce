const { z } = require("zod");

const userRoleValueSchema = z.enum([
  "Unknown",
  "Shop",
  "Writer",
  "Editor",
  "Admin",
]);

class UserRole {
  constructor(value) {
    this.value = value;
    this.id = userRoleValueSchema.options.indexOf(value);
  }

  static fromId = (id) => {
    return new UserRole(userRoleValueSchema.options[id]);
  };

  static getIds = () => {
    return userRoleValueSchema.options.map((_, index) => index);
  };
}

module.exports = {
  userRoleValueSchema,
  UserRole,
};
