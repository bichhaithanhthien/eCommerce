"use strict";
const { generate } = require("../helpers/model.helper.js");
const {
  apiKeyPermissionValueSchema,
  ApiKeyPermission,
  apiKeyStatusValueSchema,
  ApiKeyStatus,
} = require("../enums");
const COLLECTION_NAME = "ApiKeys";
const DOCUMENT_NAME = "ApiKey";

module.exports = generate({
  schema: {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Number,
      enum: ApiKeyStatus.getIds(),
      default: new ApiKeyStatus(apiKeyStatusValueSchema.Enum.Inactive).id,
      require: true,
    },
    permissions: {
      type: [Number],
      enum: ApiKeyPermission.getIds(),
      default: [new ApiKeyPermission(apiKeyPermissionValueSchema.Enum.All).id],
    },
  },
  collectionName: COLLECTION_NAME,
  documentName: DOCUMENT_NAME,
});
