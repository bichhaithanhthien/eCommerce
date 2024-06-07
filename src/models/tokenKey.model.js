"use strict";
const { generate, ObjectId } = require("../helpers/model.helper.js");
const COLLECTION_NAME = "TokenKeys";
const DOCUMENT_NAME = "TokenKey";

module.exports = generate({
  schema: {
    user: {
      type: ObjectId,
      require: true,
      ref: "User",
    },
    privateKey: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      require: true,
    },
    usedToken: {
      type: Array,
      default: [],
    },
  },
  collectionName: COLLECTION_NAME,
  documentName: DOCUMENT_NAME,
});
