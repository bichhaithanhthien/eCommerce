const ElectronicProductClass = require("../classes/product.electronic.class");
const FashionProductClass = require("../classes/product.fashion.class");
const { ProductType, productTypeValueSchema } = require("../enums");

const ElectronicProductType = new ProductType(
  productTypeValueSchema.Enum.Electronics
);
const FashionProductType = new ProductType(productTypeValueSchema.Enum.Fashion);

const productServiceConfig = {
  [ElectronicProductType.id]: ElectronicProductClass,
  [FashionProductType.id]: FashionProductClass,
};

module.exports = {
  productServiceConfig,
};
