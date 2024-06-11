const { z } = require("zod");

const productTypeValueSchema = z.enum(["Unknown", "Electronics", "Fashion"]);

class ProductType {
  constructor(value) {
    this.value = value;
    this.id = productTypeValueSchema.options.indexOf(value);
  }

  static fromId = (id) => {
    return new ProductType(productTypeValueSchema.options[id]);
  };

  static getIds = () => {
    return productTypeValueSchema.options.map((_, index) => index);
  };
}

module.exports = {
  productTypeValueSchema,
  ProductType,
};
