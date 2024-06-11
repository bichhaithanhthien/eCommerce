const { z } = require("zod");

const userStatusValueSchema = z.enum(["Unknown", "Active", "Inactive"]);

class UserStatus {
  constructor(value) {
    this.value = value;
    this.id = userStatusValueSchema.options.indexOf(value);
  }

  static fromId = (id) => {
    return new UserStatus(userStatusValueSchema.options[id]);
  };

  static getIds = () => {
    return userStatusValueSchema.options.map((_, index) => index);
  };
}

module.exports = {
  userStatusValueSchema,
  UserStatus,
};
