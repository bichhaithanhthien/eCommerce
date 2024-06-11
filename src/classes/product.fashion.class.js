const { BadRequestErrorResponse } = require("../core/error.response");
const Product = require("./product.class");
const ProductFashionModel = require("../models/product.fashion.model");
const { generateCreatedFailErrorMessage } = require("../utils/string.util");
const { updateProduct } = require("../models/repositories/product.repo");

class FashionProduct extends Product {
  async createProduct() {
    const newFashionProduct = await ProductFashionModel.create({
      ...this.productAttributes,
      productSeller: this.productSeller,
    });
    if (!newFashionProduct)
      throw new BadRequestErrorResponse(
        generateCreatedFailErrorMessage("a new fashion product")
      );

    const newProduct = await super.createProduct(newFashionProduct._id);
    if (!newProduct)
      throw new BadRequestErrorResponse(
        generateCreatedFailErrorMessage("a new product")
      );

    return newProduct;
  }

  async updateProduct(productId) {
    const payload = this;
    if (payload.productAttributes) {
      await updateProduct({ productId, payload, model: ProductFashionModel });
    }
    return await super.updateProduct(productId, payload);
  }
}

module.exports = FashionProduct;
