const { z } = require("zod");

const productStatusValueSchema = z.enum([
  "Unknown",
  "Draft",
  "Published",
  "Unpublished",
]);

class ProductStatus {
  constructor(value) {
    this.value = value;
    this.id = productStatusValueSchema.options.indexOf(value);
  }

  static fromId = (id) => {
    return new ProductStatus(productStatusValueSchema.options[id]);
  };

  static getIds = () => {
    return productStatusValueSchema.options.map((_, index) => index);
  };
}

module.exports = {
  productStatusValueSchema,
  ProductStatus,
};
