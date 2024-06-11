const { generate, ObjectId } = require("../helpers/model.helper.js");
const COLLECTION_NAME = "FashionProducts";
const DOCUMENT_NAME = "FashionProduct";

module.exports = generate({
  schema: {
    brand: {
      type: String,
      require: true,
    },
    size: {
      type: String,
    },
    material: {
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
