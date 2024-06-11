const { generate, Boolean } = require("../helpers/model.helper.js");
const {
  userRoleValueSchema,
  UserRole,
  userStatusValueSchema,
  UserStatus,
} = require("../enums");

const COLLECTION_NAME = "Users";
const DOCUMENT_NAME = "User";

module.exports = generate({
  schema: {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: UserStatus.getIds(),
      default: new UserStatus(userStatusValueSchema.Enum.Inactive).id,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [Number],
      enum: UserRole.getIds(),
      default: [new UserRole(userRoleValueSchema.Enum.Shop).id],
    },
  },
  collectionName: COLLECTION_NAME,
  documentName: DOCUMENT_NAME,
});
