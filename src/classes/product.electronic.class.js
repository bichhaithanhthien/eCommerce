const { BadRequestErrorResponse } = require("../core/error.response");
const Product = require("./product.class");
const ProductElectronicsModel = require("../models/product.electronics.model");
const { generateCreatedFailErrorMessage } = require("../utils/string.util");

class ElectronicProduct extends Product {
  async createProduct() {
    const newElectronicProduct = await ProductElectronicsModel.create({
      ...this.productAttributes,
      productSeller: this.productSeller,
    });
    if (!newElectronicProduct)
      throw new BadRequestErrorResponse(
        generateCreatedFailErrorMessage("a new electronic product")
      );

    const newProduct = await super.createProduct(newElectronicProduct._id);
    if (!newProduct)
      throw new BadRequestErrorResponse(
        generateCreatedFailErrorMessage("a new product")
      );

    return newProduct;
  }
}

module.exports = ElectronicProduct;
