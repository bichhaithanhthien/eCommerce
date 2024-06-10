"use strict";
const { generate, ObjectId } = require("../helpers/model.helper.js");
const COLLECTION_NAME = "ElectronicProducts";
const DOCUMENT_NAME = "ElectronicProduct";

module.exports = generate({
  schema: {
    manufactory: {
      type: String,
      require: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    productSeller: {
      type: ObjectId,
      require: true,
      ref: "User",
    },
  },
  collectionName: COLLECTION_NAME,
  documentName: DOCUMENT_NAME,
});
