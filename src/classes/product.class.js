const ProductModel = require("../models/product.model");
const { updateProduct } = require("../models/repositories/product.repo");

class Product {
  constructor({
    productName,
    productThumb,
    productDescription,
    productPrice,
    productQuantity,
    productType,
    productAttributes,
    productSeller,
  }) {
    this.productName = productName;
    this.productThumb = productThumb;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productAttributes = productAttributes;
    this.productSeller = productSeller;
  }

  async createProduct(productId) {
    return await ProductModel.create({
      ...this,
      _id: productId,
    });
  }

  async updateProduct(productId, payload) {
    return await updateProduct({ productId, payload, model: ProductModel });
  }
}

module.exports = Product;
