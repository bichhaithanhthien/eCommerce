const slugify = require("slugify");
const {
  generate,
  ObjectId,
  Mixed,
  model,
} = require("../helpers/model.helper.js");
const {
  productTypeValueSchema,
  ProductType,
  ProductStatus,
  productStatusValueSchema,
} = require("../enums");
const COLLECTION_NAME = "Products";
const DOCUMENT_NAME = "Product";

const productSchema = generate({
  schema: {
    productName: {
      type: String,
      require: true,
    },
    productThumb: {
      type: String,
      require: true,
    },
    productDescription: {
      type: String,
    },
    productSlug: {
      type: String,
    },
    productPrice: {
      type: Number,
      require: true,
    },
    productQuantity: {
      type: Number,
      require: true,
    },
    productType: {
      type: Number,
      enum: ProductType.getIds(),
      default: new ProductType(productTypeValueSchema.Enum.Electronics).id,
      require: true,
    },
    productAttributes: {
      type: Mixed,
      require: true,
    },
    productRatingAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be greater than or equal 0"],
      max: [5, "Rating must be less than or equal 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    productStatus: {
      type: Number,
      enum: ProductStatus.getIds(),
      default: new ProductStatus(productStatusValueSchema.Enum.Draft).id,
      require: true,
    },
    productSeller: {
      type: ObjectId,
      require: true,
      ref: "User",
    },
  },
  collectionName: COLLECTION_NAME,
  schemaOnly: true,
});

productSchema.index({ productName: "text", productDescription: "text" });

// MEMO: Can not use arrow function here
productSchema.pre("save", async function (next) {
  this.productSlug = slugify(this.productName, { lower: true });
  next();
});

module.exports = model(DOCUMENT_NAME, productSchema);
